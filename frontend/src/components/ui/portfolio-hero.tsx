import React, { useState, useEffect, useRef, useMemo } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
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
            transition: `all 0.5s ease-out ${i * delay}ms`,
          }}
        >
          {segment === ' ' ? '\u00A0' : segment}
          {animateBy === "words" && i < segments.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </p>
  );
};

export default function PortfolioHero() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    api.getProfile().then((data: any) => {
      if (data.resume_data) {
        setResumeUrl(data.resume_data);
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
                <X className="w-8 h-8 transition-colors duration-300" strokeWidth={2} />
              ) : (
                <Menu className="w-8 h-8 transition-colors duration-300" strokeWidth={2} />
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

          {/* Signature */}
          <div className="text-4xl" style={{ color: "hsl(0 0% 100%)", fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive" }}>
            MG
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-10">
        
        {/* Profile Picture - Above Name */}
        <div className="mb-8 z-10">
           <div className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] md:w-[180px] md:h-[180px] rounded-full overflow-hidden shadow-2xl border-4 border-[#C3E41D]/20 transition-transform duration-300 hover:scale-110 cursor-pointer">
            <img
              src="/Profile_P.jpeg"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Name - Single Line */}
        <div className="relative text-center mb-8 z-0 px-4">
           <BlurText
             text="M GANESH"
             delay={100}
             animateBy="letters"
             direction="top"
             className="font-bold text-[12vw] md:text-[140px] lg:text-[180px] leading-none tracking-tighter uppercase whitespace-nowrap"
             style={{ color: "#C3E41D", fontFamily: "'Fira Code', monospace" }}
           />
        </div>

        {/* Tagline */}
        <div className="mb-8 px-6 text-center max-w-5xl w-full flex justify-center">
            <BlurText 
               text="Aspiring Data Analyst | Uncovering patterns in data."
               delay={150}
               animateBy="words"
               direction="top"
               className="text-[15px] sm:text-[18px] md:text-[20px] lg:text-[22px] text-center transition-colors duration-300 text-neutral-500 hover:text-white justify-center"
               style={{ fontFamily: "'Antic', sans-serif" }}
            />
        </div>

        {/* Resume Button */}
        {resumeUrl && (
          <div className="mb-16">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="px-8 py-3 rounded-full border border-[#C3E41D] text-[#C3E41D] hover:bg-[#C3E41D] hover:text-black transition-all duration-300 font-medium tracking-wide text-sm sm:text-base"
              style={{ fontFamily: "'Fira Code', monospace" }}
            >
              RESUME
            </a>
          </div>
        )}

        {/* Scroll Indicator */}
        <button
          type="button"
          className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 transition-colors duration-300"
          aria-label="Scroll down"
          onClick={() => document.getElementById('education')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <ChevronDown className="w-5 h-5 md:w-8 md:h-8 text-neutral-500 hover:text-white transition-colors duration-300" />
        </button>
      </div>
    </div>
  );
}
