import React, { useEffect, useState } from 'react';
import { observeReveals } from '../utils/observer';
import { certificationsData } from '../data/portfolio';
import { api } from '../services/api';
import { Award } from 'lucide-react';

const Certifications: React.FC = () => {
  const [certifications, setCertifications] = useState(certificationsData);

  useEffect(() => {
    // API fetch disabled to prioritize static resume data
    /*
    api.getCertifications()
      .then(data => {
        if (data && data.length > 0) setCertifications(data);
      })
      .catch(() => {});
    */
    setTimeout(observeReveals, 100);
  }, []);

  return (
    <section id="certifications" className="py-20 px-6 max-w-7xl mx-auto">
      <div className="reveal">
        <div className="mb-16 text-center">
          <p className="font-mono text-accent text-sm mb-2 tracking-wider uppercase">Credentials</p>
          <h2 className="text-4xl font-bold text-site-text font-mono">Certifications</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="certifications-list">
          {certifications.length === 0 ? (
            <p className="text-muted font-mono text-center col-span-full">Certifications coming soon.</p>
          ) : (
            certifications.map((item, index) => (
              <div key={index} className="group relative bg-card/80 backdrop-blur-sm border-[3px] border-accent/80 rounded-tr-[3rem] rounded-bl-[3rem] p-8 flex flex-col items-center text-center hover:shadow-[0_0_40px_rgba(195,228,29,0.25)] hover:border-accent transition-all duration-500 hover:-translate-y-2 reveal hover:bg-black/60">
                
                {/* Top Label */}
                <div className="mb-4 w-full relative">
                   <p className="font-mono text-muted text-xs uppercase tracking-widest mb-3">Issued By</p>
                   <div className="h-px w-16 bg-accent mx-auto"></div>
                </div>

                {/* Main Cert Name */}
                <h3 className="text-xl md:text-2xl font-bold text-site-text uppercase font-mono mb-6 leading-tight tracking-tight min-h-[4rem] flex items-center justify-center">
                  {item.name}
                </h3>

                {/* Details Bar */}
                <div className="w-full bg-accent text-black py-2 px-4 mb-6 transform -skew-x-12">
                  <p className="font-bold text-xs uppercase tracking-widest transform skew-x-12 line-clamp-1">
                    {item.details || "Professional Certification"}
                  </p>
                </div>

                {/* Year */}
                <div className="mb-6">
                  <p className="font-mono text-xl text-site-text font-bold">{item.year}</p>
                </div>

                {/* Bottom Provider Area */}
                <div className="mt-auto flex flex-col items-center gap-2">
                   <div className="text-accent">
                     <Award size={32} strokeWidth={1.5} />
                   </div>
                   <span className="text-sm font-mono text-muted uppercase tracking-wider">{item.provider}</span>
                </div>
                
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
