import React, { useState, useEffect } from 'react';
import './App.css';
import PortfolioHero from '@/components/ui/portfolio-hero';
import Education from './components/Education';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Social from './components/Social';
import Footer from './components/Footer';
import Loader from './components/Loader';
import Background from './components/Background';
import { observeReveals } from './utils/observer';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading or wait for window load
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(observeReveals, 100);
    }, 1500); // Adjust time as needed

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const addRipple = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest('.button, .project, .social-card') as HTMLElement;
      if (target) {
        const rect = target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const ripple = document.createElement("span");
        ripple.className = "ripple";
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
        target.appendChild(ripple);
        setTimeout(() => ripple.remove(), 650);
      }
    };

    document.addEventListener('click', addRipple);
    return () => document.removeEventListener('click', addRipple);
  }, []);

  return (
    <>
      {loading && <Loader />}
      <div className={`app-container ${loading ? 'hidden' : ''}`}>
        <Background />
        <PortfolioHero />
        <main>
          <Education />
          <Skills />
          <Projects />
          <Certifications />
          <Contact />
          <Social />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;