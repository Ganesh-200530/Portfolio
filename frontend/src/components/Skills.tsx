import React, { useEffect, useState } from 'react';
import { observeReveals } from '../utils/observer';
import { skillsData } from '../data/portfolio';
import {
  SiPython, SiPostgresql, SiJavascript, SiHtml5,
  SiPandas, SiNumpy, SiScikitlearn, SiPlotly,
  SiTableau, SiGit, SiR, SiMysql,
  SiGoogleanalytics, SiGraphql, SiChartdotjs,
  SiWolframmathematica, SiJupyter, SiGooglecolab,
  SiGithub, SiCanva
} from 'react-icons/si';
import { RiFileExcel2Fill, RiBarChartFill } from 'react-icons/ri';
import { 
  VscVscode, VscClearAll,
  VscCircuitBoard, VscSymbolEvent, 
  VscCommentDiscussion, VscSearch 
} from 'react-icons/vsc';

const iconMap: Record<string, React.ElementType> = {
  SiPython, SiPostgresql, SiJavascript, SiHtml5,
  SiPandas, SiNumpy, SiScikitlearn, SiPlotly,
  SiTableau, SiGit, SiR, SiMysql,
  SiGoogleanalytics, SiGraphql, SiChartdotjs,
  SiWolframmathematica, SiJupyter, SiGooglecolab,
  SiGithub, SiCanva,
  SiSeaborn: RiBarChartFill, // Fallback for SiSeaborn
  RiFileExcel2Fill, RiBarChartFill,
  VscVscode, VscClearAll,
  VscCircuitBoard, VscSymbolEvent, 
  VscCommentDiscussion, VscSearch
};

const Skills: React.FC = () => {
  const [skills] = useState(skillsData);

  useEffect(() => {
    setTimeout(observeReveals, 100);
  }, []);

  return (
    <section id="skills" className="py-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 reveal">
        <div className="flex flex-col justify-center order-2 lg:order-1">
          <div className="space-y-8">
            {skills.length === 0 ? (
              <p className="text-muted font-mono">Skills coming soon.</p>
            ) : (
              skills.map((item, index) => (
                <div key={index} className="reveal">
                  <h3 className="text-lg font-medium text-site-text mb-4 flex items-center gap-3 font-mono">
                    <span className="w-8 h-[1px] bg-accent"></span>
                    {item.category}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {item.items.map((skill, i) => {
                      // Attempt to resolve icon by name or icon property
                      const key = skill.icon || skill.name; 
                      // Try to find it in the map, otherwise fallback
                      const IconComponent = (iconMap as any)[key] || VscSymbolEvent;
                      
                      return (
                        <div 
                          key={i} 
                          style={{ transitionDelay: `${i * 50}ms` }}
                          className="reveal flex items-center gap-3 p-3 bg-card/40 backdrop-blur-sm border border-border rounded-lg hover:border-accent hover:shadow-[0_0_15px_rgba(195,228,29,0.15)] hover:-translate-y-1 hover:bg-card transition-all duration-300 group cursor-default"
                        >
                          {IconComponent ? (
                            <IconComponent className="text-2xl text-muted group-hover:text-accent transition-colors" />
                          ) : (
                            <span className="w-6 h-6 block bg-white/10 rounded-full"></span>
                          )}
                          <span className="text-sm text-site-text font-mono group-hover:text-white transition-colors">
                            {skill.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center order-1 lg:order-2">
          <p className="font-mono text-accent text-sm mb-2 tracking-wider uppercase">Skills & Tools</p>
          <h2 className="text-4xl font-bold text-site-text mb-6 font-mono">What I Use</h2>
          <p className="text-muted text-lg leading-relaxed font-sans">
            I leverage a modern stack of tools and technologies to extract insights and build data-driven solutions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Skills;
