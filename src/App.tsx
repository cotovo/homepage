import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Clock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Terminal,
  ArrowRight,
  Bookmark
} from 'lucide-react';
import { gsap } from 'gsap';
import GeoMap from './components/GeoMap';
import TechSpectrum from './components/TechSpectrum';
import MagneticLink from './components/MagneticLink';

const BACKGROUND_NODES = Array.from({ length: 30 }).map((_, i) => ({
  id: i,
  x: Math.sin(i * 43) * 45 + 50,
  y: Math.cos(i * 17) * 45 + 50,
}));

export default function App() {
  const [activeScreen, setActiveScreen] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [hoveredNode, setHoveredNode] = useState<'shiyan' | 'wuhan' | null>(null);
  const [rightPanelTab, setRightPanelTab] = useState<'geomap' | 'spectrum'>('geomap');
  const isScrollingRef = useRef<boolean>(false);

  useEffect(() => {
    document.body.classList.add('noise-active');
    return () => document.body.classList.remove('noise-active');
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const pad = (num: number) => num.toString().padStart(2, '0');
      setCurrentTime(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const titleTween = gsap.fromTo(
      '.gsap-animate-title',
      { opacity: 0, y: 15, filter: 'blur(4px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.45, ease: 'power2.out', stagger: 0.04 }
    );
    const cardTween = gsap.fromTo(
      '.gsap-animate-card',
      { opacity: 0, scale: 0.98, y: 10 },
      { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'power2.out', delay: 0.1 }
    );
    return () => {
      titleTween.kill();
      cardTween.kill();
    };
  }, [activeScreen]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.no-scrollbar') || target.closest('#screen-section-trajectory') || target.closest('#screen-section-vision') || target.closest('#screen-section-access')) {
        const scrollContainer = target.closest('.overflow-y-auto') as HTMLElement;
        if (scrollContainer) {
          const isAtTop = scrollContainer.scrollTop === 0;
          const isAtBottom = Math.abs(scrollContainer.scrollHeight - scrollContainer.clientHeight - scrollContainer.scrollTop) < 2;
          if (e.deltaY > 0 && !isAtBottom) return;
          if (e.deltaY < 0 && !isAtTop) return;
        }
      }
      if (isScrollingRef.current) return;
      if (Math.abs(e.deltaY) < 35) return;
      isScrollingRef.current = true;
      setTimeout(() => { isScrollingRef.current = false; }, 800);
      if (e.deltaY > 0) {
        setActiveScreen((prev) => Math.min(prev + 1, 2));
      } else {
        setActiveScreen((prev) => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const touchStartY = useRef<number>(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('#geomap-container-3d') ||
      target.closest('.tech-spec-card') ||
      target.closest('#screen-section-trajectory') ||
      target.closest('#screen-section-access') ||
      target.closest('#screen-section-vision')
    ) {
      return;
    }
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(deltaY) > 55) {
      if (deltaY > 0) {
        setActiveScreen((prev) => Math.min(prev + 1, 2));
      } else {
        setActiveScreen((prev) => Math.max(prev - 1, 0));
      }
    }
  };

  return (
    <div
      id="root-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}
      className="relative w-full h-screen overflow-hidden bg-[#fafafa] text-[#171717] font-sans flex flex-col justify-between"
    >
      {/* Backdrop Grid Dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {BACKGROUND_NODES.map((n) => (
          <div
            key={n.id}
            className="absolute rounded-full bg-neutral-300 w-[1px] h-[1px]"
            style={{ left: `${n.x}%`, top: `${n.y}%`, opacity: 0.35 }}
          />
        ))}
        <div className="absolute top-[15%] left-[20%] w-[300px] h-[300px] bg-neutral-500/[0.02] rounded-full filter blur-[100px]" />
      </div>

      {/* Header */}
      <header className="w-full px-6 md:px-12 py-5 flex items-center justify-between z-40 shrink-0 pointer-events-none">
        <div className="flex items-center gap-6 pointer-events-auto">
          <button
            onClick={() => setActiveScreen(0)}
            className="text-neutral-900 hover:text-neutral-600 transition-colors cursor-pointer text-xs font-mono tracking-[0.2em] font-bold"
          >
            PERIMSX.EXE
          </button>
          <div className="flex items-center gap-1.5 font-mono text-[9px] text-neutral-400">
            <Clock className="w-3 h-3 text-neutral-300 animate-pulse" />
            <span>{currentTime || '00:00:00'}</span>
          </div>
        </div>
        <div className="font-mono text-[9px] text-neutral-400 tracking-wider hidden sm:block">
          STATUS: ACTIVE // SSG BUILD
        </div>
      </header>

      {/* Main */}
      <main className="w-full flex-grow relative px-5 md:px-12 z-20 overflow-hidden flex items-center">
        <AnimatePresence mode="wait">
          {activeScreen === 0 && (
            <Page1Vision key="screen-vision" onNavigate={() => setActiveScreen(1)} />
          )}
          {activeScreen === 1 && (
            <Page2Trajectory
              key="screen-trajectory"
              hoveredNode={hoveredNode}
              setHoveredNode={setHoveredNode}
              rightPanelTab={rightPanelTab}
              setRightPanelTab={setRightPanelTab}
            />
          )}
          {activeScreen === 2 && (
            <Page3Access key="screen-access" />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 md:px-12 py-6 flex items-center justify-between z-40 shrink-0 pointer-events-none">
        <div className="flex items-center gap-6 pointer-events-auto">
          <div className="font-mono text-[11px] tracking-widest text-neutral-400 font-bold">
            <span className="text-neutral-900">0{activeScreen + 1}</span> / 03
          </div>
          <div className="font-mono text-[8px] text-neutral-400 uppercase tracking-wider hidden sm:block">
            {activeScreen === 0 && 'VISION AXIS // 零度起点'}
            {activeScreen === 1 && 'TRAJECTORY // 混合光谱'}
            {activeScreen === 2 && 'ACCESS // 接入对等端'}
          </div>
        </div>
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="flex gap-1.5" role="tablist" aria-label="页面导航">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                onClick={() => setActiveScreen(idx)}
                role="tab"
                aria-selected={activeScreen === idx}
                aria-label={`第 ${idx + 1} 页`}
                className={`w-6 h-6 flex items-center justify-center rounded cursor-pointer transition-all duration-500 ${
                  activeScreen === idx ? 'bg-neutral-900' : 'bg-transparent hover:bg-neutral-100'
                }`}
              >
                <span className={`block rounded-full transition-all duration-500 ${
                  activeScreen === idx ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-neutral-300'
                }`} />
              </button>
            ))}
          </div>
          <div className="flex gap-1 ml-3 border-l border-neutral-200 pl-3">
            <button
              onClick={() => setActiveScreen((prev) => Math.max(prev - 1, 0))}
              disabled={activeScreen === 0}
              aria-label="上一页"
              className={`p-1 transition-colors cursor-pointer ${activeScreen === 0 ? 'text-neutral-300 cursor-not-allowed' : 'text-neutral-400 hover:text-neutral-950'}`}
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveScreen((prev) => Math.min(prev + 1, 2))}
              disabled={activeScreen === 2}
              aria-label="下一页"
              className={`p-1 transition-colors cursor-pointer ${activeScreen === 2 ? 'text-neutral-300 cursor-not-allowed' : 'text-neutral-400 hover:text-neutral-950'}`}
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ================= PAGE 1: VISION ================= */

function Page1Vision({ onNavigate }: { onNavigate: () => void }) {
  return (
    <motion.section
      id="screen-section-vision"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
      className="absolute inset-x-5 md:inset-x-12 top-[10%] md:top-[8%] bottom-[12%] md:bottom-[10%] flex flex-col justify-center overflow-y-auto no-scrollbar"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full py-4 md:py-0">
        <div className="md:col-span-7 space-y-5 text-left order-2 md:order-1">
          <div className="inline-flex font-mono text-[9px] text-neutral-400 tracking-widest uppercase items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            CONNECTED // PERIMSX
          </div>
          <div className="space-y-3.5">
            <h1 className="gsap-animate-title text-4xl xs:text-5xl md:text-7xl font-black tracking-tight text-neutral-900 leading-none">
              PERIMSX.
            </h1>
            <p className="gsap-animate-title text-xs sm:text-sm md:text-lg font-light text-neutral-500 leading-relaxed max-w-md">
              探索现代前端交互与计算机系统安全。通过严密的逻辑设计与像素级的动效打磨，重塑有温度的 Web 边界。
            </p>
          </div>
          <div className="gsap-animate-title pt-1 font-mono text-[9px] text-neutral-400 space-y-1">
            <div>// FRONTEND INTERACTION & NETWORK SECURITY</div>
            <div>// CURRENT: REACT WEB ECOSYSTEM</div>
          </div>
          <div className="gsap-animate-title pt-2">
            <button
              onClick={onNavigate}
              className="px-4 py-2 border border-neutral-250 hover:border-neutral-950 transition-colors font-mono text-[9px] uppercase tracking-wider text-neutral-600 hover:text-neutral-950 flex items-center gap-2 cursor-pointer bg-white rounded-lg shadow-2xs"
            >
              <span>进入轨迹 SPECTRUM</span>
              <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
            </button>
          </div>
        </div>

        <div className="col-span-1 md:col-span-5 flex justify-center md:justify-end order-1 md:order-2">
          <div className="gsap-animate-card relative w-44 h-44 xs:w-52 xs:h-52 md:w-68 md:h-68 border border-neutral-200/40 rounded-full flex items-center justify-center bg-white/40 shadow-xs">
            <div className="absolute w-[90%] h-[90%] border border-neutral-200 border-dashed rounded-full animate-[spin_45s_linear_infinite]" />
            <div className="absolute w-[76%] h-[76%] border border-neutral-200 rounded-full animate-[spin_28s_linear_infinite_reverse] opacity-75" />
            <div className="relative w-32 h-32 xs:w-38 xs:h-38 md:w-46 md:h-46 rounded-full overflow-hidden border-2 border-white shadow-md transition-transform duration-550 hover:scale-[1.04] cursor-pointer">
              <img
                src="https://q1.qlogo.cn/g?b=qq&nk=1722288011&s=640"
                alt="Perimsx Avatar"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <div className="absolute bottom-1 right-1 md:bottom-3 md:right-3 bg-white border border-neutral-200 py-1 px-2 rounded-full shadow-2xs flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-mono text-[7px] text-neutral-500 uppercase tracking-widest font-bold">ONLINE</span>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/* ================= PAGE 2: TRAJECTORY ================= */

function Page2Trajectory({
  hoveredNode,
  setHoveredNode,
  rightPanelTab,
  setRightPanelTab
}: {
  hoveredNode: 'shiyan' | 'wuhan' | null;
  setHoveredNode: (node: 'shiyan' | 'wuhan' | null) => void;
  rightPanelTab: 'geomap' | 'spectrum';
  setRightPanelTab: (tab: 'geomap' | 'spectrum') => void;
}) {
  const handleCityHover = (city: 'shiyan' | 'wuhan') => setHoveredNode(city);
  const handleCityLeave = () => setHoveredNode(null);
  const handleCityClick = (city: 'shiyan' | 'wuhan') => {
    setHoveredNode(hoveredNode === city ? null : city);
  };

  return (
    <motion.section
      id="screen-section-trajectory"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
      className="absolute inset-x-5 md:inset-x-12 top-[10%] md:top-[8%] bottom-[12%] md:bottom-[8%] grid grid-cols-1 md:grid-cols-12 gap-6 items-center overflow-y-auto no-scrollbar md:overflow-hidden pb-8 md:pb-0"
    >
      <div className="md:col-span-5 space-y-4 text-left py-2">
        <div className="font-mono text-[9px] text-neutral-400 tracking-widest uppercase flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-neutral-400" />
          MANIFESTO // 精炼写照
        </div>
        <div className="space-y-4 border-l border-neutral-200 pl-4">
          <div>
            <h3 className="font-mono text-[9px] text-neutral-500 uppercase tracking-wide font-bold">// 双城轨迹</h3>
            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
              十堰宁静蓄力，江城极速扎根。在专注和阔步之间转换，锤炼务实基因。
            </p>
          </div>
          <div>
            <h3 className="font-mono text-[9px] text-neutral-500 uppercase tracking-wide font-bold">// 技术防御</h3>
            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
              主修网络安全。在钻研底层系统审计、解密与安全加固中，构建立体防护。
            </p>
          </div>
          <div>
            <h3 className="font-mono text-[9px] text-neutral-500 uppercase tracking-wide font-bold">// 交互温度</h3>
            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
              熟练编排 React / Node.js 体验，在纯粹简洁的细节微调中感知美学。
            </p>
          </div>
        </div>

        <div className="flex gap-2 items-center flex-wrap pt-2 shrink-0">
          {(['shiyan', 'wuhan'] as const).map((city) => (
            <button
              key={city}
              className={`px-3 py-1 border transition-all duration-300 font-mono text-[9px] cursor-pointer rounded-md ${
                hoveredNode === city
                  ? 'border-neutral-900 bg-neutral-900 text-white font-bold shadow-xs'
                  : 'border-neutral-200 text-neutral-500 hover:text-neutral-900 bg-white shadow-2xs'
              }`}
              onMouseEnter={() => handleCityHover(city)}
              onMouseLeave={handleCityLeave}
              onClick={() => handleCityClick(city)}
            >
              {city === 'shiyan' ? '十堰 SHIYAN' : '武汉 WUHAN'}
            </button>
          ))}
        </div>
      </div>

      <div className="gsap-animate-card md:col-span-7 flex flex-col gap-4 border border-neutral-200/80 p-4 md:p-5 bg-white shadow-md rounded-2xl">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-550 font-bold">
              {rightPanelTab === 'geomap' ? '3D COORD GEOMAP' : 'TECH / AI SPECTRUM'}
            </span>
          </div>
          <div className="flex gap-1.5" role="tablist">
            <button
              role="tab"
              aria-selected={rightPanelTab === 'geomap'}
              onClick={() => setRightPanelTab('geomap')}
              className={`px-3 py-1 text-[8px] font-mono tracking-wider transition-all duration-300 rounded-md cursor-pointer ${
                rightPanelTab === 'geomap'
                  ? 'bg-neutral-900 text-white font-bold shadow-xs'
                  : 'bg-transparent text-neutral-450 hover:text-neutral-800 border border-neutral-200'
              }`}
            >
              3D 地图
            </button>
            <button
              role="tab"
              aria-selected={rightPanelTab === 'spectrum'}
              onClick={() => setRightPanelTab('spectrum')}
              className={`px-3 py-1 text-[8px] font-mono tracking-wider transition-all duration-300 rounded-md cursor-pointer ${
                rightPanelTab === 'spectrum'
                  ? 'bg-neutral-900 text-white font-bold shadow-xs'
                  : 'bg-transparent text-neutral-450 hover:text-neutral-800 border border-neutral-200'
              }`}
            >
              技术 / AI
            </button>
          </div>
        </div>
        <div className="w-full flex-grow flex items-center justify-center" role="tabpanel">
          {rightPanelTab === 'geomap' ? (
            <div className="w-full">
              <GeoMap hoveredNode={hoveredNode} onHoverNode={setHoveredNode} />
            </div>
          ) : (
            <div className="w-full h-auto">
              <TechSpectrum />
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}

/* ================= PAGE 3: ACCESS ================= */

function Page3Access() {
  const links = [
    {
      id: 'contact-blog',
      label: 'BLOG // 深度自留地',
      value: 'blog.cot.wiki',
      sub: '安全笔记、系统开发与动效思考。',
      href: 'https://blog.cot.wiki',
      logoIcon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-neutral-900" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2c3 4 3 16 0 20-3-4-3-16 0-20" />
        </svg>
      )
    },
    {
      id: 'contact-github',
      label: 'GITHUB // 云端轨迹',
      value: 'github.com/cotovo',
      sub: '开源项目、实验与代码状态。',
      href: 'https://github.com/cotovo',
      logoIcon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-neutral-900">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    },
    {
      id: 'contact-email',
      label: 'EMAIL // 交流信箱',
      value: 'cotovo@163.com',
      sub: '创意构想 or 前沿合作探讨。',
      href: 'mailto:cotovo@163.com',
      logoIcon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-neutral-900" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      )
    }
  ];

  return (
    <motion.section
      id="screen-section-access"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
      className="absolute inset-x-5 md:inset-x-12 top-[10%] md:top-[8%] bottom-[12%] md:bottom-[10%] flex flex-col justify-center overflow-y-auto no-scrollbar pb-8 md:pb-0"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full py-2">
        <div className="md:col-span-5 space-y-4 text-left">
          <div className="font-mono text-[9px] text-neutral-400 tracking-widest uppercase flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-neutral-400" />
            CHANNELS // 即刻连通
          </div>
          <h2 className="text-3xl font-black tracking-tight text-neutral-900">寻找最纯粹的探讨</h2>
          <p className="text-xs text-neutral-500 leading-relaxed max-w-sm">
            安全技术加固、系统安全开发或项目协作。这里只有专业、坦诚与效率。
          </p>
          <div className="font-mono text-[8px] text-neutral-400">// DIRECT CHANNELS READY</div>
        </div>

        <div className="md:col-span-7 flex flex-col gap-3.5 w-full">
          {links.map((link) => (
            <div key={link.id} className="w-full">
              <MagneticLink
                id={link.id}
                href={link.href}
                className="block p-4 border border-neutral-200 hover:border-neutral-900 transition-all duration-300 bg-white/70 backdrop-blur-md rounded-2xl w-full group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5 text-left">
                    <div className="w-10 h-10 border border-neutral-100 rounded-xl flex items-center justify-center bg-neutral-50/50 group-hover:bg-neutral-100/50 transition-colors">
                      {link.logoIcon}
                    </div>
                    <div className="space-y-0.5">
                      <span className="font-mono text-[8px] text-neutral-400 uppercase tracking-wider block">{link.label}</span>
                      <span className="text-sm font-bold tracking-wide text-neutral-900 block">{link.value}</span>
                      <p className="text-[10px] text-neutral-500 leading-normal font-sans block pt-0.5">{link.sub}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-neutral-400 shrink-0 group-hover:text-neutral-900 transition-colors" />
                </div>
              </MagneticLink>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
