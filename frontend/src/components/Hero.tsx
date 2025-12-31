import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

const Hero: React.FC = () => {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  useEffect(() => {
    api.getProfile().then((data: any) => {
      if (data.resume_data) {
        setResumeUrl(data.resume_data);
      }
    }).catch(console.error);
  }, []);

  return (
    <section id="hero" className="min-h-[85vh] flex flex-col lg:flex-row items-center justify-center lg:justify-between px-6 lg:px-16 pt-24 lg:pt-0 relative overflow-hidden reveal gap-10 lg:gap-0">
      <div className="max-w-[600px] z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
        <p className="font-mono text-accent text-sm mb-4 tracking-wider uppercase">Aspiring Data Analyst</p>
        <h1 className="text-4xl lg:text-6xl leading-tight font-bold mb-6">
          <span className="text-accent">M GANESH</span><br />
          <span className="block text-[0.4em] text-muted font-normal tracking-widest mt-2.5">DATA ANALYST</span>
        </h1>
        <p className="text-lg lg:text-xl text-muted mb-10 max-w-[480px] leading-relaxed">
          I analyze data to uncover patterns, build dashboards, and deliver insights that support informed decision-making.
        </p>
        <div className="mb-16">
          <div className="flex gap-4">
            <a className="bg-white/5 border border-border text-site-text hover:bg-white/10 hover:border-accent hover:-translate-y-0.5 transition-all duration-300 px-6 py-3 rounded-lg" href="#projects">View Projects</a>
            {resumeUrl && (
              <a className="bg-white/5 border border-border text-site-text hover:bg-white/10 hover:border-accent hover:-translate-y-0.5 transition-all duration-300 px-6 py-3 rounded-lg" href={resumeUrl} target="_blank" rel="noreferrer">Resume</a>
            )}
          </div>
        </div>
        <div className="flex flex-wrap justify-center lg:justify-start gap-10 border-t border-border pt-8 w-full">
          <div className="flex flex-col gap-1 relative items-center lg:items-start">
            <span className="text-sm text-muted">Data Projects</span>
            <span className="text-3xl font-bold text-site-text">15 +</span>
            <div className="absolute -top-1 -right-1 w-1 h-1 bg-accent rounded-full shadow-[0_0_10px_var(--accent)]" aria-hidden="true"></div>
          </div>
          <div className="flex flex-col gap-1 relative items-center lg:items-start">
            <span className="text-sm text-muted">Dashboards Delivered</span>
            <span className="text-3xl font-bold text-site-text">5 +</span>
            <div className="absolute -top-1 -right-1 w-1 h-1 bg-accent rounded-full shadow-[0_0_10px_var(--accent)]" aria-hidden="true"></div>
          </div>
          <div className="flex flex-col gap-1 relative items-center lg:items-start">
            <span className="text-sm text-muted">Insights Generated</span>
            <span className="text-3xl font-bold text-site-text">20 +</span>
            <div className="absolute -top-1 -right-1 w-1 h-1 bg-accent rounded-full shadow-[0_0_10px_var(--accent)]" aria-hidden="true"></div>
          </div>
        </div>
      </div>
      <div className="relative w-full max-w-[400px] h-[400px] lg:h-[500px] flex items-center justify-center mb-8 lg:mb-0">
        <div className="absolute w-[300px] lg:w-[500px] h-[300px] lg:h-[500px] bg-[radial-gradient(circle,var(--accent)_0%,transparent_70%)] opacity-15 blur-[60px] z-0 animate-pulse"></div>
        <div className="w-[280px] lg:w-[320px] h-[380px] lg:h-[420px] rounded-[140px] lg:rounded-[180px] overflow-hidden relative z-10 border border-white/10 shadow-[0_0_0_12px_rgba(255,255,255,0.02)]" aria-label="Profile photo">
          <img src="/Profile_P.jpeg" alt="Portrait of M Ganesh" className="w-full h-full object-cover" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
