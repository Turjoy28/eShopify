const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          15% { transform: scale(1.25); opacity: 1; }
          30% { transform: scale(0.9); opacity: 0.7; }
          45% { transform: scale(1.15); opacity: 0.9; }
          60% { transform: scale(1); opacity: 0.6; }
        }
        .ring-wrapper {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ellipse-ring {
          position: absolute;
          width: 100%;
          height: 40%;
          border-radius: 50%;
          animation: pulse-ring 3s ease-in-out infinite;
        }
        .orbit-dot {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          top: -3px;
          left: 50%;
          margin-left: -3px;
          box-shadow: 0 0 8px currentColor;
        }
        .center-ring {
          position: absolute;
          border-radius: 50%;
          animation: heartbeat 1.5s ease-in-out infinite;
        }
      `}</style>

      <div className="relative w-32 h-32">
        {/* Ring 1 */}
        <div className="ring-wrapper" style={{ transform: 'rotateX(75deg) rotateZ(0deg)' }}>
          <div className="ellipse-ring border-2 border-cyan-400" style={{ animationDelay: '0s' }}>
            <div className="absolute inset-0 animate-[orbit_4s_linear_infinite]">
              <div className="orbit-dot bg-cyan-400 text-cyan-400"></div>
            </div>
          </div>
        </div>

        {/* Ring 2 */}
        <div className="ring-wrapper" style={{ transform: 'rotateX(75deg) rotateZ(45deg)' }}>
          <div className="ellipse-ring border-2 border-blue-400" style={{ animationDelay: '0.3s' }}>
            <div className="absolute inset-0 animate-[orbit_5s_linear_infinite]">
              <div className="orbit-dot bg-blue-400 text-blue-400"></div>
            </div>
          </div>
        </div>

        {/* Ring 3 */}
        <div className="ring-wrapper" style={{ transform: 'rotateX(75deg) rotateZ(90deg)' }}>
          <div className="ellipse-ring border-2 border-sky-400" style={{ animationDelay: '0.6s' }}>
            <div className="absolute inset-0 animate-[orbit_4.5s_linear_infinite]">
              <div className="orbit-dot bg-sky-400 text-sky-400"></div>
            </div>
          </div>
        </div>

        {/* Ring 4 */}
        <div className="ring-wrapper" style={{ transform: 'rotateX(75deg) rotateZ(135deg)' }}>
          <div className="ellipse-ring border-2 border-cyan-300" style={{ animationDelay: '0.9s' }}>
            <div className="absolute inset-0 animate-[orbit_5.5s_linear_infinite]">
              <div className="orbit-dot bg-cyan-300 text-cyan-300"></div>
            </div>
          </div>
        </div>

        {/* Ring 5 */}
        <div className="ring-wrapper" style={{ transform: 'rotateX(70deg) rotateZ(22deg)' }}>
          <div className="ellipse-ring border-2 border-blue-500" style={{ animationDelay: '1.2s' }}>
            <div className="absolute inset-0 animate-[orbit_6s_linear_infinite]">
              <div className="orbit-dot bg-blue-500 text-blue-500"></div>
            </div>
          </div>
        </div>

        {/* Ring 6 */}
        <div className="ring-wrapper" style={{ transform: 'rotateX(70deg) rotateZ(67deg)' }}>
          <div className="ellipse-ring border-2 border-sky-500" style={{ animationDelay: '1.5s' }}>
            <div className="absolute inset-0 animate-[orbit_4.8s_linear_infinite]">
              <div className="orbit-dot bg-sky-500 text-sky-500"></div>
            </div>
          </div>
        </div>

        {/* Ring 7 */}
        <div className="ring-wrapper" style={{ transform: 'rotateX(70deg) rotateZ(112deg)' }}>
          <div className="ellipse-ring border-2 border-cyan-500" style={{ animationDelay: '1.8s' }}>
            <div className="absolute inset-0 animate-[orbit_5.2s_linear_infinite]">
              <div className="orbit-dot bg-cyan-500 text-cyan-500"></div>
            </div>
          </div>
        </div>

        {/* Center heartbeat rings - horizontal & vertical crossing */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Horizontal ring 1 */}
          <div className="center-ring w-10 h-10 border-2 border-cyan-400" style={{ animationDelay: '0s' }}></div>
          {/* Horizontal ring 2 */}
          <div className="center-ring w-7 h-7 border-2 border-blue-400" style={{ animationDelay: '0.2s' }}></div>
          {/* Horizontal ring 3 */}
          <div className="center-ring w-4 h-4 border-2 border-sky-300" style={{ animationDelay: '0.4s' }}></div>

          {/* Vertical ring 1 */}
          <div className="center-ring w-10 h-10 border-2 border-sky-400" style={{ animationDelay: '0.1s', transform: 'rotateX(90deg)' }}></div>
          {/* Vertical ring 2 */}
          <div className="center-ring w-7 h-7 border-2 border-cyan-300" style={{ animationDelay: '0.3s', transform: 'rotateX(90deg)' }}></div>
          {/* Vertical ring 3 */}
          <div className="center-ring w-4 h-4 border-2 border-blue-300" style={{ animationDelay: '0.5s', transform: 'rotateX(90deg)' }}></div>

          {/* Diagonal cross rings */}
          <div className="center-ring w-8 h-8 border-2 border-cyan-400/90" style={{ animationDelay: '0.15s', transform: 'rotateX(90deg) rotateY(45deg)' }}></div>
          <div className="center-ring w-6 h-6 border-2 border-sky-400/90" style={{ animationDelay: '0.35s', transform: 'rotateX(90deg) rotateY(-45deg)' }}></div>

          {/* Center glowing dot */}
          <div className="absolute w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_5px_rgba(34,211,238,0.6)] animate-pulse"></div>
        </div>

        {/* Floating particles */}
        <div className="absolute top-4 left-6 w-1.5 h-1.5 bg-blue-500/50 rounded-full animate-pulse"></div>
        <div className="absolute bottom-8 right-4 w-1 h-1 bg-blue-400/50 rounded-full animate-ping"></div>
        <div className="absolute top-10 right-6 w-1 h-1 bg-sky-400/40 rounded-full animate-pulse"></div>
        <div className="absolute bottom-4 left-8 w-1.5 h-1.5 bg-sky-500/40 rounded-full animate-ping"></div>
        <div className="absolute top-1/2 left-2 w-1 h-1 bg-blue-300/50 rounded-full animate-pulse"></div>
        <div className="absolute top-6 right-10 w-1 h-1 bg-sky-300/50 rounded-full animate-ping"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
