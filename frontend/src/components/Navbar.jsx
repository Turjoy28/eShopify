import { useState } from "react";
import Logo from "./navbar/Logo";
import DesktopNav from "./navbar/DesktopNav";
import MobileMenuButton from "./navbar/MobileMenuButton";
import MobileNavMenu from "./navbar/MobileNavMenu";

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <header className='fixed top-0 left-0 w-full bg-gray-900/95 backdrop-blur-md shadow-lg shadow-blue-500/10 z-40 border-b border-blue-500/20'>
            <div className='w-full px-4 sm:px-8 lg:px-16 xl:px-24 py-3 sm:py-4'>
                <div className='flex justify-between items-center'>
                    <Logo onClick={closeMobileMenu} />
                    <DesktopNav />
                    <MobileMenuButton
                        isOpen={isMobileMenuOpen}
                        toggleMenu={toggleMobileMenu}
                        closeMenu={closeMobileMenu}
                    />
                </div>
            </div>
            <MobileNavMenu isOpen={isMobileMenuOpen} closeMenu={closeMobileMenu} />
        </header>
    );
};

export default Navbar;
