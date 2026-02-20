import React, { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const navRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState('hero');
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollPos = window.scrollY || document.documentElement.scrollTop;
      const viewportMid = scrollPos + window.innerHeight * 0.45;
      
      let currentId = '';
      sections.forEach((sec) => {
        const top = (sec as HTMLElement).offsetTop;
        const bottom = top + (sec as HTMLElement).offsetHeight;
        if (viewportMid >= top && viewportMid < bottom) {
          currentId = sec.id;
        }
      });

      if (currentId && currentId !== activeId) {
        setActiveId(currentId);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeId]);

  useEffect(() => {
    if (navRef.current && !isMenuOpen) {
      const activeLink = navRef.current.querySelector(`a[href="#${activeId}"]`) as HTMLElement;
      if (activeLink) {
        const navRect = navRef.current.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();
        setIndicatorStyle({
          transform: `translateX(${linkRect.left - navRect.left}px) translateY(-50%)`,
          width: `${linkRect.width}px`,
          opacity: 1,
        });
      }
    }
  }, [activeId, isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = ['hero', 'education', 'skills', 'projects', 'certifications', 'contact', 'social'];

  return (
    <>
      {/* Desktop Navbar */}
      <header className="hidden md:flex fixed top-5 left-1/2 -translate-x-1/2 items-center gap-10 p-3 px-6 bg-card backdrop-blur-md border border-border rounded-full z-50 shadow-lg transition-all duration-300">
        <div className="w-8 h-8 rounded-lg overflow-hidden bg-black flex items-center justify-center border border-white/10">
          <img src="/favicon.svg" alt="MG Logo" className="w-full h-full object-cover" />
        </div>
        <nav ref={navRef} className="relative flex gap-6">
          {navLinks.map((section) => (
            <a
              key={section}
              href={`#${section}`}
              className={`text-muted text-[13px] font-medium transition-colors duration-300 relative z-10 py-1.5 hover:text-site-text ${
                activeId === section ? 'text-site-text' : ''
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </a>
          ))}
          <span
            className="absolute top-1/2 -translate-y-1/2 h-8 bg-accent/10 rounded-full z-0 transition-all duration-300 ease-out pointer-events-none"
            style={indicatorStyle}
          ></span>
        </nav>
      </header>

      {/* Mobile Navbar */}
      <header className="md:hidden fixed top-0 left-0 right-0 p-4 flex justify-between items-center bg-card/80 backdrop-blur-md border-b border-border z-50">
        <div className="font-mono font-bold text-sm text-site-text tracking-tighter opacity-90">ganesh.exe</div>
        <div className="flex items-center gap-4">
            <button onClick={toggleMenu} className="text-site-text p-2" aria-label="Toggle menu">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/95 z-40 flex flex-col items-center justify-center gap-8 md:hidden">
          {navLinks.map((section) => (
            <a
              key={section}
              href={`#${section}`}
              onClick={() => setIsMenuOpen(false)}
              className={`text-2xl font-mono font-bold ${
                activeId === section ? 'text-accent' : 'text-muted'
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </a>
          ))}
        </div>
      )}
    </>
  );
};

export default Navbar;
