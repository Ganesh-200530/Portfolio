import React, { useEffect, useState } from 'react';
import { observeReveals } from '../utils/observer';
import { educationData } from '../data/portfolio';

interface EducationItem {
  degree: string;
  focus?: string;
  institution: string;
  start_year?: string | number;
  end_year?: string | number;
  location?: string;
}

const Education: React.FC = () => {
  const [education] = useState<EducationItem[]>(educationData);

  useEffect(() => {
    // API fetch disabled to prioritize static resume data
    /*
    api.getEducation()
      .then(data => {
        if (data && data.length > 0) setEducation(data);
      })
      .catch(() => {});
    */
    setTimeout(observeReveals, 100);
    // api.getEducation()
    //   .then(data => {
    //     if (data && data.length > 0) setEducation(data);
    //   })
    //   .catch(() => {});
    // setTimeout(observeReveals, 100);
  }, []);

  return (
    <section id="education" className="py-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 reveal">
        <div className="flex flex-col justify-center">
          <p className="font-mono text-accent text-sm mb-2 tracking-wider uppercase">Education</p>
          <h2 className="text-4xl font-bold text-site-text mb-6 font-mono">Learning Journey</h2>
          <p className="text-muted text-lg leading-relaxed max-w-md font-sans">
            My academic background has provided a strong foundation in computer science and data analysis principles.
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-2xl font-mono text-sm">
          <div className="bg-card/50 px-4 py-3 border-b border-border flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full border border-muted/30"></div>
              <div className="w-3 h-3 rounded-full border border-muted/30"></div>
              <div className="w-3 h-3 rounded-full border border-muted/30"></div>
            </div>
            <span className="ml-4 text-muted text-xs">education.sql</span>
          </div>
          <div className="p-6 space-y-4">
            {education.length === 0 ? (
              <p className="text-muted">-- No records found</p>
            ) : (
              education.map((item, index) => (
                <div 
                  key={index} 
                  style={{ transitionDelay: `${index * 200}ms` }}
                  className="group reveal"
                >
                  <div className="flex gap-2 text-muted/50 select-none">
                    <span>{(index + 1).toString().padStart(2, '0')}</span>
                    <span className="text-accent">SELECT</span>
                  </div>
                  <div className="pl-8 border-l border-border/20 ml-3.5 py-1">
                    <div className="text-site-text font-bold">{item.degree}</div>
                    <div className="text-muted">
                      <span className="text-accent">FROM</span> {item.institution}
                    </div>
                    <div className="text-muted">
                      <span className="text-accent">WHERE</span> year = {item.start_year}-{item.end_year}
                    </div>
                    {item.location && (
                      <div className="text-muted">
                        <span className="text-accent">AND</span> location = {item.location}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
