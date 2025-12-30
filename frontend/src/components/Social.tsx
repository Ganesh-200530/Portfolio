import React, { useEffect, useState } from 'react';
import { observeReveals } from '../utils/observer';
import { api } from '../services/api';

interface SocialItem {
  platform: string;
  url: string;
  label?: string;
}

const Social: React.FC = () => {
  const [social, setSocial] = useState<SocialItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSocial()
      .then(data => {
        setSocial(data);
        setLoading(false);
        setTimeout(observeReveals, 100);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <section id="social" className="py-20 px-6 max-w-7xl mx-auto">
      <div className="bg-transparent border border-border rounded-3xl p-10 reveal text-center">
        <div className="mb-12">
          <p className="font-mono text-accent text-sm mb-2 tracking-wider uppercase">Social Links</p>
          <h2 className="text-4xl font-bold text-site-text font-mono">Connect With Me</h2>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6" id="social-links">
          {loading ? (
            <p className="text-muted font-mono">Loading social links...</p>
          ) : social.length === 0 ? (
            <p className="text-muted font-mono">Social links coming soon.</p>
          ) : (
            social.map((item, index) => (
              <a 
                key={index} 
                href={item.url} 
                target="_blank" 
                rel="noreferrer" 
                className="group flex items-center gap-3 px-6 py-4 bg-transparent border border-border rounded-xl hover:border-accent transition-all duration-300 hover:-translate-y-1"
              >
                <span className="text-site-text font-medium group-hover:text-accent transition-colors font-mono">{item.label || item.platform}</span>
                <svg className="w-4 h-4 text-muted group-hover:text-accent transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Social;
