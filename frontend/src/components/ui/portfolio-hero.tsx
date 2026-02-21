import React, { useState, useEffect, useRef, useMemo } from "react";
import { Menu, X } from "lucide-react";
import { api } from '../../services/api';

// Inline Button component
const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

// BlurText animation component
interface BlurTextProps {
  text: string;
  delay?: number;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  className?: string;
  style?: React.CSSProperties;
}

const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 50,
  animateBy = "words",
  direction = "top",
  className = "",
  style,
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const segments = useMemo(() => {
    return animateBy === "words" ? text.split(" ") : text.split("");
  }, [text, animateBy]);

  return (
    <p ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {segments.map((segment, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            filter: inView ? "blur(0px)" : "blur(10px)",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : `translateY(${direction === "top" ? "-20px" : "20px"})`,
            transition: `all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) ${i * delay}ms`,
            ...(segment === ' ' ? { width: '0.25em' } : {}),          }}
        >
          {segment === ' ' ? '\u00A0' : segment}
          {animateBy === "words" && i < segments.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </p>
  );
};

// HyperText Animation Component
const HyperText: React.FC<{ text: string; className?: string; style?: React.CSSProperties }> = ({ text, className, style }) => {
  const [displayText, setDisplayText] = useState("");
  const iterations = useRef(0);
  
  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()";
    // Reset on mount
    iterations.current = 0;
    
    // Slight delay before starting to ensure visibility
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayText(() => 
          text
            .split("")
            .map((_, index) => {
              if (index < iterations.current) {
                return text[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );

        if (iterations.current >= text.length) {
          clearInterval(interval);
        }

        // Slower increment for longer animation (1/10th of a character per frame)
        iterations.current += 1 / 10; 
      }, 50); // Slower frame rate (50ms instead of 30ms)

      return () => clearInterval(interval);
    }, 500); // 500ms initial delay

    return () => clearTimeout(startDelay);
  }, [text]);

  return (
    <h1 
      className={className}
      style={style}
      // Restart animation on hover
      onMouseEnter={() => { iterations.current = 0; }} 
    >
      {displayText || text} 
    </h1>
  );
};

export default function PortfolioHero() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    api.getProfile().then((data: any) => {
      if (data.resume_url) {
        setResumeUrl(data.resume_url);
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const menuItems = useMemo(() => {
    const items: { label: string; href: string; highlight?: boolean; external?: boolean }[] = [
      { label: "HOME", href: "#hero", highlight: true },
      { label: "EDUCATION", href: "#education" },
      { label: "SKILLS", href: "#skills" },
      { label: "PROJECTS", href: "#projects" },
      { label: "CERTIFICATIONS", href: "#certifications" },
      { label: "CONTACT", href: "#contact" },
    ];

    if (resumeUrl) {
      items.push({ label: "RESUME", href: resumeUrl, external: true });
    }

    return items;
  }, [resumeUrl]);

  return (
    <div 
      className="min-h-screen text-foreground transition-colors"
      style={{
        backgroundColor: "hsl(0 0% 0%)",
        color: "hsl(0 0% 100%)",
      }}
    >
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6">
        <nav className="flex items-center justify-between max-w-screen-2xl mx-auto">
          {/* Menu Button */}
          <div className="relative">
            <button
              ref={buttonRef}
              type="button"
              className="p-2 transition-colors duration-300 z-50 text-neutral-500 hover:text-white"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 md:w-8 md:h-8 transition-colors duration-300" strokeWidth={2} />
              ) : (
                <Menu className="w-6 h-6 md:w-8 md:h-8 transition-colors duration-300" strokeWidth={2} />
              )}
            </button>

            {isMenuOpen && (
              <div
                ref={menuRef}
                className="absolute top-full left-0 w-[200px] md:w-[240px] border-none shadow-2xl mt-2 ml-4 p-4 rounded-lg z-[100]"
                style={{
                  backgroundColor: "hsl(0 0% 0%)",
                }}
              >
                {menuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noreferrer" : undefined}
                    className="block text-lg md:text-xl font-bold tracking-tight py-1.5 px-2 cursor-pointer transition-colors duration-300"
                    style={{
                      color: item.highlight ? "#C3E41D" : "hsl(0 0% 100%)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#C3E41D";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = item.highlight ? "#C3E41D" : "hsl(0 0% 100%)";
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Logo / Refresh Button */}
          <button 
            onClick={() => window.location.reload()}
            className="focus:outline-none hover:opacity-80 transition-opacity"
            aria-label="Refresh page"
          >
            <img 
              src="/favicon.png" 
              alt="Logo" 
              className="w-16 h-16 object-contain" 
            />
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">
        
        {/* Content Wrapper - Centered Vertically & Horizontally */}
        <div className="flex flex-col items-center justify-center z-10 w-full max-w-[90vw]">
            
            {/* Profile Picture - Above Name */}
            <div className="mb-5 animate-fade-in-down">
               <div className="w-[120px] h-[160px] sm:w-[140px] sm:h-[190px] md:w-[160px] md:h-[220px] lg:w-[180px] lg:h-[240px] rounded-full overflow-hidden shadow-2xl border-4 border-[#C3E41D]/20 transition-transform duration-300 hover:scale-110 hover:rotate-3 cursor-pointer animate-pulse-glow">
                <img
                  src="/Profile_P.jpeg"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Name - Single Line */}
            <div className="relative text-center mb-2 animate-fade-in-up group w-full px-4 flex justify-center">
               <HyperText
                 text="M GANESH"
                 className="font-bold text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-none tracking-tight uppercase whitespace-nowrap cursor-pointer hover:text-[#D4F542] transition-colors duration-300"
                 style={{ color: "#C3E41D", fontFamily: "'Clash Display', sans-serif" }} 
               />
            </div>

            {/* Tagline */}
            <div className="mb-6 text-center w-full flex justify-center px-4 relative">
                <div className="max-w-3xl mx-auto flex justify-center">
                  <BlurText 
                    text="Aspiring Data Analyst | Uncovering patterns in data."
                    delay={150}
                    animateBy="words"
                    direction="top"
                    className="text-base sm:text-lg md:text-xl lg:text-2xl text-center transition-colors duration-300 text-neutral-400 hover:text-white justify-center font-light tracking-wide inline-block"
                    style={{ fontFamily: "'Antic', sans-serif" }}
                  />
                </div>
            </div>

            {/* Resume Button */}
            {resumeUrl && (
              <div className="animate-fade-in-up flex w-full justify-center items-center" style={{ animationDelay: '0.4s' }}>
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center px-8 py-2.5 rounded-full border border-[#C3E41D] text-[#C3E41D] hover:bg-[#C3E41D] hover:text-black transition-all duration-300 font-medium tracking-wide text-sm sm:text-base bg-transparent"
                  style={{ fontFamily: "'Fira Code', monospace" }}
                >
                  RESUME
                </a>
              </div>
            )}
        </div>

      </div>
    </div>
  );
}
