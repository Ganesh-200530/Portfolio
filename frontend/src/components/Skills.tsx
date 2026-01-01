import React, { useEffect, useState } from 'react';
import { observeReveals } from '../utils/observer';
import { api } from '../services/api';
import { 
  SiPython, SiPostgresql, SiJavascript, SiHtml5, 
  SiPandas, SiNumpy, SiScikitlearn, SiPlotly,
  SiTableau, SiGit, SiR
} from 'react-icons/si';
import { RiFileExcel2Fill, RiBarChartFill } from 'react-icons/ri';
import { VscVscode } from 'react-icons/vsc';

interface SkillItem {
  name: string;
  icon: string;
}

interface SkillCategory {
  category: string;
  items: SkillItem[];
}

const iconMap: Record<string, React.ElementType> = {
  SiPython, SiPostgresql, SiJavascript, SiHtml5,
  SiPandas, SiNumpy, SiScikitlearn, SiPlotly,
  SiTableau, SiGit, SiR, 
  SiSeaborn: RiBarChartFill, // Fallback for Seaborn as it's not in react-icons/si
  RiFileExcel2Fill, RiBarChartFill, VscVscode
};

const Skills: React.FC = () => {
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSkills()
      .then(data => {
        setSkills(data);
        setLoading(false);
        setTimeout(observeReveals, 100);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <section id="skills" className="py-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 reveal">
        <div className="flex flex-col justify-center order-2 lg:order-1">
          <div className="space-y-8">
            {loading ? (
              <p className="text-muted font-mono">Loading skills...</p>
            ) : skills.length === 0 ? (
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
                      // Defensive check for malformed data
                      if (!skill || typeof skill !== 'object') return null;
                      
                      const IconComponent = iconMap[skill.icon];
                      return (
                        <div 
                          key={i} 
                          className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:border-accent transition-all duration-300 group"
                        >
                          {IconComponent ? (
                            <IconComponent className="text-2xl text-muted group-hover:text-accent transition-colors" />
                          ) : (
                            <span className="w-6 h-6 block bg-white/10 rounded-full"></span>
                          )}
                          <span className="text-sm text-site-text font-mono group-hover:text-white transition-colors">
                            {skill.name || String(skill)}
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
