import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  ArrowRight, Menu, X,
  Users, Layers, CheckCircle,
  Database, HelpCircle, Zap,
  Target, Instagram, Send
} from 'lucide-react';

// ---- Brand Logo ----
const BrandLogo = ({ size = 'medium', invert = false }: {
  size?: 'small' | 'medium' | 'large';
  showTagline?: boolean;
  invert?: boolean;
}) => {
  const widthClass = { small: 'w-28', medium: 'w-44', large: 'w-72' }[size];
  const src = invert ? '/images/logo-dark.png' : '/images/logo-light.png';
  return (
    <img
      src={src}
      alt="S&S エスアンドエス"
      className={`${widthClass} h-auto object-contain`}
    />
  );
};

// ---- Splash Screen ----
const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="scale-125 md:scale-150"
      >
        <BrandLogo size="large" showTagline={true} />
      </motion.div>
    </motion.div>
  );
};

// ---- Navbar ----
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => { setScrolled(false); }, [location.pathname]);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const isDark = location.pathname === '/' && !scrolled;

  const navItems = [
    { path: '/', label: 'ホーム' },
    { path: '/about', label: '会社について' },
    { path: '/service', label: 'サービス' },
    { path: '/contact', label: 'お問い合わせ' },
  ];

  return (
    <nav className={`sticky top-0 z-40 transition-all duration-500 ${
      isDark ? 'bg-transparent' : 'bg-[#f9f9f3]/95 backdrop-blur-md border-b border-[#3a4a1d]/10 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <button onClick={() => navigate('/')} className="hover:opacity-80 transition-opacity">
            <BrandLogo size="small" invert={true} />
          </button>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`text-sm font-semibold tracking-wide transition-all duration-300 relative py-2 ${
                  location.pathname === item.path
                    ? isDark ? 'text-white' : 'text-[#192c0d]'
                    : isDark ? 'text-white/70 hover:text-white' : 'text-[#3a4a1d]/70 hover:text-[#192c0d]'
                }`}
              >
                {item.label}
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="underline"
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDark ? 'bg-white' : 'bg-[#3a4a1d]'}`}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className={isDark ? 'text-white p-2' : 'text-[#3a4a1d] p-2'}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-[#f9f9f3] border-b border-[#3a4a1d]/10 overflow-hidden shadow-lg"
          >
            <div className="px-6 pt-4 pb-8 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setIsOpen(false); }}
                  className={`block w-full text-left px-4 py-3 text-base rounded-lg transition-colors ${
                    location.pathname === item.path ? 'text-[#f9f9f3] bg-[#3a4a1d] font-bold' : 'text-[#333] hover:bg-[#3a4a1d]/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// ---- Fade Up wrapper ----
const FadeUp = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ---- Custom SVG Illustrations ----
const IllustExpert = () => (
  <svg viewBox="0 0 300 180" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <circle cx="265" cy="20" r="75" fill="#192c0d" fillOpacity="0.04"/>
    <circle cx="28" cy="158" r="55" fill="#a8d878" fillOpacity="0.05"/>
    {/* Monitor frame */}
    <rect x="75" y="32" width="158" height="102" rx="10" fill="#192c0d" fillOpacity="0.07" stroke="#192c0d" strokeOpacity="0.12" strokeWidth="1.5"/>
    {/* Screen */}
    <rect x="84" y="40" width="141" height="87" rx="5" fill="#f0f5eb"/>
    {/* Top bar */}
    <rect x="84" y="40" width="141" height="18" rx="5" fill="#192c0d" fillOpacity="0.09"/>
    <circle cx="94" cy="49" r="3.5" fill="#a8d878" fillOpacity="0.5"/>
    <circle cx="105" cy="49" r="3.5" fill="#a8d878" fillOpacity="0.3"/>
    <circle cx="116" cy="49" r="3.5" fill="#3a4a1d" fillOpacity="0.15"/>
    {/* CRM data rows */}
    <rect x="93" y="66" width="78" height="5" rx="2" fill="#3a4a1d" fillOpacity="0.18"/>
    <rect x="93" y="76" width="62" height="5" rx="2" fill="#3a4a1d" fillOpacity="0.12"/>
    <rect x="93" y="86" width="72" height="5" rx="2" fill="#3a4a1d" fillOpacity="0.12"/>
    <rect x="93" y="96" width="55" height="5" rx="2" fill="#3a4a1d" fillOpacity="0.09"/>
    <rect x="93" y="106" width="68" height="5" rx="2" fill="#3a4a1d" fillOpacity="0.09"/>
    {/* Bar chart */}
    <rect x="182" y="103" width="11" height="25" rx="2" fill="#a8d878" fillOpacity="0.38"/>
    <rect x="197" y="91" width="11" height="37" rx="2" fill="#a8d878" fillOpacity="0.55"/>
    <rect x="212" y="78" width="11" height="50" rx="2" fill="#a8d878" fillOpacity="0.72"/>
    {/* Stand */}
    <rect x="141" y="136" width="26" height="8" rx="4" fill="#3a4a1d" fillOpacity="0.11"/>
    <rect x="126" y="144" width="56" height="5" rx="2.5" fill="#3a4a1d" fillOpacity="0.09"/>
    {/* Badge */}
    <circle cx="250" cy="48" r="27" fill="white" stroke="#a8d878" strokeOpacity="0.28" strokeWidth="1.5"/>
    <circle cx="250" cy="48" r="20" fill="#f0f5eb"/>
    <path d="M250 32 L253.8 43.5 L266 43.5 L256 50.5 L259.8 62 L250 55 L240.2 62 L244 50.5 L234 43.5 L246.2 43.5 Z" fill="#a8d878" fillOpacity="0.6"/>
    {/* Floating node */}
    <circle cx="42" cy="82" r="8" fill="#a8d878" fillOpacity="0.18"/>
    <circle cx="42" cy="82" r="16" stroke="#a8d878" strokeOpacity="0.12" strokeWidth="1.5"/>
    <line x1="58" y1="82" x2="75" y2="82" stroke="#a8d878" strokeOpacity="0.22" strokeWidth="1" strokeDasharray="4,3"/>
  </svg>
);

const IllustTeam = () => (
  <svg viewBox="0 0 300 180" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    {/* Pulse rings */}
    <circle cx="150" cy="90" r="52" stroke="#a8d878" strokeOpacity="0.11" strokeWidth="1" strokeDasharray="5,5"/>
    <circle cx="150" cy="90" r="72" stroke="#a8d878" strokeOpacity="0.06" strokeWidth="1" strokeDasharray="4,9"/>
    {/* Center hub */}
    <circle cx="150" cy="90" r="30" fill="#192c0d" fillOpacity="0.08" stroke="#192c0d" strokeOpacity="0.12" strokeWidth="1.5"/>
    <circle cx="150" cy="90" r="20" fill="#192c0d" fillOpacity="0.07"/>
    <circle cx="150" cy="90" r="10" fill="#a8d878" fillOpacity="0.32"/>
    {/* Top */}
    <line x1="150" y1="38" x2="150" y2="60" stroke="#a8d878" strokeOpacity="0.32" strokeWidth="1.5"/>
    <circle cx="150" cy="22" r="18" fill="#192c0d" fillOpacity="0.07" stroke="#a8d878" strokeOpacity="0.22" strokeWidth="1.5"/>
    <circle cx="150" cy="22" r="10" fill="#a8d878" fillOpacity="0.25"/>
    {/* Top-right */}
    <line x1="226" y1="56" x2="180" y2="76" stroke="#a8d878" strokeOpacity="0.28" strokeWidth="1.5"/>
    <circle cx="240" cy="48" r="16" fill="#192c0d" fillOpacity="0.07" stroke="#a8d878" strokeOpacity="0.18" strokeWidth="1"/>
    <circle cx="240" cy="48" r="9" fill="#a8d878" fillOpacity="0.2"/>
    {/* Bottom-right */}
    <line x1="226" y1="126" x2="180" y2="106" stroke="#a8d878" strokeOpacity="0.28" strokeWidth="1.5"/>
    <circle cx="240" cy="134" r="16" fill="#192c0d" fillOpacity="0.07" stroke="#a8d878" strokeOpacity="0.18" strokeWidth="1"/>
    <circle cx="240" cy="134" r="9" fill="#a8d878" fillOpacity="0.2"/>
    {/* Top-left */}
    <line x1="74" y1="56" x2="120" y2="76" stroke="#a8d878" strokeOpacity="0.28" strokeWidth="1.5"/>
    <circle cx="60" cy="48" r="16" fill="#192c0d" fillOpacity="0.07" stroke="#a8d878" strokeOpacity="0.18" strokeWidth="1"/>
    <circle cx="60" cy="48" r="9" fill="#a8d878" fillOpacity="0.2"/>
    {/* Bottom-left */}
    <line x1="74" y1="126" x2="120" y2="106" stroke="#a8d878" strokeOpacity="0.28" strokeWidth="1.5"/>
    <circle cx="60" cy="134" r="16" fill="#192c0d" fillOpacity="0.07" stroke="#a8d878" strokeOpacity="0.18" strokeWidth="1"/>
    <circle cx="60" cy="134" r="9" fill="#a8d878" fillOpacity="0.2"/>
    {/* Bottom */}
    <line x1="150" y1="158" x2="150" y2="120" stroke="#a8d878" strokeOpacity="0.28" strokeWidth="1.5"/>
    <circle cx="150" cy="163" r="15" fill="#192c0d" fillOpacity="0.07" stroke="#a8d878" strokeOpacity="0.18" strokeWidth="1"/>
    <circle cx="150" cy="163" r="8" fill="#a8d878" fillOpacity="0.2"/>
  </svg>
);

const IllustSupport = () => (
  <svg viewBox="0 0 300 180" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lg_sup" x1="30" y1="0" x2="270" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#192c0d" stopOpacity="0.07"/>
        <stop offset="100%" stopColor="#a8d878" stopOpacity="0.28"/>
      </linearGradient>
    </defs>
    {/* Grid lines */}
    <line x1="28" y1="170" x2="275" y2="170" stroke="#3a4a1d" strokeOpacity="0.06" strokeWidth="1"/>
    <line x1="28" y1="135" x2="275" y2="135" stroke="#3a4a1d" strokeOpacity="0.04" strokeWidth="1" strokeDasharray="3,5"/>
    <line x1="28" y1="100" x2="275" y2="100" stroke="#3a4a1d" strokeOpacity="0.04" strokeWidth="1" strokeDasharray="3,5"/>
    <line x1="28" y1="65" x2="275" y2="65" stroke="#3a4a1d" strokeOpacity="0.04" strokeWidth="1" strokeDasharray="3,5"/>
    <line x1="28" y1="30" x2="275" y2="30" stroke="#3a4a1d" strokeOpacity="0.04" strokeWidth="1" strokeDasharray="3,5"/>
    {/* Area fill */}
    <path d="M50 148 C95 148 115 95 152 78 C189 62 220 82 268 44 L268 170 L50 170 Z" fill="#a8d878" fillOpacity="0.05"/>
    {/* Path */}
    <path d="M50 148 C95 148 115 95 152 78 C189 62 220 82 268 44" stroke="url(#lg_sup)" strokeWidth="2.5" fill="none"/>
    <path d="M50 148 C95 148 115 95 152 78 C189 62 220 82 268 44" stroke="#a8d878" strokeWidth="2" strokeDasharray="6,4" fill="none" strokeOpacity="0.35"/>
    {/* Stage 1 - 導入 */}
    <circle cx="50" cy="148" r="22" fill="white" stroke="#192c0d" strokeOpacity="0.13" strokeWidth="1.5"/>
    <circle cx="50" cy="148" r="14" fill="#192c0d" fillOpacity="0.06"/>
    <circle cx="50" cy="148" r="7" fill="#192c0d" fillOpacity="0.18"/>
    <text x="50" y="127" textAnchor="middle" fontSize="9" fill="#3a4a1d" fillOpacity="0.55" fontWeight="700" letterSpacing="0.3">導入</text>
    {/* Stage 2 - 定着 */}
    <circle cx="152" cy="78" r="22" fill="white" stroke="#a8d878" strokeOpacity="0.28" strokeWidth="1.5"/>
    <circle cx="152" cy="78" r="14" fill="#192c0d" fillOpacity="0.07"/>
    <circle cx="152" cy="78" r="7" fill="#a8d878" fillOpacity="0.42"/>
    <text x="152" y="57" textAnchor="middle" fontSize="9" fill="#3a4a1d" fillOpacity="0.55" fontWeight="700" letterSpacing="0.3">定着</text>
    {/* Stage 3 - 改善 */}
    <circle cx="262" cy="47" r="22" fill="white" stroke="#a8d878" strokeOpacity="0.42" strokeWidth="1.5"/>
    <circle cx="262" cy="47" r="14" fill="#a8d878" fillOpacity="0.1"/>
    <circle cx="262" cy="47" r="7" fill="#a8d878" fillOpacity="0.55"/>
    <text x="262" y="26" textAnchor="middle" fontSize="9" fill="#3a4a1d" fillOpacity="0.55" fontWeight="700" letterSpacing="0.3">改善</text>
    {/* Arrow */}
    <path d="M268 42 L276 28 L284 42" stroke="#a8d878" strokeWidth="2" strokeOpacity="0.48" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Tiny dots */}
    <circle cx="100" cy="128" r="3" fill="#a8d878" fillOpacity="0.25"/>
    <circle cx="205" cy="64" r="3" fill="#a8d878" fillOpacity="0.25"/>
  </svg>
);

// SVG illustrations for Service detail panels
const IllustImplement = () => (
  <svg viewBox="0 0 260 200" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lg_impl" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#a8d878" stopOpacity="0.2"/>
        <stop offset="100%" stopColor="#192c0d" stopOpacity="0.04"/>
      </linearGradient>
    </defs>
    {/* Connection lines */}
    <line x1="130" y1="60" x2="80" y2="105" stroke="#a8d878" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="4,3"/>
    <line x1="130" y1="60" x2="130" y2="105" stroke="#a8d878" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="4,3"/>
    <line x1="130" y1="60" x2="180" y2="105" stroke="#a8d878" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="4,3"/>
    <line x1="80" y1="130" x2="55" y2="160" stroke="#a8d878" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3,3"/>
    <line x1="80" y1="130" x2="105" y2="160" stroke="#a8d878" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3,3"/>
    <line x1="180" y1="130" x2="155" y2="160" stroke="#a8d878" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3,3"/>
    <line x1="180" y1="130" x2="205" y2="160" stroke="#a8d878" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3,3"/>
    {/* Top node */}
    <rect x="105" y="35" width="50" height="32" rx="8" fill="#192c0d" fillOpacity="0.1" stroke="#192c0d" strokeOpacity="0.15" strokeWidth="1.5"/>
    <rect x="113" y="45" width="34" height="5" rx="2" fill="#a8d878" fillOpacity="0.5"/>
    <rect x="113" y="53" width="24" height="4" rx="2" fill="#a8d878" fillOpacity="0.3"/>
    {/* Mid nodes */}
    <rect x="55" y="105" width="50" height="30" rx="7" fill="#192c0d" fillOpacity="0.08" stroke="#a8d878" strokeOpacity="0.2" strokeWidth="1"/>
    <rect x="62" y="114" width="30" height="4" rx="2" fill="#a8d878" fillOpacity="0.4"/>
    <rect x="62" y="121" width="22" height="4" rx="2" fill="#a8d878" fillOpacity="0.25"/>
    <rect x="105" y="105" width="50" height="30" rx="7" fill="#192c0d" fillOpacity="0.08" stroke="#a8d878" strokeOpacity="0.2" strokeWidth="1"/>
    <rect x="112" y="114" width="30" height="4" rx="2" fill="#a8d878" fillOpacity="0.4"/>
    <rect x="112" y="121" width="22" height="4" rx="2" fill="#a8d878" fillOpacity="0.25"/>
    <rect x="155" y="105" width="50" height="30" rx="7" fill="#192c0d" fillOpacity="0.08" stroke="#a8d878" strokeOpacity="0.2" strokeWidth="1"/>
    <rect x="162" y="114" width="30" height="4" rx="2" fill="#a8d878" fillOpacity="0.4"/>
    <rect x="162" y="121" width="22" height="4" rx="2" fill="#a8d878" fillOpacity="0.25"/>
    {/* Bottom nodes */}
    <rect x="30" y="155" width="40" height="26" rx="6" fill="url(#lg_impl)" stroke="#a8d878" strokeOpacity="0.15" strokeWidth="1"/>
    <rect x="80" y="155" width="40" height="26" rx="6" fill="url(#lg_impl)" stroke="#a8d878" strokeOpacity="0.15" strokeWidth="1"/>
    <rect x="138" y="155" width="40" height="26" rx="6" fill="url(#lg_impl)" stroke="#a8d878" strokeOpacity="0.15" strokeWidth="1"/>
    <rect x="188" y="155" width="40" height="26" rx="6" fill="url(#lg_impl)" stroke="#a8d878" strokeOpacity="0.15" strokeWidth="1"/>
  </svg>
);

const IllustOps = () => (
  <svg viewBox="0 0 260 200" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    {/* Outer ring */}
    <circle cx="130" cy="100" r="80" stroke="#192c0d" strokeOpacity="0.08" strokeWidth="1.5" strokeDasharray="5,5"/>
    {/* Middle ring */}
    <circle cx="130" cy="100" r="58" stroke="#a8d878" strokeOpacity="0.18" strokeWidth="1.5"/>
    {/* Inner ring */}
    <circle cx="130" cy="100" r="36" stroke="#a8d878" strokeOpacity="0.28" strokeWidth="2"/>
    {/* Center */}
    <circle cx="130" cy="100" r="20" fill="#192c0d" fillOpacity="0.09"/>
    <circle cx="130" cy="100" r="11" fill="#a8d878" fillOpacity="0.35"/>
    {/* Ticks on outer ring */}
    {[0,60,120,180,240,300].map((deg, i) => {
      const rad = (deg - 90) * Math.PI / 180;
      const x1 = 130 + 72 * Math.cos(rad); const y1 = 100 + 72 * Math.sin(rad);
      const x2 = 130 + 80 * Math.cos(rad); const y2 = 100 + 80 * Math.sin(rad);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#a8d878" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round"/>;
    })}
    {/* Status dots on middle ring */}
    {[30,90,150,210,270,330].map((deg, i) => {
      const rad = (deg - 90) * Math.PI / 180;
      const cx = 130 + 58 * Math.cos(rad); const cy = 100 + 58 * Math.sin(rad);
      return <circle key={i} cx={cx} cy={cy} r="5" fill="#a8d878" fillOpacity={0.25 + i*0.08}/>;
    })}
    {/* Sweep indicator */}
    <path d="M130 100 L130 44" stroke="#a8d878" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round"/>
    <path d="M130 100 L168 68" stroke="#192c0d" strokeOpacity="0.25" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="130" cy="100" r="4" fill="#a8d878" fillOpacity="0.7"/>
  </svg>
);

const IllustConsult = () => (
  <svg viewBox="0 0 260 200" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lg_con" x1="0" y1="200" x2="0" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#a8d878" stopOpacity="0.35"/>
        <stop offset="100%" stopColor="#a8d878" stopOpacity="0.08"/>
      </linearGradient>
    </defs>
    {/* Axes */}
    <line x1="45" y1="165" x2="235" y2="165" stroke="#3a4a1d" strokeOpacity="0.12" strokeWidth="1.5"/>
    <line x1="45" y1="30" x2="45" y2="165" stroke="#3a4a1d" strokeOpacity="0.12" strokeWidth="1.5"/>
    {/* Grid */}
    {[45,80,115,150].map((y, i) => (
      <line key={i} x1="45" y1={y} x2="235" y2={y} stroke="#3a4a1d" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="3,5"/>
    ))}
    {/* Area */}
    <path d="M60 145 L95 130 L130 105 L165 80 L200 55 L225 40 L225 165 L60 165 Z" fill="url(#lg_con)"/>
    {/* Line */}
    <path d="M60 145 L95 130 L130 105 L165 80 L200 55 L225 40" stroke="#a8d878" strokeWidth="2.5" fill="none" strokeLinejoin="round"/>
    {/* Data points */}
    {[[60,145],[95,130],[130,105],[165,80],[200,55],[225,40]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="5" fill="white" stroke="#a8d878" strokeWidth="2" strokeOpacity="0.7"/>
    ))}
    {/* KPI boxes */}
    <rect x="155" y="100" width="70" height="28" rx="6" fill="#192c0d" fillOpacity="0.07" stroke="#a8d878" strokeOpacity="0.2" strokeWidth="1"/>
    <rect x="162" y="108" width="35" height="4" rx="2" fill="#a8d878" fillOpacity="0.45"/>
    <rect x="162" y="116" width="25" height="4" rx="2" fill="#a8d878" fillOpacity="0.25"/>
  </svg>
);

// ---- Shared: Why Choose Us ----
const WhyChooseUs = () => (
  <section className="py-28 bg-[#f9f9f3] border-t border-[#3a4a1d]/8 overflow-hidden">
    <div className="max-w-6xl mx-auto px-6">
      <FadeUp className="mb-20">
        <p className="text-[#a8d878] font-black tracking-[0.35em] text-xs uppercase mb-5">Why S&S?</p>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[#192c0d] leading-tight mb-6">
          S＆Sが選ばれる理由
        </h2>
        <div className="w-14 h-1.5 bg-gradient-to-r from-[#a8d878] to-[#3a4a1d] rounded-full" />
      </FadeUp>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            illust: <IllustExpert />,
            label: '01',
            title: 'Salesforce公認の専門家が直接参画',
            desc: '代表は元Salesforce JapanのSEとして多数のCRM導入プロジェクトを経験。Salesforce認定資格保有者が貴社の案件に直接参画します。',
          },
          {
            illust: <IllustTeam />,
            label: '02',
            title: 'エンジニア・SIer・構築パートナー出身のチーム',
            desc: 'エンジニア出身、SIer経験者、Salesforce構築パートナー出身のメンバーで構成。現場を熟知したプロフェッショナルが課題解決を支援します。',
          },
          {
            illust: <IllustSupport />,
            label: '03',
            title: '導入から運用まで一貫サポート',
            desc: 'CRMの導入支援で終わらず、定着化・継続改善まで伴走します。長期的なパートナーとして、投資対効果の最大化をともに目指します。',
          },
        ].map((item, i) => (
          <FadeUp key={i} delay={i * 0.12}>
            <div className="bg-white rounded-3xl overflow-hidden h-full group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border border-[#3a4a1d]/5">
              <div className="h-48 bg-gradient-to-br from-[#eef6e6] to-[#f5faf2] relative overflow-hidden">
                {item.illust}
                <span className="absolute top-4 right-5 text-[#192c0d]/10 font-serif font-black text-5xl leading-none select-none">{item.label}</span>
              </div>
              <div className="p-8">
                <h3 className="text-base font-bold text-[#192c0d] mb-4 leading-snug">{item.title}</h3>
                <p className="text-[#666] leading-loose text-sm">{item.desc}</p>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </div>
  </section>
);

// ---- Claude × S&S Bot icon ----
const ClaudeSSIcon = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="36" rx="10" fill="#192c0d"/>
    {/* Claude-inspired asterisk (6-arm starburst) */}
    <line x1="18" y1="6.5" x2="18" y2="29.5" stroke="#a8d878" strokeWidth="2.2" strokeLinecap="round"/>
    <line x1="7.4" y1="12.2" x2="28.6" y2="23.8" stroke="#a8d878" strokeWidth="2.2" strokeLinecap="round"/>
    <line x1="7.4" y1="23.8" x2="28.6" y2="12.2" stroke="#a8d878" strokeWidth="2.2" strokeLinecap="round"/>
    {/* Center glow dot */}
    <circle cx="18" cy="18" r="3" fill="#a8d878" fillOpacity="0.9"/>
    <circle cx="18" cy="18" r="1.4" fill="#f9f9f3"/>
  </svg>
);

// ---- Typing bubble ----
const TypingBubble = () => (
  <div className="flex justify-start">
    <div className="bg-[#f0f5eb] rounded-2xl rounded-bl-none border border-[#3a4a1d]/8 px-5 py-3.5 flex gap-2 items-center">
      {[0, 0.18, 0.36].map((delay, i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-[#3a4a1d]/35"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.55, repeat: Infinity, delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  </div>
);

// ---- ChatBot ----
const faqList = [
  {
    keys: ['salesforce', 'セールスフォース', 'sf', 'sales cloud', 'service cloud', 'agentforce', 'experience cloud', 'marketing cloud'],
    ans: 'Salesforceについてですね。世界No.1シェアを誇るCRMプラットフォームで、営業・CS・マーケティング・ECと幅広い業務領域をカバーしています。\n\nS&Sでは Sales Cloud / Service Cloud / Marketing Cloud / Experience Cloud / Agentforce など全製品に対応しており、元Salesforce Japan SEの代表が直接プロジェクトに参画します。どの製品についてお知りになりたいですか？',
  },
  {
    keys: ['hubspot', 'ハブスポット'],
    ans: 'HubSpotは、マーケティング・営業・CS機能が一体化したオールインワンCRMです。比較的導入ハードルが低く、スタートアップ〜中小企業に人気があります。\n\nS&Sでは Marketing Hub / Sales Hub / Service Hub の導入設定から運用定着まで支援しています。Salesforceとの比較や、どちらが自社に合うかといったご相談もお気軽にどうぞ。',
  },
  {
    keys: ['kintone', 'キントーン', 'サイボウズ'],
    ans: 'kintoneはサイボウズが提供するノーコード業務プラットフォームです。エンジニアなしでもアプリを作れる柔軟性が特徴で、CRMとして活用する企業も増えています。\n\nS&Sでは kintone を活用した業務アプリ開発・外部CRMとの連携・自動化設計まで対応しています。既存の業務フローを踏まえた提案が可能です。',
  },
  {
    keys: ['料金', '費用', 'コスト', '価格', 'いくら'],
    ans: 'ご予算について気になられているんですね。料金はプロジェクトの規模・期間・カスタマイズ量によって大きく異なるため、一概にお答えするのが難しい部分があります。\n\nただ、まずは無料のヒアリングで現状の課題を整理し、予算感に合わせた最適なプランをご提案しています。「費用を抑えたい」というご要望も遠慮なくお伝えください。',
  },
  {
    keys: ['期間', 'どのくらい', 'スケジュール', '工期', 'いつ'],
    ans: '導入期間はプロジェクトの複雑さによりますが、目安としては：\n\n• 小規模（標準設定）：1〜2ヶ月\n• 標準導入（カスタマイズあり）：3〜4ヶ月\n• 大規模（複数部門・連携多数）：6ヶ月〜\n\nアジャイルで進めるため、途中での仕様変更にも柔軟に対応できます。まず動かして改善していくスタイルが好評です。',
  },
  {
    keys: ['導入', '始め', 'スタート', '検討', '初めて'],
    ans: 'CRM導入を検討されているんですね。最初の一歩として、まず現状の課題を整理することが大切です。\n\nS&Sでは無料のヒアリングセッションを提供しており、「どのCRMが合うか」「どこから手をつければいいか」といった入口からご支援しています。初めての方でも安心してご相談ください。',
  },
  {
    keys: ['保守', '運用', 'サポート', 'メンテ', '障害', '定着'],
    ans: '「入れたら終わり」にならないよう、S&Sでは導入後の伴走支援を重視しています。\n\n具体的には、ユーザー研修・定着化支援・継続的な機能改善・システム監視・月次レポートと改善提案などを長期パートナーとして提供します。スポット対応のみのご依頼も歓迎です。',
  },
  {
    keys: ['資格', '認定', '実績', '経験', '専門'],
    ans: 'S&Sのチームについてですね。代表は元Salesforce JapanのSEとして多数のCRM導入プロジェクトを経験し、複数のSalesforce認定資格を保有しています。\n\nメンバーもSIer・Salesforce構築パートナー出身の実践経験者で構成されており、「現場を知るチーム」として貴社の案件に直接向き合います。',
  },
  {
    keys: ['ai', 'エージェント', '自動化', '生成ai', 'llm', 'claude', 'gpt'],
    ans: 'AIとCRMの連携は非常に注目されている領域ですね。S&SではSalesforceのAgentforce（AIエージェント機能）を活用した業務自動化や、生成AIをCRMデータと組み合わせた提案書・メール自動生成なども支援しています。\n\nまた、このBotそのものがClaude Codeを活用して構築されています。カスタムCRM開発にAIを組み込むご要望もお気軽にどうぞ。',
  },
  {
    keys: ['データ移行', '移行', 'migration', '乗り換え', '引越し', '移管'],
    ans: 'CRMの乗り換えや移行は、データの整合性確保が最も重要な工程です。S&Sではデータクレンジング・マッピング設計・移行テスト・本番移行まで、リスクを最小化しながら一貫してサポートします。\n\nExcelや旧システムからの移行実績もあります。どのようなデータをお持ちか教えていただけると、より具体的にお答えできます。',
  },
  {
    keys: ['会社', 'どんな', 'どういう', 's&s', 'エスアンドエス', 'について'],
    ans: 'S&S合同会社は、東京・渋谷を拠点とするCRM専門のコンサルティング会社です。\n\n元Salesforce Japan SEの代表を中心に、SIer・構築パートナー出身メンバーが在籍。「導入して終わり」ではなく、CRMが現場に定着して成果を出すまでを支援することをミッションとしています。',
  },
  {
    keys: ['連絡', 'お問い合わせ', 'contact', '相談', 'メール', '電話'],
    ans: 'ご相談は画面上部の「お問い合わせ」メニューから、フォームにてお気軽にどうぞ。\n\n初回相談は無料で、通常2営業日以内にご返信します。「まだ検討段階」「何から聞けばいいかわからない」という段階でも大歓迎です。',
  },
];

const ChatBot = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'こんにちは！S&SのCRMアシスタントです。\nSalesforce・HubSpot・Kintoneなどの導入・活用についてお気軽にご質問ください。' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const userMessages = messages.filter(m => m.role === 'user');

  const handleInquiry = () => {
    const summary = messages
      .filter(m => m.role === 'user' || m.role === 'bot')
      .map(m => m.role === 'user' ? `【ご質問】${m.text}` : `【回答概要】${m.text.split('\n')[0]}`)
      .join('\n');
    const description = `＝チャットでのご相談内容＝\n${summary}\n\n（上記の内容について、さらに詳しくご相談したい場合はこちらにご記入ください）`;
    setIsOpen(false);
    navigate('/contact', { state: { description } });
  };

  const getAnswer = (text: string) => {
    const q = text.toLowerCase();
    for (const faq of faqList) {
      if (faq.keys.some(k => q.includes(k))) return faq.ans;
    }
    return 'ご質問ありがとうございます。いただいた内容について、より正確にお答えするために専門スタッフが対応させていただきます。\n\nお問い合わせフォームからご連絡いただけますと、2営業日以内にご回答します。';
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);
    // 考えている演出: 1.2〜2秒のランダム遅延
    const delay = 1200 + Math.random() * 800;
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'bot', text: getAnswer(userText) }]);
    }, delay);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(v => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl"
        style={{ background: 'transparent' }}
        aria-label="チャットを開く"
      >
        <AnimatePresence mode="wait">
          {isOpen
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0, scale: 0.8 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                className="w-14 h-14 bg-[#192c0d] rounded-2xl flex items-center justify-center border-2 border-[#a8d878]/20">
                <X size={22} className="text-[#a8d878]" />
              </motion.div>
            : <motion.div key="icon" initial={{ rotate: 90, opacity: 0, scale: 0.8 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: -90, opacity: 0, scale: 0.8 }}>
                <ClaudeSSIcon size={56} />
              </motion.div>
          }
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-50 w-[calc(100vw-48px)] sm:w-96 bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#3a4a1d]/8 flex flex-col"
            style={{ maxHeight: '72vh' }}
          >
            {/* Header */}
            <div className="bg-[#192c0d] px-5 py-4 flex items-center gap-3 shrink-0">
              <ClaudeSSIcon size={38} />
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm leading-none mb-1">S&S CRM アシスタント</p>
                <p className="text-[#a8d878]/70 text-[10px] tracking-wide">Powered by Claude Code × S&S</p>
              </div>
              <span className="flex items-center gap-1.5 text-[#a8d878] text-xs shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#a8d878] animate-pulse" />
                オンライン
              </span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'bot' && (
                    <div className="w-6 h-6 rounded-lg bg-[#192c0d] flex items-center justify-center shrink-0 mr-2 mt-0.5">
                      <svg width="14" height="14" viewBox="0 0 36 36" fill="none">
                        <line x1="18" y1="4" x2="18" y2="32" stroke="#a8d878" strokeWidth="3" strokeLinecap="round"/>
                        <line x1="5" y1="11" x2="31" y2="25" stroke="#a8d878" strokeWidth="3" strokeLinecap="round"/>
                        <line x1="5" y1="25" x2="31" y2="11" stroke="#a8d878" strokeWidth="3" strokeLinecap="round"/>
                        <circle cx="18" cy="18" r="3" fill="#a8d878"/>
                      </svg>
                    </div>
                  )}
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-[#192c0d] text-[#f9f9f3] rounded-br-none'
                      : 'bg-[#f0f5eb] text-[#333] rounded-bl-none border border-[#3a4a1d]/8'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-end gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#192c0d] flex items-center justify-center shrink-0">
                    <svg width="14" height="14" viewBox="0 0 36 36" fill="none">
                      <line x1="18" y1="4" x2="18" y2="32" stroke="#a8d878" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="5" y1="11" x2="31" y2="25" stroke="#a8d878" strokeWidth="3" strokeLinecap="round"/>
                      <line x1="5" y1="25" x2="31" y2="11" stroke="#a8d878" strokeWidth="3" strokeLinecap="round"/>
                      <circle cx="18" cy="18" r="3" fill="#a8d878"/>
                    </svg>
                  </div>
                  <TypingBubble />
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Suggestions */}
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto shrink-0 scrollbar-none">
              {['料金について', '導入期間は？', 'Salesforceとは', 'AIとCRMは？'].map(s => (
                <button key={s} onClick={() => { setInput(s); }}
                  className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-[#f0f5eb] text-[#3a4a1d] border border-[#3a4a1d]/12 hover:bg-[#e4f0d8] transition-colors whitespace-nowrap">
                  {s}
                </button>
              ))}
            </div>

            {/* Chat → Contact form handoff */}
            {userMessages.length >= 1 && (
              <div className="px-3 pb-3 shrink-0">
                <button
                  onClick={handleInquiry}
                  className="w-full text-xs py-2.5 rounded-full bg-[#192c0d] text-[#a8d878] font-bold tracking-wide hover:bg-[#2a4a18] transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowRight size={13} />
                  この内容でお問い合わせフォームへ
                </button>
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-[#3a4a1d]/8 flex gap-2 shrink-0">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="CRMについて質問する..."
                disabled={isTyping}
                className="flex-1 text-sm px-4 py-2.5 rounded-full bg-[#f9f9f3] border border-[#3a4a1d]/12 focus:outline-none focus:border-[#3a4a1d]/30 transition-colors disabled:opacity-50"
              />
              <button type="submit" disabled={!input.trim() || isTyping}
                className="w-10 h-10 rounded-full bg-[#192c0d] flex items-center justify-center shrink-0 hover:bg-[#2a4a18] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <Send size={14} className="text-[#a8d878]" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ---- Footer ----
const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-[#0f1f07] text-[#f9f9f3] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16 pb-12 border-b border-[#f9f9f3]/8">
          <div className="md:col-span-2 space-y-6">
            <div className="inline-block bg-[#f9f9f3] p-5 rounded-2xl">
              <BrandLogo size="small" />
            </div>
            <p className="text-sm leading-loose text-[#f9f9f3]/45 max-w-sm">
              CRMの導入・構築・保守運用を通じて、お客様のビジネス課題を一気通貫で解決します。
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-6 text-[#f9f9f3]/60 tracking-widest uppercase">Menu</h4>
            <div className="flex flex-col gap-3 text-sm text-[#f9f9f3]/45">
              {[
                { path: '/', label: 'ホーム' },
                { path: '/about', label: '会社について' },
                { path: '/service', label: 'サービス' },
                { path: '/contact', label: 'お問い合わせ' },
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="text-left hover:text-white hover:opacity-100 transition-all"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-6 text-[#f9f9f3]/60 tracking-widest uppercase">Contact</h4>
            <div className="flex flex-col gap-3 text-sm text-[#f9f9f3]/45">
              <p className="leading-relaxed">〒150-0043<br />東京都渋谷区道玄坂1丁目10番8号<br />渋谷道玄坂東急ビル2F−C</p>
              <button
                onClick={() => navigate('/contact')}
                className="text-left underline hover:text-white hover:opacity-100 transition-all mt-2 text-xs"
              >
                お問い合わせフォーム →
              </button>
              <div className="pt-4 border-t border-[#f9f9f3]/8 mt-2">
                <p className="mb-3 text-xs tracking-widest uppercase">Follow</p>
                <a
                  href="https://www.instagram.com/ai_rakuchin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#f9f9f3]/8 hover:bg-[#f9f9f3]/15 transition-all"
                >
                  <Instagram size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#f9f9f3]/25">
          <p>© 2025 S＆S合同会社. All Rights Reserved.</p>
          <div className="flex gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ---- Home ----
const Home = () => {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">

      {/* Hero — negative margin extends section behind sticky transparent navbar */}
      <section className="relative min-h-screen bg-[#192c0d] flex items-center justify-center overflow-hidden -mt-20 pt-20">
        <svg className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none">
          <defs>
            <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#f9f9f3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-48 -right-48 w-[700px] h-[700px] rounded-full border border-[#f9f9f3]/8 pointer-events-none" />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-64 -left-48 w-[900px] h-[900px] rounded-full border border-[#f9f9f3]/5 pointer-events-none" />
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[#a8d878]/10 pointer-events-none" />
        <div className="absolute top-1/4 right-1/3 w-80 h-80 bg-[#3a6a1a] rounded-full blur-[120px] opacity-30 pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/4 w-60 h-60 bg-[#2a5010] rounded-full blur-[100px] opacity-25 pointer-events-none" />

        <div className="relative z-10 text-center max-w-5xl px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}>
            <span className="inline-block text-[#a8d878] text-xs font-bold tracking-[0.4em] uppercase mb-10 px-4 py-2 border border-[#a8d878]/30 rounded-full">
              CRM Consulting
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.9 }}
            className="font-serif text-[#f9f9f3] mb-8 font-bold"
            style={{ fontSize: 'clamp(1.6rem, 6.8vw, 4.5rem)', lineHeight: 1.2 }}
          >
            働く環境に変化をもたらし<br />
            毎日を少しでも<span className="text-[#a8d878]">『楽』</span>に
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-base md:text-lg text-[#f9f9f3]/65 mb-12 max-w-2xl mx-auto leading-loose"
          >
            CRMの導入・構築・保守運用を中心にS＆S合同会社が貴社のビジネス課題を一気通貫で解決します
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/service')}
              className="bg-[#f9f9f3] text-[#1a2e10] px-10 py-4 rounded-full font-bold text-base hover:bg-white transition-all shadow-2xl inline-flex items-center justify-center gap-3"
            >
              サービスを見る <ArrowRight size={18} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/contact')}
              className="border border-[#f9f9f3]/30 text-[#f9f9f3] px-10 py-4 rounded-full font-bold text-base hover:border-[#f9f9f3]/60 hover:bg-[#f9f9f3]/5 transition-all inline-flex items-center justify-center gap-3"
            >
              無料相談はこちら
            </motion.button>
          </motion.div>
        </div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 rounded-full border border-[#f9f9f3]/20 flex items-start justify-center pt-2">
            <div className="w-1 h-2 bg-[#f9f9f3]/40 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Services */}
      <section className="py-32 bg-[#f9f9f3]">
        <div className="max-w-7xl mx-auto px-6">
          <FadeUp className="mb-20">
            <p className="text-[#a8d878] font-black tracking-[0.35em] text-xs uppercase mb-5">What We Do</p>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-[#192c0d] leading-tight mb-6">
              CRMで<span className="text-[#3a4a1d]">ビジネスを</span>変える
            </h2>
            <div className="w-14 h-1.5 bg-gradient-to-r from-[#a8d878] to-[#3a4a1d] rounded-full" />
          </FadeUp>

          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#3a4a1d]/10 border border-[#3a4a1d]/10 rounded-3xl overflow-hidden">
            {[
              {
                num: '01', icon: <Database size={32} />,
                title: 'CRM導入・構築',
                en: 'CRM Implementation',
                desc: 'SalesforceをはじめとするクラウドCRMの設計・実装。貴社の業務プロセスに合わせた柔軟な構築を実現します。',
              },
              {
                num: '02', icon: <Layers size={32} />,
                title: 'CRM保守・運用サポート',
                en: 'Operations & Support',
                desc: '導入後の定着化支援から継続的な改善まで。長期パートナーとして運用をフルサポートします。',
              },
              {
                num: '03', icon: <Target size={32} />,
                title: 'CRMの活用コンサルティング',
                en: 'CRM Consulting',
                desc: 'CRMデータの活用戦略策定から、AI・MAツールの連携支援まで。投資対効果を最大化します。',
              },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                whileHover={{ backgroundColor: '#192c0d' }}
                onClick={() => navigate('/service')}
                className="group relative p-10 md:p-12 bg-white cursor-pointer transition-colors duration-500"
              >
                <span className="text-7xl font-serif font-bold text-[#3a4a1d]/8 group-hover:text-[#a8d878]/15 transition-colors leading-none block mb-6">{s.num}</span>
                <div className="text-[#3a4a1d] group-hover:text-[#a8d878] transition-colors mb-6">{s.icon}</div>
                <h3 className="text-xl font-bold text-[#192c0d] group-hover:text-[#f9f9f3] transition-colors mb-1 leading-snug">{s.title}</h3>
                <p className="text-xs text-[#999] group-hover:text-[#a8d878]/70 transition-colors mb-6 uppercase tracking-widest">{s.en}</p>
                <p className="text-[#555] group-hover:text-[#f9f9f3]/70 transition-colors leading-relaxed text-sm mb-8">{s.desc}</p>
                <div className="flex items-center gap-2 text-[#3a4a1d] group-hover:text-[#a8d878] transition-all">
                  <span className="text-sm font-bold">詳しく見る</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <FadeUp>
              <span className="text-[#3a4a1d] font-bold tracking-[0.2em] text-xs uppercase mb-6 block">Who We Are</span>
              <h2 className="text-4xl md:text-5xl font-serif text-[#192c0d] mb-8 leading-tight">
                S＆Sとは<br />
                <em className="not-italic text-[#3a4a1d]">CRM専門の</em><br />
                頼れるパートナー
              </h2>
              <p className="text-[#555] leading-loose text-base md:text-lg mb-10">
                S＆S合同会社は、CRM（Salesforce・HubSpot・Kintone等）の導入・構築・保守運用を専門とするコンサルティング会社です。
                元Salesforce Japan出身の代表を中心に、エンジニア・SIer・構築パートナー出身のメンバーが、戦略から実装・定着化まで一貫してサポートします。
              </p>
              <button
                onClick={() => navigate('/about')}
                className="group inline-flex items-center gap-3 text-[#3a4a1d] font-bold border-b-2 border-[#3a4a1d] pb-1 hover:gap-5 transition-all duration-300"
              >
                会社について
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </FadeUp>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Salesforce', desc: '元Salesforce Japan出身の代表が対応', icon: <Database size={22} /> },
                { label: 'Speed', desc: '少数精鋭のスピード感ある実行力', icon: <Zap size={22} /> },
                { label: 'All-in-One', desc: '導入から運用まで一気通貫', icon: <CheckCircle size={22} /> },
                { label: 'Team', desc: 'SIer・パートナー出身の多彩なチーム', icon: <Users size={22} /> },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -4 }}
                  className="bg-[#f9f9f3] p-8 rounded-2xl hover:shadow-lg transition-all duration-300 cursor-default"
                >
                  <div className="text-[#3a4a1d] mb-4">{item.icon}</div>
                  <h4 className="font-serif font-bold text-[#192c0d] text-lg mb-2">{item.label}</h4>
                  <p className="text-[#777] text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us (shared component) */}
      <WhyChooseUs />

      {/* CTA Banner */}
      <section className="py-28 bg-[#192c0d] relative overflow-hidden">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full border border-[#f9f9f3]/5 pointer-events-none" />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full border border-[#a8d878]/10 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <FadeUp>
            <h2 className="text-3xl md:text-5xl font-serif text-[#f9f9f3] mb-6 leading-tight">
              CRMのことなら<br />まずはご相談を
            </h2>
            <p className="text-[#f9f9f3]/55 text-base md:text-lg mb-10 leading-loose">
              導入を検討中の方から、既存システムの改善をお考えの方まで。初回のご相談は無料で承っております。
            </p>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/contact')}
              className="bg-[#f9f9f3] text-[#192c0d] px-12 py-5 rounded-full font-bold text-base hover:bg-white transition-all shadow-2xl inline-flex items-center gap-3"
            >
              お問い合わせはこちら <ArrowRight size={18} />
            </motion.button>
          </FadeUp>
        </div>
      </section>
    </motion.div>
  );
};

// ---- About ----
const About = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">

    {/* Page Header */}
    <div className="py-28 md:py-36 bg-[#f9f9f3] border-b border-[#3a4a1d]/10">
      <div className="max-w-4xl mx-auto px-6">
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-[#3a4a1d] font-bold tracking-[0.2em] text-xs uppercase mb-6 block">About</motion.span>
        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#192c0d] mb-8 leading-tight">会社について</motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="text-[#666] text-base md:text-lg leading-loose max-w-2xl">
          S＆S合同会社のミッション・ストーリー・行動指針と会社概要をご紹介します。
        </motion.p>
      </div>
    </div>

    {/* Corporate Identity */}
    <section className="py-28 bg-[#f9f9f3]">
      <div className="max-w-4xl mx-auto px-6">
        <FadeUp className="text-center mb-20">
          <p className="text-[#a8d878] font-black tracking-[0.35em] text-xs uppercase mb-5">Corporate Identity</p>
          <h3 className="text-4xl sm:text-5xl md:text-5xl font-serif font-bold text-[#192c0d] leading-tight mb-6">企業理念</h3>
          <div className="w-14 h-1.5 bg-gradient-to-r from-[#a8d878] to-[#3a4a1d] rounded-full mx-auto" />
        </FadeUp>

        {/* Mission */}
        <FadeUp>
          <div className="bg-[#192c0d] rounded-3xl p-10 md:p-14 text-center mb-16 relative overflow-hidden">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-20 -right-20 w-72 h-72 rounded-full border border-[#f9f9f3]/5 pointer-events-none" />
            <span className="text-[#a8d878] text-xs font-bold tracking-[0.3em] uppercase mb-6 block">Mission</span>
            <p className="text-[#f9f9f3] text-xl md:text-2xl font-serif leading-relaxed relative z-10">
              「働く環境に変化をもたらし<br />
              関わる人たちの毎日を少しでも<span className="text-[#a8d878]">『楽』</span>にする」
            </p>
          </div>
        </FadeUp>

        {/* Story */}
        <FadeUp>
          <div className="bg-white rounded-3xl p-10 md:p-14 mb-10 border border-[#3a4a1d]/8">
            <span className="text-[#3a4a1d] text-xs font-bold tracking-[0.3em] uppercase mb-6 block">Story — 創業の背景</span>
            <div className="space-y-5 text-[#555] leading-[2] text-base">
              <p>
                地方出身で、高卒・専門卒で就職するのが当たり前の環境で育ちました。家族の支えもあり都内の大学へ進学したことで、世界は一変しました。新しいスポーツへの挑戦、多様な価値観との出会い——「環境を変える」ことが、自分だけでなく周囲にも連鎖的に良い影響をもたらすことを体感した経験は、今の自分の根幹になっています。
              </p>
              <p>
                社会人になり、Salesforceを軸に業務効率化の現場に携わる中で、テクノロジーの使い方ひとつで人の働き方がここまで変わるのかという驚きを何度も経験しました。さらにAIの台頭により、その可能性は今まさに指数関数的に広がっています。
              </p>
              <p>
                「仕事を、もっと楽にしたい。」——その一心で起業しました。地方も都市も、学歴も職歴も関係なく、テクノロジーを味方につけることで誰もが自分らしく働ける環境をつくることが、S&S合同会社の原点です。
              </p>
            </div>
          </div>
        </FadeUp>

        {/* Values */}
        <FadeUp className="mb-4">
          <span className="text-[#3a4a1d] text-xs font-bold tracking-[0.3em] uppercase mb-8 block">Value — 3つの行動指針</span>
        </FadeUp>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              num: '1', title: 'Speed & Share', sub: '最速の行動と、価値の共有',
              desc: '完璧主義を捨てて最速で動き、得た知識や感動は出し惜しみせずに関わる人とシェアする。',
            },
            {
              num: '2', title: 'Smart & Strong', sub: '賢い戦略と、ブレない強さ',
              desc: '既存の枠にとらわれない賢い視点（ハック）を持ち、それを最後まで実行しきる強さを持つ。',
            },
            {
              num: '3', title: 'Smile & Synergy', sub: '笑顔と相乗効果',
              desc: '相手の課題に笑顔で寄り添い、お互いの強みを掛け合わせることで、一人では生み出せない変化とゆとりを創り出す。',
            },
          ].map((v, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <motion.div whileHover={{ y: -5 }}
                className="bg-white border border-[#3a4a1d]/8 rounded-2xl p-8 h-full hover:shadow-xl transition-all duration-300">
                <span className="text-5xl font-serif font-bold text-[#3a4a1d]/10 block mb-4">{v.num}</span>
                <h4 className="text-lg font-serif font-bold text-[#192c0d] mb-1">{v.title}</h4>
                <p className="text-xs text-[#999] mb-5 tracking-wide">{v.sub}</p>
                <div className="w-8 h-0.5 bg-[#3a4a1d] opacity-30 mb-5" />
                <p className="text-sm text-[#666] leading-relaxed">{v.desc}</p>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>

    {/* Company Info */}
    <section className="bg-white py-24 border-t border-[#3a4a1d]/8">
      <div className="max-w-3xl mx-auto px-6">
        <FadeUp className="text-center mb-16">
          <p className="text-[#a8d878] font-black tracking-[0.35em] text-xs uppercase mb-5">Company</p>
          <h3 className="text-4xl sm:text-5xl md:text-5xl font-serif font-bold text-[#192c0d] leading-tight mb-6">会社概要</h3>
          <div className="w-14 h-1.5 bg-gradient-to-r from-[#a8d878] to-[#3a4a1d] rounded-full mx-auto" />
        </FadeUp>

        <div className="bg-[#f9f9f3] rounded-3xl overflow-hidden">
          {[
            { label: '会社名', value: <span>S＆S合同会社</span> },
            { label: '代表取締役', value: <span>境野 竣介</span> },
            {
              label: '所在地',
              value: (<span>〒150-0043<br />東京都渋谷区道玄坂1丁目10番8号<br />渋谷道玄坂東急ビル2F−C</span>),
            },
            {
              label: 'アクセス',
              value: (
                <div className="w-full mt-2 rounded-xl overflow-hidden">
                  <iframe
                    src="https://maps.google.com/maps?q=東京都渋谷区道玄坂1丁目10番8号+渋谷道玄坂東急ビル&z=16&output=embed&hl=ja"
                    width="100%" height="220"
                    style={{ border: 0 }} allowFullScreen loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="S&S合同会社 地図"
                  />
                </div>
              ),
            },
            { label: '資本金', value: <span>1,000,000円</span> },
            { label: '取引銀行', value: <span>三井住友銀行</span> },
            { label: '従業員数', value: <span>10名（業務委託含む）</span> },
            {
              label: '事業内容',
              value: (
                <ul className="space-y-1">
                  <li>CRMのコンサルティング・構築・保守運用</li>
                  <li>クラウドサービスの導入支援・運用</li>
                  <li>ITシステム・ソフトウェアの企画・開発・販売</li>
                  <li>DX推進・経営コンサルティング</li>
                  <li>人材育成・研修・セミナーの企画・運営</li>
                </ul>
              ),
            },
          ].map((row, i, arr) => (
            <FadeUp key={i} delay={i * 0.05}>
              <div className={`flex gap-6 p-6 md:p-8 items-start ${i < arr.length - 1 ? 'border-b border-[#3a4a1d]/8' : ''}`}>
                <div className="w-px self-stretch bg-[#a8d878]/40 shrink-0 ml-1" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-[#3a4a1d] tracking-[0.25em] uppercase mb-2">{row.label}</p>
                  <div className="text-base text-[#333] leading-relaxed">{row.value}</div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  </motion.div>
);

// ---- Service ----
const Service = () => {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">

      {/* Hero */}
      <div className="py-28 md:py-40 bg-[#f9f9f3] border-b border-[#3a4a1d]/10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="text-[#3a4a1d] font-bold tracking-[0.2em] text-xs uppercase mb-6 block">Our Service</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-[#192c0d] leading-tight mb-8">CRM{' '}<br className="hidden sm:block" />Consulting</motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-[#666] text-base md:text-lg max-w-2xl leading-loose">
            Salesforce・HubSpot・Kintoneなど、主要CRMの導入から活用・保守運用まで。貴社のフェーズに合わせた柔軟なサポートを提供します。
          </motion.p>
        </div>
      </div>

      {/* Supported CRM */}
      <section className="py-20 bg-white border-b border-[#3a4a1d]/8">
        <div className="max-w-7xl mx-auto px-6">
          <FadeUp className="mb-12">
            <span className="text-[#3a4a1d] font-bold tracking-[0.2em] text-xs uppercase mb-4 block">Supported Platforms</span>
            <h3 className="text-3xl font-serif text-[#192c0d]">対応CRM・プラットフォーム</h3>
          </FadeUp>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                name: 'Salesforce',
                desc: 'Sales Cloud / Service Cloud / Marketing Cloud / Experience Cloud / Agentforce など全製品に対応',
              },
              {
                name: 'HubSpot',
                desc: 'Marketing Hub / Sales Hub / Service Hub の導入・設定・運用をサポート',
              },
              {
                name: 'Kintone',
                desc: 'kintone を活用した業務アプリ開発・CRM構築・外部システム連携',
              },
              {
                name: 'Claude Code開発',
                desc: 'Claude Codeを活用したカスタムCRMシステムの設計・開発も請け負います',
              },
            ].map((p, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <motion.div whileHover={{ y: -4 }}
                  className="bg-[#f9f9f3] rounded-2xl p-8 h-full border border-[#3a4a1d]/8 hover:shadow-lg transition-all duration-300">
                  <h4 className="font-serif font-bold text-[#192c0d] text-lg mb-3">{p.name}</h4>
                  <div className="w-6 h-0.5 bg-[#3a4a1d] opacity-30 mb-4" />
                  <p className="text-sm text-[#666] leading-relaxed">{p.desc}</p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Service Detail */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-20">
          {[
            {
              num: '01', title: 'CRM導入・構築', en: 'CRM Implementation',
              illust: <IllustImplement />,
              points: ['Salesforce設計・構築・カスタマイズ', 'HubSpot / Kintone の導入・設定', 'データ移行・外部システム連携', 'アジャイルな反復開発'],
              desc: 'Salesforce認定資格を持つ元SEが直接担当。要件定義から実装・テスト・リリースまで、貴社の業務プロセスに完全フィットしたCRM環境を構築します。',
            },
            {
              num: '02', title: 'CRM保守・運用サポート', en: 'Operations & Support',
              illust: <IllustOps />,
              points: ['導入後の定着化・ユーザー研修', '継続的な機能改善・追加開発', 'システム監視・障害対応', '月次レポートと改善提案'],
              desc: '「システムを入れたら終わり」ではなく、使い続けられる体制を一緒に作ります。定着化支援から継続改善まで、長期パートナーとして伴走します。',
            },
            {
              num: '03', title: 'CRMの活用コンサルティング', en: 'CRM Consulting',
              illust: <IllustConsult />,
              points: ['CRMデータの活用戦略策定', 'MA・AIツールとのシステム連携', 'KPI設計・レポーティング体制の構築', 'CRM活用研修・社内展開サポート'],
              desc: '導入したCRMを真に活用するための戦略設計から支援します。データドリブンな営業・マーケティングの実現に向け、AI・MAツール連携も含めてサポートします。',
            },
          ].map((s, i) => (
            <FadeUp key={i}>
              <div className={`grid md:grid-cols-2 gap-16 items-center ${i % 2 === 1 ? 'md:grid-flow-dense' : ''}`}>
                <div className={i % 2 === 1 ? 'md:col-start-2' : ''}>
                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-6xl font-serif font-black text-[#3a4a1d]/10 leading-none">{s.num}</span>
                    <div className="w-8 h-0.5 bg-[#a8d878] rounded-full" />
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-[#192c0d] mb-2">{s.title}</h3>
                  <p className="text-xs text-[#aaa] tracking-[0.25em] uppercase mb-6">{s.en}</p>
                  <p className="text-[#555] leading-loose mb-8">{s.desc}</p>
                  <ul className="space-y-3">
                    {s.points.map((p, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-[#444]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#a8d878] shrink-0 mt-2" />{p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`bg-gradient-to-br from-[#eef6e6] to-[#f5faf2] rounded-3xl overflow-hidden min-h-72 flex items-center justify-center p-8 ${i % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}`}>
                  <div className="w-full h-64">
                    {s.illust}
                  </div>
                </div>
              </div>
              {i < 2 && <div className="border-t border-[#3a4a1d]/8 mt-20" />}
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section className="py-28 bg-[#192c0d] relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none">
          <defs><pattern id="dots3" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="#f9f9f3" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#dots3)" />
        </svg>
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <FadeUp className="text-center mb-20">
            <span className="text-[#a8d878] font-bold tracking-[0.2em] text-xs uppercase mb-4 block">Workflow</span>
            <h2 className="text-4xl md:text-5xl font-serif text-[#f9f9f3]">進め方</h2>
          </FadeUp>
          <div className="space-y-0">
            {[
              { step: 'STEP 01', title: 'ヒアリング・現状把握', desc: '貴社の課題・目標・現状のシステム環境を丁寧にヒアリング。まずはご相談から。' },
              { step: 'STEP 02', title: '戦略・提案', desc: '課題を整理し、最適なCRMと実装アプローチを選定。実現可能なロードマップをご提案します。' },
              { step: 'STEP 03', title: '設計・実装', desc: '承認いただいた要件をもとに設計・開発。アジャイルに進め、途中の変化にも柔軟に対応します。' },
              { step: 'STEP 04', title: '定着化・運用支援', desc: 'リリース後の研修・定着化支援から継続的な改善提案まで、長期的にサポートします。' },
            ].map((s, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className={`flex gap-8 items-start py-10 ${i < 3 ? 'border-b border-[#f9f9f3]/8' : ''}`}>
                  <div className="shrink-0 w-24 pt-1">
                    <span className="text-[#a8d878] text-xs font-bold tracking-widest">{s.step}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-[#f9f9f3] mb-3">{s.title}</h3>
                    <p className="text-[#f9f9f3]/55 leading-loose text-sm">{s.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us (shared) */}
      <WhyChooseUs />

      {/* FAQ */}
      <section className="py-28 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <FadeUp className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-[#192c0d]">よくあるご質問</h2>
          </FadeUp>
          <div className="space-y-4">
            {[
              { q: 'プロジェクトの期間はどのくらいですか？', a: '規模によりますが、最短1ヶ月から対応可能です。大規模プロジェクトはチームを組んで長期的なサポートも承ります。' },
              { q: 'Salesforce以外のCRMにも対応していますか？', a: 'はい。HubSpot・Kintone・その他クラウドCRMにも対応しています。また、Claude Codeを活用したカスタムCRM開発も承ります。' },
              { q: 'AI活用についても相談できますか？', a: 'はい。SalesforceのAgentforceや生成AIを活用したCRM連携・業務効率化の支援も行っています。' },
              { q: '保守・運用サポートのみの依頼も可能ですか？', a: 'はい、可能です。既存システムの改修や定着化支援のみのプラン、スポット対応も歓迎しております。' },
              { q: '料金はどのように決まりますか？', a: 'プロジェクトの規模・期間・内容によって異なります。まずはお気軽にご相談ください。最適なプランをご提案します。' },
            ].map((faq, i) => (
              <FadeUp key={i} delay={i * 0.05}>
                <div className="bg-[#f9f9f3] p-7 rounded-2xl border border-[#3a4a1d]/8 hover:border-[#3a4a1d]/20 transition-colors">
                  <div className="flex gap-4 items-start mb-3">
                    <HelpCircle size={18} className="text-[#3a4a1d] shrink-0 mt-0.5" />
                    <h4 className="font-bold text-[#192c0d] text-sm">{faq.q}</h4>
                  </div>
                  <p className="pl-[26px] text-[#666] text-sm leading-relaxed">{faq.a}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#192c0d]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-serif text-[#f9f9f3] mb-6">まずはお気軽にご相談ください</h2>
            <p className="text-[#f9f9f3]/55 mb-10 leading-loose">初回相談無料。お問い合わせから2営業日以内にご連絡いたします。</p>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/contact')}
              className="bg-[#f9f9f3] text-[#192c0d] px-10 py-4 rounded-full font-bold hover:bg-white transition-all inline-flex items-center gap-3">
              お問い合わせ <ArrowRight size={16} />
            </motion.button>
          </FadeUp>
        </div>
      </section>
    </motion.div>
  );
};

// ---- Contact ----
const Contact = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const prefill = (location.state as { description?: string } | null)?.description ?? '';
  const [formData, setFormData] = useState({
    lastname: '', firstname: '', company: '', email: '', phone: '', description: prefill
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [retURL, setRetURL] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Ensure Salesforce retURL points to our /thanks page and render reCAPTCHA when available
    const origin = window.location.origin;
    setRetURL(`${origin}/thanks`);
    const retEl = document.querySelector('input[name="retURL"]') as HTMLInputElement | null;
    if (retEl) retEl.value = `${origin}/thanks`;

    // Try to render grecaptcha if it's loaded; if not, poll until available (max ~10s)
    const tryRender = () => {
      const w: any = window as any;
      const container = document.getElementById('recaptcha-container');
      if (w.grecaptcha && container && (container.childElementCount === 0)) {
        try {
          // Use Google's test key on localhost to avoid "invalid key type" errors during development.
          const PROD_SITEKEY = (import.meta as any).env?.VITE_RECAPTCHA_SITEKEY || '6LfJBsQsAAAAAGZJ-pys1KU6EtQWIwS90j090749';
          const DEV_TEST_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
          const host = window.location.hostname || '';
          const sitekey = (host.includes('localhost') || host === '127.0.0.1') ? DEV_TEST_KEY : PROD_SITEKEY;
          w.grecaptcha.render(container, { sitekey });
        } catch (err) {
          // ignore render errors
        }
        return true;
      }
      return false;
    };

    let attempts = 0;
    const interval = setInterval(() => {
      attempts += 1;
      if (tryRender() || attempts > 50) clearInterval(interval);
    }, 200);
    tryRender();
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const iframe = document.createElement('iframe');
    iframe.name = 'hidden_iframe';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://script.google.com/macros/s/AKfycbw1Us_NobvOU50BBvYsjI9eCucHxOqC3PICOU6rD9G-p2-ktS06wE4XySbsJKHvzqnj/exec';
    form.target = 'hidden_iframe';

    ['lastname', 'firstname', 'company', 'email', 'phone', 'description'].forEach(field => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = field;
      input.value = formData[field as keyof typeof formData];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();

    setTimeout(() => {
      document.body.removeChild(form);
      document.body.removeChild(iframe);
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ lastname: '', firstname: '', company: '', email: '', phone: '', description: '' });
    }, 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
      <div className="py-28 md:py-40 bg-[#f9f9f3] border-b border-[#3a4a1d]/10">
        <div className="max-w-4xl mx-auto px-6">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-[#3a4a1d] font-bold tracking-[0.2em] text-xs uppercase mb-6 block">Get in Touch</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#192c0d] mb-8 leading-tight">お問い合わせ</motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-[#666] leading-loose text-base md:text-lg">
            CRM導入・DX推進に関するご相談は下記フォームより。初回相談無料・通常2営業日以内にご連絡いたします
          </motion.p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20">
        {submitStatus === 'success' ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-[#f0f5eb] p-16 rounded-3xl border border-[#3a4a1d]/20 text-center">
            <div className="w-16 h-16 rounded-full bg-[#192c0d] flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-8 h-8 text-[#a8d878]" />
            </div>
            <h3 className="text-2xl font-serif text-[#192c0d] mb-4">お問い合わせありがとうございます</h3>
            <p className="text-[#555] leading-relaxed mb-2">内容を確認のうえ、2営業日以内にご連絡いたします。</p>
            <button onClick={() => setSubmitStatus('idle')}
              className="mt-8 text-[#3a4a1d] font-bold underline underline-offset-4 hover:opacity-70 transition-opacity text-sm">
              新しいお問い合わせ
            </button>
          </motion.div>
        ) : (
          <form
            action="https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8&orgId=00Dd500000Fup0n"
            method="POST"
            target="hidden_iframe"
            onSubmit={() => { setSubmitted(true); setIsSubmitting(true); }}
            className={`bg-white p-10 md:p-16 rounded-3xl shadow-xl border space-y-8 ${submitStatus === 'error' ? 'border-red-300' : 'border-[#3a4a1d]/8'}`}>
            <input type="hidden" name="captcha_settings" value='{"keyname":"reCAPTCHA","fallback":"true","orgId":"00Dd500000Fup0n","ts":""}' />
            <input type="hidden" name="oid" value="00Dd500000Fup0n" />
            <input type="hidden" name="retURL" value={retURL} />

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="last_name" className="block text-xs font-bold text-[#192c0d] mb-3 tracking-wider uppercase">姓 <span className="text-[#3a4a1d]">*</span></label>
                <input id="last_name" name="last_name" type="text" required className="w-full bg-[#f9f9f3] border-b-2 border-[#3a4a1d]/20 rounded-t-lg p-4 focus:outline-none focus:border-[#3a4a1d] transition-colors text-sm" />
              </div>
              <div>
                <label htmlFor="first_name" className="block text-xs font-bold text-[#192c0d] mb-3 tracking-wider uppercase">名 <span className="text-[#3a4a1d]">*</span></label>
                <input id="first_name" name="first_name" type="text" required className="w-full bg-[#f9f9f3] border-b-2 border-[#3a4a1d]/20 rounded-t-lg p-4 focus:outline-none focus:border-[#3a4a1d] transition-colors text-sm" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="company" className="block text-xs font-bold text-[#192c0d] mb-3 tracking-wider uppercase">会社名</label>
                <input id="company" name="company" type="text" className="w-full bg-[#f9f9f3] border-b-2 border-[#3a4a1d]/20 rounded-t-lg p-4 focus:outline-none focus:border-[#3a4a1d] transition-colors text-sm" />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-[#192c0d] mb-3 tracking-wider uppercase">メールアドレス <span className="text-[#3a4a1d]">*</span></label>
                <input id="email" name="email" type="email" required className="w-full bg-[#f9f9f3] border-b-2 border-[#3a4a1d]/20 rounded-t-lg p-4 focus:outline-none focus:border-[#3a4a1d] transition-colors text-sm" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="city" className="block text-xs font-bold text-[#192c0d] mb-3 tracking-wider uppercase">市区郡</label>
                <input id="city" name="city" type="text" className="w-full bg-[#f9f9f3] border-b-2 border-[#3a4a1d]/20 rounded-t-lg p-4 focus:outline-none focus:border-[#3a4a1d] transition-colors text-sm" />
              </div>
              <div>
                <label htmlFor="state" className="block text-xs font-bold text-[#192c0d] mb-3 tracking-wider uppercase">都道府県</label>
                <input id="state" name="state" type="text" className="w-full bg-[#f9f9f3] border-b-2 border-[#3a4a1d]/20 rounded-t-lg p-4 focus:outline-none focus:border-[#3a4a1d] transition-colors text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#192c0d] mb-3 tracking-wider uppercase">お問い合わせ内容</label>
              <textarea name="description" rows={6} placeholder="ご相談内容をご記入ください" className="w-full bg-[#f9f9f3] border-b-2 border-[#3a4a1d]/20 rounded-t-lg p-4 focus:outline-none focus:border-[#3a4a1d] transition-colors resize-none text-sm" />
            </div>

            <div className="text-center">
              <div id="recaptcha-container" className="inline-block mb-6" />
              <div>
                <button type="submit" className="w-full md:w-auto bg-[#192c0d] text-[#f9f9f3] px-16 py-5 rounded-full font-bold tracking-widest hover:bg-[#1e3610] transition-all shadow-lg disabled:opacity-50 text-sm">{isSubmitting ? '送信中...' : '送信する'}</button>
              </div>
            </div>
            <iframe name="hidden_iframe" id="hidden_iframe" style={{ display: 'none' }} onLoad={() => {
              if (submitted) {
                // navigate to thanks after iframe loads response from Salesforce
                navigate('/thanks');
                setSubmitted(false);
                setIsSubmitting(false);
              }
            }} />
          </form>
        )}
      </div>
    </motion.div>
  );
};

  // ---- Thanks ----
  const Thanks = () => {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full py-28 md:py-40">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-[#f0f5eb] p-16 rounded-3xl border border-[#3a4a1d]/20 text-center">
            <div className="w-16 h-16 rounded-full bg-[#192c0d] flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-8 h-8 text-[#a8d878]" />
            </div>
            <h3 className="text-2xl font-serif text-[#192c0d] mb-4">送信が完了しました</h3>
            <p className="text-[#555] leading-relaxed mb-2">お問い合わせありがとうございます。内容を確認のうえ、2営業日以内にご連絡いたします。</p>
            <div className="mt-8">
              <Link to="/" className="text-[#3a4a1d] font-bold underline underline-offset-4 hover:opacity-70 transition-opacity text-sm">トップに戻る</Link>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

// ---- App Inner (uses Router hooks) ----
const AppInner = ({ loading, setLoading }: { loading: boolean; setLoading: (v: boolean) => void }) => {
  const location = useLocation();

  useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'S＆S合同会社 | CRMコンサルティング・構築・保守運用',
      '/about': '会社について | S＆S合同会社',
      '/service': 'サービス | S＆S合同会社 - CRM導入・構築・保守',
      '/contact': 'お問い合わせ | S＆S合同会社',
      '/thanks': 'お問い合わせありがとうございました | S＆S合同会社',
    };
    document.title = titles[location.pathname] || 'S＆S合同会社';
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className={`min-h-screen font-sans text-[#333] selection:bg-[#3a4a1d] selection:text-[#f9f9f3] ${location.pathname === '/' ? 'bg-[#192c0d]' : 'bg-[#f9f9f3]'}`}>
      <AnimatePresence>
        {loading && <SplashScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          <Navbar />
          <main className="min-h-screen">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/service" element={<Service />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/thanks" element={<Thanks />} />
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
          <ChatBot />
        </motion.div>
      )}
    </div>
  );
};

// ---- App ----
export default function App() {
  const [loading, setLoading] = useState(true);
  return (
    <BrowserRouter>
      <AppInner loading={loading} setLoading={setLoading} />
    </BrowserRouter>
  );
}
