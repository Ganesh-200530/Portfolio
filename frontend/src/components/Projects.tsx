import React, { useEffect, useState } from 'react';
import { observeReveals } from '../utils/observer';
import { projectsData } from '../data/portfolio';
import { api } from '../services/api';
import { ContainerScroll, CardSticky } from './ui/cards-stack';

const projectImages = [
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
];

const Projects: React.FC = () => {
  const [projects, setProjects] = useState(projectsData);

  useEffect(() => {
    // API fetch disabled to prioritize static resume data
    /*
    api.getProjects()
      .then(data => {
        if (data && data.length > 0) setProjects(data);
      })
      .catch(() => {});
    */
    setTimeout(observeReveals, 100);
  }, []);

  return (
    <section id="projects" className="py-20 px-6 max-w-7xl mx-auto">
      <div className="reveal">
        <div className="mb-12 text-center">
          <p className="font-mono text-accent text-sm mb-2 tracking-wider uppercase">Projects</p>
          <h2 className="text-4xl font-bold text-site-text font-mono">
            Selected <span className="text-accent">Work</span>
          </h2>
          <p className="mx-auto max-w-prose text-sm text-muted/80 mt-4 font-sans">
            A collection of data-driven applications and analysis projects.
          </p>
        </div>
        
        {projects.length === 0 ? (
          <p className="text-muted font-mono text-center">Projects coming soon.</p>
        ) : (
          <div className="min-h-[200vh] py-12"> 
            <ContainerScroll>
              {projects.map((item, index) => {
                const tags = Array.isArray(item.tags) ? item.tags : [item.tags];
                // Resolve image URL safely - assuming item might not have an image property typed yet
                const imageUrl = (item as any).image || projectImages[index % projectImages.length];
                
                return (
                  <CardSticky
                    key={index}
                    index={index}
                  >
                    <div className="flex flex-col h-full bg-card border border-border rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:border-accent/30 group/card relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/40 pointer-events-none z-10" />
                      <div className="flex flex-wrap items-center justify-between gap-4 px-8 py-6 bg-card/80 border-b border-border/50 backdrop-blur-md relative z-20">
                        <h3 className="text-2xl font-bold text-site-text font-mono tracking-tight group-hover/card:text-accent transition-colors">
                          {item.title || "Untitled"}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag, i) => (
                            <div
                              key={i}
                              className="px-3 py-1 rounded-full bg-accent/5 border border-accent/20 backdrop-blur-sm"
                            >
                              <span className="text-xs font-mono tracking-wide text-accent uppercase font-bold">
                                {tag}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="relative flex-grow group overflow-hidden z-0">
                        <img
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-90 group-hover:brightness-100"
                          src={imageUrl}
                          alt={item.title}
                        />
                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm transform translate-y-4 group-hover:translate-y-0">
                          <p className="text-white/90 text-lg mb-8 max-w-2xl font-sans leading-relaxed tracking-wide">
                            {item.summary}
                          </p>
                          <div className="flex gap-4">
                            {item.live_url && (
                              <a 
                                href={item.live_url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="px-8 py-3 bg-accent text-black font-bold rounded-full hover:bg-white hover:scale-105 transition-all duration-200 font-mono text-sm uppercase tracking-wider shadow-lg shadow-accent/20"
                              >
                                Live Demo
                              </a>
                            )}
                            {item.code_url && (
                              <a 
                                href={item.code_url} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="px-8 py-3 border border-white/20 bg-white/5 text-white font-bold rounded-full hover:bg-white hover:text-black hover:scale-105 transition-all duration-200 font-mono text-sm uppercase tracking-wider backdrop-blur-sm"
                              >
                                View Code
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardSticky>
                );
              })}
            </ContainerScroll>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
