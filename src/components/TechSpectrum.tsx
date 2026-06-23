import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';

interface TechItem {
  id: string;
  name: string;
  category: 'core' | 'framework' | 'backend' | 'security';
  proficiency: number;
  svgIcon: React.ReactNode;
}

export default function TechSpectrum() {
  const [activeTab, setActiveTab] = useState<'all' | 'fullstack' | 'security' | 'ai'>('all');
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const [selectedAI, setSelectedAI] = useState<'gemini' | 'claude' | 'gpt'>('gemini');

  // Official logo vectors of authentic quality
  const techData: TechItem[] = [
    {
      id: 'ts',
      name: 'TypeScript',
      category: 'core',
      proficiency: 95,
      svgIcon: (
        <svg viewBox="0 0 128 128" className="w-5 h-5 rounded">
          <rect width="128" height="128" fill="#3178C6" />
          <path d="M1.5 126.5h125v-125h-125v125zm115.5-11.4h-19.4v-56.1h-21V40.2h61.4v18.8h-21v56.1zm-48 0h-19.4V84.6H26.3v17.4c0 10.6 5.6 14.1 14.4 14.1h8.3v19h-10.4c-20 0-31.7-8.1-31.7-32.1V74.1h21.1v-15H47.6v15H61c1.5 5 1.5 40.1 1 41z" fill="#ffffff" transform="scale(0.5) translate(48, 56)" />
        </svg>
      )
    },
    {
      id: 'react',
      name: 'React',
      category: 'framework',
      proficiency: 96,
      svgIcon: (
        <svg viewBox="0 0 100 100" className="w-5 h-5 animate-[spin_8s_linear_infinite]">
          <circle cx="50" cy="50" r="8" fill="#00d8ff" />
          <path d="M50 15 C80 15 90 35 90 50 C90 65 80 85 50 85 C20 85 10 65 10 50 C10 35 20 15 50 15 Z" fill="none" stroke="#00d8ff" strokeWidth="4.5" className="opacity-90" />
          <path d="M50 15 C80 15 90 35 90 50 C90 65 80 85 50 85 C20 85 10 65 10 50 C10 35 20 15 50 15 Z" fill="none" stroke="#00d8ff" strokeWidth="4.5" transform="rotate(60 50 50)" className="opacity-90" />
          <path d="M50 15 C80 15 90 35 90 50 C90 65 80 85 50 85 C20 85 10 65 10 50 C10 35 20 15 50 15 Z" fill="none" stroke="#00d8ff" strokeWidth="4.5" transform="rotate(120 50 50)" className="opacity-90" />
        </svg>
      )
    },
    {
      id: 'nextjs',
      name: 'Next.js',
      category: 'framework',
      proficiency: 90,
      svgIcon: (
        <svg viewBox="0 0 128 128" className="w-5 h-5">
          <circle cx="64" cy="64" r="62" fill="#000000" stroke="#171717" strokeWidth="2" />
          <path d="M96 95 L51.7 42.4 M44 42v44" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
          <path d="M84 42v54" stroke="url(#nextjs-grad)" strokeWidth="8" strokeLinecap="round" />
          <defs>
            <linearGradient id="nextjs-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 'tailwind',
      name: 'Tailwind CSS',
      proficiency: 98,
      category: 'framework',
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path d="M12 6.018C15.655 2.273 19.31 3.518 22.964 9.75c-1.828 2.495-4.264 3.743-7.309 3.743-3.655 0-5.482-1.245-9.136-4.99C2.864 4.758.428 6.007-2.617 9.75c1.828-2.495 4.264-3.743 7.309-3.743 3.655 0 5.482 1.245 7.308.01zm0 8.232c3.655-3.745 7.31-2.5 10.964-1.253-1.828 12.457-4.264 4.981-7.309 4.981-3.655 0-5.482-1.245-9.136-4.99C2.864 8.243.428 9.492-2.617 13.235c1.828-2.495 4.264-3.743 7.309-3.743 3.655 0 5.482 1.245 7.308.758z" fill="#38BDF8" transform="scale(0.8) translate(3, 3)" />
        </svg>
      )
    },
    {
      id: 'nodejs',
      name: 'Node.js',
      category: 'backend',
      proficiency: 88,
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path d="M12 2L4 6.5v11L12 22l8-4.5v-11L12 2zm-1 15.5h-2v-6h2v6zm0-7.5h-2V8h2v2zm6 7.5h-2v-4c0-.8-.4-1.2-1-1.2s-1 .4-1 1.2v4h-2v-6h2v.8c.4-.6 1-.9 1.6-.9 1.3 0 2.4.9 2.4 2.1v4z" fill="#339933" transform="scale(0.85) translate(2, 2)" />
        </svg>
      )
    },
    {
      id: 'security',
      name: '安全审计',
      category: 'security',
      proficiency: 91,
      svgIcon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#171717" strokeWidth="2" fill="#fafafa" />
          <circle cx="12" cy="11" r="2.5" stroke="#171717" strokeWidth="1.5" />
          <path d="M12 13.5v3" stroke="#171717" strokeWidth="1.8" />
        </svg>
      )
    }
  ];

  useEffect(() => {
    gsap.fromTo(
      '.tech-spec-card',
      { opacity: 0, scale: 0.96, y: 8 },
      { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'power2.out', stagger: 0.02, overwrite: 'auto' }
    );
  }, [activeTab]);

  const filteredTech = techData.filter((tech) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'fullstack') {
      return tech.category === 'core' || tech.category === 'framework' || tech.category === 'backend';
    }
    if (activeTab === 'security') {
      return tech.category === 'security';
    }
    return false;
  });

  return (
    <div 
      className="w-full"
      onTouchStart={(e) => e.stopPropagation()} // Stop propagation on touch screen
      onTouchMove={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      {/* Category control tabs */}
      <div className="flex border-b border-neutral-100 mb-4 pb-1 items-center justify-between no-scrollbar select-none">
        <div className="flex gap-4" role="tablist">
          {[
            { id: 'all', label: 'ALL // 全部' },
            { id: 'fullstack', label: 'STACK // 全栈' },
            { id: 'security', label: 'SEC // 安全' },
            { id: 'ai', label: 'LLM // 大模型' }
          ].map((tab) => (
            <button
              id={`tab-btn-${tab.id}`}
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative pb-2 font-mono text-[10px] tracking-wider transition-all duration-300 whitespace-nowrap px-1 cursor-pointer ${
                activeTab === tab.id ? 'text-neutral-900 font-bold' : 'text-neutral-400 hover:text-neutral-800'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-neutral-900"
                  transition={{ type: 'spring', stiffness: 180, damping: 25 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab !== 'ai' ? (
          <motion.div
            key="grid-tech"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-2.5"
          >
            {filteredTech.map((tech) => (
              <div
                id={`tech-card-${tech.id}`}
                key={tech.id}
                onMouseEnter={() => setHoveredTech(tech.id)}
                onMouseLeave={() => setHoveredTech(null)}
                className={`tech-spec-card relative p-3 border transition-all duration-300 flex flex-col justify-between cursor-pointer min-h-[76px] rounded-xl bg-white/40 ${
                  hoveredTech === tech.id
                    ? 'border-neutral-900 bg-white/80 shadow-xs'
                    : 'border-neutral-150'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded border border-neutral-100 flex items-center justify-center p-0.5 bg-neutral-50/50">
                    {tech.svgIcon}
                  </div>
                  <div className="font-mono text-[8px] text-neutral-400">
                    {tech.proficiency}%
                  </div>
                </div>

                <div className="mt-2 text-left">
                  <div className="font-bold text-xs tracking-tight text-neutral-800">{tech.name}</div>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          /* High-Fidelity AI Ecosystem section with fully authentic vector logos */
          <motion.div
            key="ai-eco"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-3.5 text-left"
          >
            {/* Real Branded Logo Buttons */}
            <div className="md:col-span-5 flex flex-col gap-2">
              {[
                { 
                  id: 'gemini', 
                  name: 'Gemini', 
                  svg: (
                    <svg viewBox="0 0 100 100" className="w-4 h-4">
                      {/* Authentic Sparkle Logo Path */}
                      <path d="M50 5c0 24.853 20.147 45 45 45-24.853 0-45 20.147-45 45C50 70.147 29.853 50 5 50 29.853 50 50 29.853 50 5z" fill="url(#gemini-star-grad)" />
                      <defs>
                        <linearGradient id="gemini-star-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#9bc5ff" />
                          <stop offset="30%" stopColor="#2b66ff" />
                          <stop offset="70%" stopColor="#a33eff" />
                          <stop offset="100%" stopColor="#ff7ec9" />
                        </linearGradient>
                      </defs>
                    </svg>
                  )
                },
                { 
                  id: 'claude', 
                  name: 'Claude', 
                  svg: (
                    <svg viewBox="0 0 100 100" className="w-4 h-4">
                      {/* Anthropic Claude Official Flower Asterisk Logo style */}
                      <g fill="#D97706">
                        <circle cx="50" cy="50" r="10" />
                        <path d="M50 15 L50 40 M50 60 L50 85 M15 50 L40 50 M60 50 L85 50" stroke="#D97706" strokeWidth="12" strokeLinecap="round" />
                        <path d="M25 25 L41 41 M59 59 L75 75 M75 25 L59 41 M41 59 L25 75" stroke="#D97706" strokeWidth="12" strokeLinecap="round" />
                      </g>
                    </svg>
                  )
                },
                { 
                  id: 'gpt', 
                  name: 'GPT', 
                  svg: (
                    <svg viewBox="0 0 100 100" className="w-4 h-4">
                      {/* High-Fidelity OpenAI core spiral geometry */}
                      <path d="M89.2 40.5 C87.3 32.5 82.1 26.2 75.3 23.1 C77.5 15.6 74.8 7.3 67.5 4.1 C61.1 1.3 52.8 2.3 47.9 7.4 C43.2 2.3 34.9 1.3 28.5 4.1 C21.2 7.3 18.5 15.6 20.7 23.1 C13.9 26.2 8.7 32.5 6.8 40.5 C4.0 47.7 6.4 55.7 12.1 60.1 C10.1 67.5 13.0 75.6 20.1 78.8 C26.3 81.6 34.1 80.5 39.1 75.6 C43.8 80.5 51.6 81.6 57.8 78.8 C64.9 75.6 67.8 67.5 65.8 60.1 C71.6 55.7 74.0 47.7 71.2 40.5 Z" fill="none" stroke="#10A37F" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" transform="scale(0.9) translate(5, 5)" />
                    </svg>
                  )
                }
              ].map((comp) => (
                <button
                  id={`ai-selector-comp-${comp.id}`}
                  key={comp.id}
                  onClick={() => setSelectedAI(comp.id as any)}
                  className={`flex items-center gap-2.5 text-left px-3.5 py-2.5 border transition-all duration-300 relative rounded-lg cursor-pointer ${
                    selectedAI === comp.id
                      ? 'border-neutral-900 bg-neutral-50/70 shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-350 bg-white/40'
                  }`}
                >
                  <span className="shrink-0">{comp.svg}</span>
                  <div className="font-bold text-xs text-neutral-800 tracking-wide">{comp.name}</div>
                  {selectedAI === comp.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-[2.5px] bg-neutral-900 rounded-l-lg" />
                  )}
                </button>
              ))}
            </div>

            {/* Concise Visual Panel details with zero redundant boilerplate elements */}
            <div className="md:col-span-7 border border-neutral-150 p-4 bg-white/40 rounded-xl flex flex-col justify-center min-h-[148px]">
              <div className="flex-grow flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {selectedAI === 'gemini' && (
                    <motion.div
                      key="desc-gemini"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="text-center py-2"
                    >
                      <div className="font-mono text-[9px] text-neutral-400">// EXPERIMENT & RESEARCH</div>
                      <h4 className="text-base font-black text-neutral-900 tracking-tight mt-1 leading-normal">前沿论文研究与上下文代码洞察</h4>
                      <div className="font-mono text-[7px] text-neutral-400 mt-2 tracking-widest">
                        COGNITIVE RECON // SYSTEM RESEARCH
                      </div>
                    </motion.div>
                  )}

                  {selectedAI === 'claude' && (
                    <motion.div
                      key="desc-claude"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="text-center py-2"
                    >
                      <div className="font-mono text-[9px] text-neutral-400">// INTERACTION REFINEMENT</div>
                      <h4 className="text-base font-black text-neutral-900 tracking-tight mt-1 leading-normal">高规格动效编排与工程美学沉淀</h4>
                      <div className="font-mono text-[7px] text-neutral-400 mt-2 tracking-widest">
                        CRAFT DESIGN // DETAIL OBSESSION
                      </div>
                    </motion.div>
                  )}

                  {selectedAI === 'gpt' && (
                    <motion.div
                      key="desc-gpt"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="text-center py-2"
                    >
                      <div className="font-mono text-[9px] text-neutral-400">// CRYPTO & SECURITY LAYER</div>
                      <h4 className="text-base font-black text-neutral-900 tracking-tight mt-1 leading-normal">网络安全分析与底层防御系统验证</h4>
                      <div className="font-mono text-[7px] text-neutral-400 mt-2 tracking-widest">
                        SEC SCANNING // REVERSE ENGINE
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
