import React, { useState, useMemo } from "react";
import { SlidersHorizontal, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";

/**
 * Reusable helper function to filter and sort products by price.
 */
export const filterProductsByPrice = (products = [], [min, max] = [0, Infinity], sortBy = "default") => {
  if (!products || !Array.isArray(products)) return [];

  let result = products.filter((product) => {
    const price = Number(product.price);
    return price >= min && price <= max;
  });

  if (sortBy === "price-asc") {
    result = [...result].sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortBy === "price-desc") {
    result = [...result].sort((a, b) => Number(b.price) - Number(a.price));
  }

  return result;
};

/**
 * Compact & Professional Price Filter Component
 * Designed for sidebar or left-aligned layouts.
 */
const PriceFilter = ({
  minPrice = 0,
  maxPrice = 1000,
  priceRange,
  onPriceChange,
  onReset,
  totalCount,
  filteredCount,
  sortBy,
  onSortChange,
  presets,
  className = "",
}) => {
  // Local state fallback if used uncontrolled
  const [internalRange, setInternalRange] = useState([minPrice, maxPrice]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const currentRange = priceRange !== undefined ? priceRange : internalRange;
  const currentMin = currentRange[0] !== undefined ? currentRange[0] : minPrice;
  const currentMax = currentRange[1] !== undefined ? currentRange[1] : maxPrice;

  // Safe boundary bounds
  const safeMin = Math.floor(minPrice);
  const safeMax = Math.max(Math.ceil(maxPrice), safeMin + 1);
  const span = safeMax - safeMin || 1;

  const leftPercent = Math.min(100, Math.max(0, ((currentMin - safeMin) / span) * 100));
  const rightPercent = Math.min(100, Math.max(0, ((safeMax - currentMax) / span) * 100));

  const updateRange = (newMin, newMax) => {
    const clampedMin = Math.max(safeMin, Math.min(newMin, newMax));
    const clampedMax = Math.min(safeMax, Math.max(newMin, newMax));
    const nextRange = [clampedMin, clampedMax];

    if (onPriceChange) {
      onPriceChange(nextRange);
    } else {
      setInternalRange(nextRange);
    }
  };

  const isFilterActive =
    currentMin > safeMin ||
    currentMax < safeMax ||
    (sortBy && sortBy !== "default");

  const handleReset = () => {
    updateRange(safeMin, safeMax);
    if (onSortChange) onSortChange("default");
    if (onReset) onReset();
  };

  // Preset pills
  const activePresets = useMemo(() => {
    if (presets && presets.length > 0) return presets;

    if (safeMax <= 60) {
      return [
        { label: "All", min: safeMin, max: safeMax },
        { label: "< $20", min: safeMin, max: 20 },
        { label: "$20-$40", min: 20, max: 40 },
        { label: "$40+", min: 40, max: safeMax },
      ];
    } else if (safeMax <= 150) {
      return [
        { label: "All", min: safeMin, max: safeMax },
        { label: "< $30", min: safeMin, max: 30 },
        { label: "$30-$75", min: 30, max: 75 },
        { label: "$75-$120", min: 75, max: 120 },
        { label: "$120+", min: 120, max: safeMax },
      ];
    } else {
      return [
        { label: "All", min: safeMin, max: safeMax },
        { label: "< $50", min: safeMin, max: 50 },
        { label: "$50-$100", min: 50, max: 100 },
        { label: "$100-$200", min: 100, max: 200 },
        { label: "$200+", min: 200, max: safeMax },
      ];
    }
  }, [presets, safeMin, safeMax]);

  const isPresetActive = (preset) => currentMin === preset.min && currentMax === preset.max;

  return (
    <div className={`w-full ${className}`}>
      {/* Mobile Toggle Button */}
      <button
        type="button"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden w-full flex items-center justify-between px-4 py-2.5 bg-gray-800/90 border border-gray-700/80 rounded-xl text-sm font-medium text-gray-200 mb-3 shadow-md"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-emerald-400" />
          Filter & Sort
          {isFilterActive && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
          )}
        </span>
        <span className="flex items-center gap-2 text-xs text-gray-400">
          ${currentMin} – ${currentMax}
          {isMobileOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {/* Main Filter Container */}
      <div
        className={`${
          isMobileOpen ? "block" : "hidden"
        } lg:block bg-gray-800/70 backdrop-blur-md border border-gray-700/70 rounded-xl p-4 shadow-lg text-white`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-700/60">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-emerald-400" />
            <span className="text-xs font-semibold tracking-wider uppercase text-gray-200">
              Price Range
            </span>
          </div>

          {isFilterActive && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-emerald-400 transition-colors"
              title="Reset price filter"
            >
              <RotateCcw size={11} />
              Reset
            </button>
          )}
        </div>

        {/* Current Active Range Badge */}
        <div className="my-3 flex items-center justify-between text-xs bg-gray-900/60 px-3 py-1.5 rounded-lg border border-gray-700/50">
          <span className="text-gray-400 text-[11px]">Selected:</span>
          <span className="text-emerald-400 font-semibold tracking-tight">
            ${currentMin} — ${currentMax}
          </span>
        </div>

        {/* Quick Presets */}
        <div className="mb-4">
          <span className="block text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1.5">
            Quick Select
          </span>
          <div className="flex flex-wrap gap-1.5">
            {activePresets.map((preset, idx) => {
              const active = isPresetActive(preset);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => updateRange(preset.min, preset.max)}
                  className={`text-[11px] px-2.5 py-1 rounded-md transition-all border ${
                    active
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-medium shadow-sm"
                      : "bg-gray-900/50 text-gray-400 border-gray-700/50 hover:bg-gray-700/60 hover:text-gray-200"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dual Range Slider */}
        <div className="mb-3">
          <div className="relative w-full h-5 flex items-center">
            {/* Background Track */}
            <div className="w-full h-1.5 bg-gray-700/80 rounded-full relative overflow-hidden">
              <div
                className="absolute top-0 bottom-0 bg-emerald-500 rounded-full"
                style={{
                  left: `${leftPercent}%`,
                  right: `${rightPercent}%`,
                }}
              />
            </div>

            {/* Min Range Slider */}
            <input
              type="range"
              min={safeMin}
              max={safeMax}
              value={currentMin}
              onChange={(e) => {
                const val = Math.min(Number(e.target.value), currentMax);
                updateRange(val, currentMax);
              }}
              className="price-slider absolute inset-0 w-full appearance-none bg-transparent pointer-events-none z-20 focus:outline-none"
              aria-label="Min price"
            />

            {/* Max Range Slider */}
            <input
              type="range"
              min={safeMin}
              max={safeMax}
              value={currentMax}
              onChange={(e) => {
                const val = Math.max(Number(e.target.value), currentMin);
                updateRange(currentMin, val);
              }}
              className="price-slider absolute inset-0 w-full appearance-none bg-transparent pointer-events-none z-20 focus:outline-none"
              aria-label="Max price"
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-gray-500">
            <span>${safeMin}</span>
            <span>${safeMax}</span>
          </div>
        </div>

        {/* Precise Number Inputs */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs">$</span>
            <input
              type="number"
              min={safeMin}
              max={currentMax}
              value={currentMin}
              onChange={(e) => {
                const val = e.target.value === "" ? safeMin : Number(e.target.value);
                updateRange(val, currentMax);
              }}
              className="w-full bg-gray-900/80 border border-gray-700/70 rounded-lg pl-6 pr-2 py-1 text-xs text-gray-200 focus:outline-none focus:border-emerald-500"
              placeholder="Min"
            />
          </div>

          <span className="text-gray-500 text-xs font-light">to</span>

          <div className="flex-1 relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs">$</span>
            <input
              type="number"
              min={currentMin}
              max={safeMax}
              value={currentMax}
              onChange={(e) => {
                const val = e.target.value === "" ? safeMax : Number(e.target.value);
                updateRange(currentMin, val);
              }}
              className="w-full bg-gray-900/80 border border-gray-700/70 rounded-lg pl-6 pr-2 py-1 text-xs text-gray-200 focus:outline-none focus:border-emerald-500"
              placeholder="Max"
            />
          </div>
        </div>

        {/* Optional Sort Section */}
        {onSortChange && (
          <div className="pt-3 border-t border-gray-700/60 mb-2">
            <label
              htmlFor="filter-sort-select"
              className="block text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1.5"
            >
              Sort Order
            </label>
            <select
              id="filter-sort-select"
              value={sortBy || "default"}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full bg-gray-900/80 border border-gray-700/70 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        )}

        {/* Footer Count Status */}
        {filteredCount !== undefined && (
          <div className="pt-2.5 border-t border-gray-700/60 text-[11px] text-gray-400 flex items-center justify-between">
            <span>Matches</span>
            <span className="text-emerald-400 font-medium">
              {totalCount !== undefined
                ? `${filteredCount} / ${totalCount} items`
                : `${filteredCount} items`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceFilter;
