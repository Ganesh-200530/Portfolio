import React, { useEffect, useState } from 'react';
import { observeReveals } from '../utils/observer';
import { api } from '../services/api';
import { ContainerScroll, CardSticky } from './ui/cards-stack';

interface ProjectItem {
  title: string;
  summary: string;
  tags: string[] | string;
  live_url?: string;
  code_url?: string;
}

const projectImages = [
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2670&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
];

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProjects()
      .then(data => {
        setProjects(data);
        setLoading(false);
        setTimeout(observeReveals, 100);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
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
        
        {loading ? (
          <p className="text-muted font-mono text-center">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="text-muted font-mono text-center">Projects coming soon.</p>
        ) : (
          <ContainerScroll className="min-h-[200vh] py-12">
            {projects.map((item, index) => {
              const tags = Array.isArray(item.tags) ? item.tags : [item.tags];
              const imageUrl = projectImages[index % projectImages.length];
              
              return (
                <CardSticky
                  key={index}
                  index={index}
                  className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
                  incrementY={80}
                  incrementZ={10}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex flex-wrap items-center justify-between gap-4 px-8 py-6 bg-card/50 border-b border-border/50 backdrop-blur-sm">
                      <h3 className="text-2xl font-bold text-site-text font-mono tracking-tight">
                        {item.title || "Untitled"}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, i) => (
                          <div
                            key={i}
                            className="flex rounded-full bg-accent/10 border border-accent/20 px-3 py-1"
                          >
                            <span className="text-xs font-mono tracking-wide text-accent uppercase">
                              {tag}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="relative flex-grow group overflow-hidden">
                      <img
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        src={imageUrl}
                        alt={item.title}
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-8 text-center backdrop-blur-[2px]">
                        <p className="text-white text-lg mb-6 max-w-2xl font-sans leading-relaxed">
                          {item.summary}
                        </p>
                        <div className="flex gap-4">
                          {item.live_url && (
                            <a 
                              href={item.live_url} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="px-6 py-2 bg-accent text-black font-bold rounded-full hover:bg-white transition-colors font-mono text-sm uppercase tracking-wider"
                            >
                              Live Demo
                            </a>
                          )}
                          {item.code_url && (
                            <a 
                              href={item.code_url} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="px-6 py-2 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-black transition-colors font-mono text-sm uppercase tracking-wider"
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
        )}
      </div>
    </section>
  );
};

export default Projects;
