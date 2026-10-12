import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom';
import AgentforceChat from './AgentforceChat';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  ArrowRight, Menu, X,
  Users, Layers, CheckCircle,
  Database, HelpCircle, Zap,
  Target, Instagram, Globe
} from 'lucide-react';

// ============================================================
//  i18n — language context + helper
// ============================================================
type Lang = 'ja' | 'en';

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'ja',
  setLang: () => {},
});

const useLang = () => {
  const { lang, setLang } = useContext(LangContext);
  // t('日本語', 'English') -> returns the string for the current language
  const t = (ja: string, en: string) => (lang === 'en' ? en : ja);
  return { lang, setLang, t };
};

const LangProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'ja';
    const saved = window.localStorage.getItem('ss-lang');
    return saved === 'en' || saved === 'ja' ? saved : 'ja';
  });
  const setLang = (l: Lang) => {
    setLangState(l);
    try { window.localStorage.setItem('ss-lang', l); } catch { /* ignore */ }
    try { document.documentElement.lang = l; } catch { /* ignore */ }
  };
  useEffect(() => { try { document.documentElement.lang = lang; } catch { /* ignore */ } }, [lang]);
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
};

// ---- Language Toggle (segmented JA / EN) ----
const LangToggle = ({ dark = false }: { dark?: boolean }) => {
  const { lang, setLang } = useLang();
  const base = 'relative z-10 px-2.5 py-1 text-xs font-bold tracking-wider rounded-full transition-colors duration-300';
  return (
    <div className={`relative inline-flex items-center rounded-full p-0.5 border ${
      dark ? 'border-white/25 bg-white/5' : 'border-[#3a4a1d]/15 bg-[#3a4a1d]/5'
    }`}>
      <Globe size={13} className={`ml-1.5 mr-0.5 ${dark ? 'text-white/70' : 'text-[#3a4a1d]/70'}`} />
      {(['ja', 'en'] as Lang[]).map((l) => {
        const active = lang === l;
        return (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`${base} ${
              active
                ? dark ? 'text-[#192c0d]' : 'text-[#f9f9f3]'
                : dark ? 'text-white/70 hover:text-white' : 'text-[#3a4a1d]/70 hover:text-[#192c0d]'
            }`}
            aria-pressed={active}
          >
            {active && (
              <motion.span
                layoutId={`langpill-${dark ? 'd' : 'l'}`}
                className={`absolute inset-0 -z-10 rounded-full ${dark ? 'bg-white' : 'bg-[#3a4a1d]'}`}
              />
            )}
            {l === 'ja' ? 'JA' : 'EN'}
          </button>
        );
      })}
    </div>
  );
};

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
  const { t } = useLang();
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
    { path: '/', label: t('ホーム', 'Home') },
    { path: '/about', label: t('会社について', 'About') },
    { path: '/service', label: t('サービス', 'Service') },
    { path: '/contact', label: t('お問い合わせ', 'Contact') },
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
            <LangToggle dark={isDark} />
          </div>

          <div className="md:hidden flex items-center gap-3">
            <LangToggle dark={isDark} />
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
// 見出し下の罫線：画面に入ったら左右（左寄せなら左から）に線が伸びる
const HeadingRule = ({ align = 'center', light = false }: { align?: 'center' | 'left'; light?: boolean }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const base = light ? 'bg-[#f9f9f3]/15' : 'bg-[#3a4a1d]/12';
  const bar = light ? 'bg-[#a8d878]' : 'bg-[#3a4a1d]';
  return (
    <div ref={ref} className={`relative h-px w-40 sm:w-56 ${base} ${align === 'center' ? 'mx-auto' : ''}`}>
      <motion.div
        className={`absolute inset-y-0 left-0 w-full ${bar}`}
        style={{ originX: align === 'center' ? 0.5 : 0 }}
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
};

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

// ============================================================
//  Salesforce-style blue cloud illustrations (Why Choose Us)
// ============================================================
const SF_BLUE = '#00A1E0';

// A reusable Salesforce-ish cloud built from overlapping rounded blobs
const SfCloud = ({ x = 0, y = 0, scale = 1, opacity = 1 }: { x?: number; y?: number; scale?: number; opacity?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
    <circle cx="22" cy="30" r="18" fill={SF_BLUE} />
    <circle cx="44" cy="18" r="24" fill={SF_BLUE} />
    <circle cx="72" cy="26" r="19" fill={SF_BLUE} />
    <circle cx="58" cy="40" r="20" fill={SF_BLUE} />
    <rect x="20" y="30" width="56" height="20" rx="10" fill={SF_BLUE} />
  </g>
);

// Card 02 — team network of clouds / people
const IllustTeam = () => (
  <svg viewBox="0 0 300 180" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    {/* connection lines */}
    <line x1="150" y1="90" x2="62" y2="48" stroke={SF_BLUE} strokeOpacity="0.32" strokeWidth="1.6" strokeDasharray="4,4" />
    <line x1="150" y1="90" x2="238" y2="48" stroke={SF_BLUE} strokeOpacity="0.32" strokeWidth="1.6" strokeDasharray="4,4" />
    <line x1="150" y1="90" x2="60" y2="138" stroke={SF_BLUE} strokeOpacity="0.32" strokeWidth="1.6" strokeDasharray="4,4" />
    <line x1="150" y1="90" x2="240" y2="138" stroke={SF_BLUE} strokeOpacity="0.32" strokeWidth="1.6" strokeDasharray="4,4" />
    {/* center cloud hub */}
    <g transform="translate(112 56) scale(0.85)">
      <circle cx="22" cy="30" r="18" fill={SF_BLUE} />
      <circle cx="44" cy="18" r="24" fill={SF_BLUE} />
      <circle cx="72" cy="26" r="19" fill={SF_BLUE} />
      <circle cx="58" cy="40" r="20" fill={SF_BLUE} />
      <rect x="20" y="30" width="56" height="20" rx="10" fill={SF_BLUE} />
    </g>
    {/* center person mark — centered within the cloud body */}
    <circle cx="150" cy="73" r="8" fill="white" />
    <path d="M137 92 a13 11 0 0 1 26 0 z" fill="white" />
    {/* satellite member nodes */}
    {[[62, 48], [238, 48], [60, 138], [240, 138]].map(([cx, cy], i) => (
      <g key={i}>
        <circle cx={cx} cy={cy} r="20" fill={SF_BLUE} fillOpacity="0.16" />
        <circle cx={cx} cy={cy} r="16" fill={SF_BLUE} fillOpacity="0.85" />
        <circle cx={cx} cy={cy - 3} r="4.5" fill="white" />
        <path d={`M${cx - 8} ${cy + 9} a8 7 0 0 1 16 0 z`} fill="white" />
      </g>
    ))}
  </svg>
);

// Card 03 — implementation → adoption → improvement lifecycle (blue)
const IllustSupport = () => {
  const { t } = useLang();
  return (
    <svg viewBox="0 0 300 180" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sf_sup" x1="40" y1="0" x2="270" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={SF_BLUE} stopOpacity="0.35" />
          <stop offset="100%" stopColor={SF_BLUE} stopOpacity="0.9" />
        </linearGradient>
      </defs>
      {/* small cloud top-left */}
      <SfCloud x={20} y={14} scale={0.5} opacity={0.9} />
      {/* baseline */}
      <line x1="40" y1="150" x2="270" y2="150" stroke={SF_BLUE} strokeOpacity="0.12" strokeWidth="1" />
      {/* growth path */}
      <path d="M52 138 C100 138 120 96 150 80 C182 63 214 70 258 40" stroke="url(#sf_sup)" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* stage markers */}
      {[
        [52, 138, 0.35, t('導入', 'Build')],
        [150, 80, 0.6, t('定着', 'Adopt')],
        [258, 40, 0.95, t('改善', 'Improve')],
      ].map(([cx, cy, op, label], i) => (
        <g key={i}>
          <circle cx={cx as number} cy={cy as number} r="20" fill="white" stroke={SF_BLUE} strokeOpacity={(op as number) * 0.5} strokeWidth="1.5" />
          <circle cx={cx as number} cy={cy as number} r="10" fill={SF_BLUE} fillOpacity={op as number} />
          <text x={cx as number} y={(cy as number) + 35} textAnchor="middle" fontSize="11" fill={SF_BLUE} fillOpacity="0.85" fontWeight="700">{label as string}</text>
        </g>
      ))}
      {/* upward arrow tip */}
      <path d="M252 44 L260 30 L268 44" stroke={SF_BLUE} strokeWidth="2.5" strokeOpacity="0.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// ---- Shared: Why Choose Us ----
const WhyChooseUs = () => {
  const { t } = useLang();
  const items = [
    {
      type: 'image' as const,
      label: '01',
      title: t('Salesforce認定資格者が直接担当', 'Certified Salesforce experts on your project'),
      desc: t(
        '代表は元Salesforce JapanのSEとして多数のCRM導入プロジェクトを経験。Salesforce認定資格保有者が貴社の案件に直接参画します。',
        'Our founder served as an SE at Salesforce Japan, leading many CRM implementation projects. Certified Salesforce professionals work directly on your engagement.'
      ),
    },
    {
      illust: <IllustTeam />,
      label: '02',
      title: t('エンジニア・SIer・構築パートナー出身のチーム', 'A team from engineering, SI, and Salesforce partner backgrounds'),
      desc: t(
        'エンジニア出身、SIer経験者、Salesforce構築パートナー出身のメンバーで構成。現場を知っているメンバーが、そのまま貴社の案件を担当します。',
        'Our members come from engineering, system-integration, and Salesforce build-partner backgrounds. Professionals who know the field support you in solving real challenges.'
      ),
    },
    {
      illust: <IllustSupport />,
      label: '03',
      title: t('導入から運用まで一貫サポート', 'End-to-end support from implementation to operation'),
      desc: t(
        '導入して終わりにせず、現場に定着して使われ続けるところまで一緒に進めます。',
        'We do not stop at go-live. We keep working with you until the system is part of everyday work.'
      ),
    },
  ];
  return (
    <section className="py-28 bg-[#f9f9f3] border-t border-[#3a4a1d]/8 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp className="mb-20">
          <p className="text-[#a8d878] font-black tracking-[0.35em] text-xs uppercase mb-5">Why S&S?</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[#192c0d] leading-tight mb-6">
            {t('S＆Sが選ばれる理由', 'Why Choose S&S')}
          </h2>
          <HeadingRule align="left" />
        </FadeUp>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <FadeUp key={i} delay={i * 0.12}>
              <div className="bg-white rounded-3xl overflow-hidden h-full group hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border border-[#3a4a1d]/5">
                <div className="h-48 bg-gradient-to-br from-[#e8f4fc] to-[#f5fafe] relative overflow-hidden flex items-center justify-center">
                  {item.type === 'image' ? (
                    <img
                      src="/images/salesforce-partner-Horizen.png"
                      alt="Salesforce Partner"
                      className="w-full h-full object-contain p-3"
                      onError={(e) => {
                        // Fall back to the bundled SVG badge if the PNG hasn't been added yet
                        const img = e.currentTarget;
                        if (!img.src.endsWith('.svg')) img.src = '/images/salesforce-partner.svg';
                      }}
                    />
                  ) : (
                    item.illust
                  )}
                  <span className="absolute top-4 right-5 text-[#192c0d]/10 font-serif font-black text-5xl leading-none select-none pointer-events-none">{item.label}</span>
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
};

// ---- Shared: Partners / Certifications ----
// 表記は各社の承認フォーマットに合わせる。
//  - OpenAI: "OpenAI Select Partner"（バッジ使用可）
//  - Claude Partner Network: 現在の階層ではバッジ・階層名の対外表記は不可 → プログラム名のみ文字で表記
type Badge = { png?: string; fallback?: string; alt: string; wordmark: string; label: string; bg: string };
const Partners = () => {
  const { t } = useLang();
  const badges: Badge[] = [
    {
      png: '/images/salesforce-partner-Horizen.png',
      fallback: '/images/salesforce-partner.svg',
      alt: 'Salesforce Partner',
      wordmark: 'Salesforce Partner',
      label: 'Salesforce Partner',
      bg: 'from-[#e8f4fc] to-[#f5fafe]',
    },
    {
      png: '/images/openai-select-partner.png',
      fallback: '/images/openai-select-partner.svg',
      alt: 'OpenAI Select Partner',
      wordmark: 'OpenAI Select Partner',
      label: 'OpenAI Select Partner',
      bg: 'from-[#ededed] to-[#fafafa]',
    },
    {
      alt: 'Claude Partner Network',
      wordmark: 'Claude Partner Network',
      label: 'Claude Partner Network',
      bg: 'from-[#f0ede6] to-[#faf8f4]',
    },
  ];
  const [broken, setBroken] = useState<Record<number, boolean>>({});
  return (
    <section className="py-28 bg-white border-t border-[#3a4a1d]/8 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp className="text-center mb-16">
          <p className="text-[#a8d878] font-black tracking-[0.35em] text-xs uppercase mb-5">Partners</p>
          <h2 className="text-4xl sm:text-5xl md:text-5xl font-serif font-bold text-[#192c0d] leading-tight mb-6">
            {t('パートナーシップ', 'Partnerships')}
          </h2>
          <HeadingRule />
        </FadeUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {badges.map((b, i) => (
            <FadeUp key={i} delay={i * 0.12}>
              <div className="bg-white rounded-3xl overflow-hidden h-full border border-[#3a4a1d]/8 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                <div className={`h-44 bg-gradient-to-br ${b.bg} flex items-center justify-center p-7`}>
                  {b.png && !broken[i] ? (
                    <img
                      src={b.png}
                      alt={b.alt}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (b.fallback && !img.src.endsWith('.svg')) img.src = b.fallback;
                        else setBroken((prev) => ({ ...prev, [i]: true }));
                      }}
                    />
                  ) : (
                    <p className="font-serif text-2xl font-bold text-[#192c0d] text-center leading-snug">{b.wordmark}</p>
                  )}
                </div>
                <div className="px-7 py-5 border-t border-[#3a4a1d]/5">
                  <p className="text-sm font-bold text-[#192c0d] text-center">{b.label}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp>
          <p className="text-[#555] leading-loose text-center max-w-2xl mx-auto text-base">
            {t(
              'パートナーとしてはまだ駆け出しです。Salesforce・OpenAI・Claude（Anthropic）のパートナープログラムに参加し、上位の階層を目指して学び続けています。そこで得たCRMとAIの知見を、貴社の現場ですぐ使える形にしてお届けします。',
              'We are still new as a partner. We take part in the partner programs of Salesforce, OpenAI, and Claude (Anthropic), and keep learning as we work toward higher tiers. What we learn about CRM and AI, we bring to your team in a form you can use right away.'
            )}
          </p>
        </FadeUp>
      </div>
    </section>
  );
};

// ---- Footer ----
const Footer = () => {
  const navigate = useNavigate();
  const { lang, t } = useLang();
  return (
    <footer className="bg-[#0f1f07] text-[#f9f9f3] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16 pb-12 border-b border-[#f9f9f3]/8">
          <div className="md:col-span-2 space-y-6">
            <div className="inline-block bg-[#f9f9f3] p-5 rounded-2xl">
              <BrandLogo size="small" />
            </div>
            <p className="text-sm leading-loose text-[#f9f9f3]/45 max-w-sm">
              {t(
                'CRMの導入・構築から保守運用まで、ひとつのチームで担当します。',
                'Through CRM implementation, development, and operational support, we solve your business challenges end to end.'
              )}
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-6 text-[#f9f9f3]/60 tracking-widest uppercase">Menu</h4>
            <div className="flex flex-col gap-3 text-sm text-[#f9f9f3]/45">
              {[
                { path: '/', label: t('ホーム', 'Home') },
                { path: '/about', label: t('会社について', 'About') },
                { path: '/service', label: t('サービス', 'Service') },
                { path: '/contact', label: t('お問い合わせ', 'Contact') },
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
              <p className="leading-relaxed">{lang === 'en'
                ? <>2F-C, Shibuya Dogenzaka Tokyu Bldg.<br />1-10-8 Dogenzaka, Shibuya-ku<br />Tokyo 150-0043, Japan</>
                : <>〒150-0043<br />東京都渋谷区道玄坂1丁目10番8号<br />渋谷道玄坂東急ビル2F−C</>}</p>
              <button
                onClick={() => navigate('/contact')}
                className="text-left underline hover:text-white hover:opacity-100 transition-all mt-2 text-xs"
              >
                {t('お問い合わせフォーム →', 'Contact form →')}
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
          <p>© {new Date().getFullYear()} {t('S＆S合同会社', 'S&S LLC')}. All Rights Reserved.</p>
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
  const { lang, t } = useLang();
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
            {lang === 'en' ? (
              <>Change how people work,<br />
              so everyone can work <span className="text-[#a8d878]">their own way</span></>
            ) : (
              <>働く環境を変えて、<br />
              <span className="inline-block">誰もが<span className="text-[#a8d878]">自分らしく</span></span><br />
              働ける毎日を</>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-base md:text-lg text-[#f9f9f3]/65 mb-12 max-w-2xl mx-auto leading-loose"
          >
            {t(
              'CRMの導入・構築から保守運用まで、S&Sがひとつのチームで担当します',
              'Centered on CRM implementation, development, and operational support, S&S LLC solves your business challenges end to end.'
            )}
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
              {t('サービスを見る', 'View Services')} <ArrowRight size={18} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/contact')}
              className="border border-[#f9f9f3]/30 text-[#f9f9f3] px-10 py-4 rounded-full font-bold text-base hover:border-[#f9f9f3]/60 hover:bg-[#f9f9f3]/5 transition-all inline-flex items-center justify-center gap-3"
            >
              {t('無料相談はこちら', 'Free Consultation')}
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
              {lang === 'en'
                ? <>Transform your <span className="text-[#3a4a1d]">Business</span> with CRM</>
                : <>CRMで<span className="text-[#3a4a1d]">ビジネスを</span>変える</>}
            </h2>
            <HeadingRule align="left" />
          </FadeUp>

          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#3a4a1d]/10 border border-[#3a4a1d]/10 rounded-3xl overflow-hidden">
            {[
              {
                num: '01', icon: <Database size={32} />,
                title: t('CRM導入・構築', 'CRM Implementation'),
                en: 'CRM Implementation',
                desc: t(
                  'SalesforceをはじめとするクラウドCRMを、貴社の業務の流れに合わせて設計・構築します。',
                  'We design and build cloud CRMs such as Salesforce around the way your business actually works.'
                ),
              },
              {
                num: '02', icon: <Layers size={32} />,
                title: t('CRM保守・運用サポート', 'Operations & Support'),
                en: 'Operations & Support',
                desc: t(
                  '導入後の定着支援から日々の改善まで、運用を続けてサポートします。',
                  'From adoption after launch to ongoing improvements, we keep supporting your operations.'
                ),
              },
              {
                num: '03', icon: <Target size={32} />,
                title: t('CRMの活用コンサルティング', 'CRM Consulting'),
                en: 'CRM Consulting',
                desc: t(
                  'CRMに貯まったデータの活かし方を考え、AIやMAツールとの連携まで支援します。',
                  'We help you put your CRM data to work, including integration with AI and MA tools.'
                ),
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
                  <span className="text-sm font-bold">{t('詳しく見る', 'Learn more')}</span>
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
                {lang === 'en' ? (
                  <>What is S&S<br />
                  <em className="not-italic text-[#3a4a1d]">A CRM-focused</em><br />
                  partner you can rely on</>
                ) : (
                  <>S＆Sとは<br />
                  <em className="not-italic text-[#3a4a1d]">CRM専門の</em><br />
                  頼れるパートナー</>
                )}
              </h2>
              <p className="text-[#555] leading-loose text-base md:text-lg mb-10">
                {t(
                  'S&Sは、CRM（Salesforce・HubSpot・Kintone等）の導入・構築・保守運用を専門とするコンサルティング会社です。元Salesforce Japan出身の代表を中心に、エンジニア・SIer・構築パートナー出身のメンバーが、戦略づくりから実装、定着まで担当します。',
                  'S&S LLC is a consulting firm specializing in the implementation, development, and operation of CRMs such as Salesforce, HubSpot, and Kintone. Led by a founder from Salesforce Japan, our members from engineering, SI, and build-partner backgrounds support you from strategy through implementation and adoption.'
                )}
              </p>
              <button
                onClick={() => navigate('/about')}
                className="group inline-flex items-center gap-3 text-[#3a4a1d] font-bold border-b-2 border-[#3a4a1d] pb-1 hover:gap-5 transition-all duration-300"
              >
                {t('会社について', 'About Us')}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </FadeUp>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Salesforce', desc: t('元Salesforce Japan出身の代表が対応', 'Led by a founder from Salesforce Japan'), icon: <Database size={22} /> },
                { label: 'Speed', desc: t('少数精鋭のスピード感ある実行力', 'A lean, fast-moving team that delivers'), icon: <Zap size={22} /> },
                { label: 'All-in-One', desc: t('導入から運用まで同じチームで', 'End to end, from rollout to operation'), icon: <CheckCircle size={22} /> },
                { label: 'Team', desc: t('SIer・パートナー出身の多彩なチーム', 'A diverse team from SI and partner backgrounds'), icon: <Users size={22} /> },
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

      {/* Partners / Certifications */}
      <Partners />

      {/* CTA Banner */}
      <section className="py-28 bg-[#192c0d] relative overflow-hidden">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full border border-[#f9f9f3]/5 pointer-events-none" />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full border border-[#a8d878]/10 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <FadeUp>
            <h2 className="text-3xl md:text-5xl font-serif text-[#f9f9f3] mb-6 leading-tight">
              {lang === 'en'
                ? <>For anything CRM,<br />start with a conversation</>
                : <>CRMのことなら<br />まずはご相談を</>}
            </h2>
            <p className="text-[#f9f9f3]/55 text-base md:text-lg mb-10 leading-loose">
              {t(
                '導入を検討中の方から、既存システムの改善をお考えの方まで。初回のご相談は無料で承っております。',
                'Whether you are planning a new rollout or improving an existing system, your first consultation is free.'
              )}
            </p>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/contact')}
              className="bg-[#f9f9f3] text-[#192c0d] px-12 py-5 rounded-full font-bold text-base hover:bg-white transition-all shadow-2xl inline-flex items-center gap-3"
            >
              {t('お問い合わせはこちら', 'Get in Touch')} <ArrowRight size={18} />
            </motion.button>
          </FadeUp>
        </div>
      </section>
    </motion.div>
  );
};

// ---- About ----
const About = () => {
  const { lang, t } = useLang();
  const values = lang === 'en'
    ? [
        { num: '1', title: 'Speed & Share', sub: 'Move fastest, share value', desc: 'Drop perfectionism and act at top speed; share knowledge and inspiration generously with everyone involved.' },
        { num: '2', title: 'Smart & Strong', sub: 'Clever strategy, unshakable resolve', desc: 'Hold a smart perspective (a hack) free of existing constraints, and the strength to see it through to the end.' },
        { num: '3', title: 'Smile & Synergy', sub: 'Smiles and synergy', desc: 'Meet others\' challenges with a smile and combine each other\'s strengths to create change and breathing room no one could alone.' },
      ]
    : [
        { num: '1', title: 'Speed & Share', sub: '最速の行動と、価値の共有', desc: '完璧主義を捨てて最速で動き、得た知識や感動は出し惜しみせずに関わる人とシェアする。' },
        { num: '2', title: 'Smart & Strong', sub: '賢い戦略と、ブレない強さ', desc: '既存の枠にとらわれない賢い視点（ハック）を持ち、それを最後まで実行しきる強さを持つ。' },
        { num: '3', title: 'Smile & Synergy', sub: '笑顔と相乗効果', desc: '相手の課題に笑顔で寄り添い、お互いの強みを掛け合わせることで、一人では生み出せない変化とゆとりを創り出す。' },
      ];

  const companyRows: { label: string; value: React.ReactNode }[] = [
    { label: t('会社名', 'Company name'), value: <span>{t('S＆S合同会社', 'S&S LLC')}</span> },
    { label: t('代表取締役', 'Representative'), value: <span>{t('境野 竣介', 'Shunsuke Sakaino')}</span> },
    {
      label: t('所在地', 'Address'),
      value: lang === 'en'
        ? <span>2F-C, Shibuya Dogenzaka Tokyu Bldg.<br />1-10-8 Dogenzaka, Shibuya-ku<br />Tokyo 150-0043, Japan</span>
        : <span>〒150-0043<br />東京都渋谷区道玄坂1丁目10番8号<br />渋谷道玄坂東急ビル2F−C</span>,
    },
    {
      label: t('アクセス', 'Map'),
      value: (
        <div className="w-full mt-2 rounded-xl overflow-hidden">
          <iframe
            src={`https://maps.google.com/maps?q=東京都渋谷区道玄坂1丁目10番8号+渋谷道玄坂東急ビル&z=16&output=embed&hl=${lang}`}
            width="100%" height="220"
            style={{ border: 0 }} allowFullScreen loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="S&S LLC map"
          />
        </div>
      ),
    },
    { label: t('資本金', 'Capital'), value: <span>{t('1,000,000円', '¥1,000,000')}</span> },
    { label: t('取引銀行', 'Bank'), value: <span>{t('三井住友銀行', 'Sumitomo Mitsui Banking Corporation')}</span> },
    { label: t('従業員数', 'Employees'), value: <span>{t('10名（業務委託含む）', '10 (including contractors)')}</span> },
    {
      label: t('事業内容', 'Business'),
      value: (
        <ul className="space-y-1">
          {(lang === 'en'
            ? ['CRM consulting, development, and operation', 'Cloud service implementation and operation', 'Planning, development, and sales of IT systems and software', 'DX promotion and management consulting', 'Training, workshops, and seminar planning and management']
            : ['CRMのコンサルティング・構築・保守運用', 'クラウドサービスの導入支援・運用', 'ITシステム・ソフトウェアの企画・開発・販売', 'DX推進・経営コンサルティング', '人材育成・研修・セミナーの企画・運営']
          ).map((li, i) => <li key={i}>{li}</li>)}
        </ul>
      ),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">

      {/* Page Header */}
      <div className="py-28 md:py-36 bg-[#f9f9f3] border-b border-[#3a4a1d]/10">
        <div className="max-w-4xl mx-auto px-6">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-[#3a4a1d] font-bold tracking-[0.2em] text-xs uppercase mb-6 block">About</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#192c0d] mb-8 leading-tight">{t('会社について', 'About')}</motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-[#666] text-base md:text-lg leading-loose max-w-2xl">
            {t(
              'S＆S合同会社のミッション・ストーリー・行動指針と会社概要をご紹介します。',
              'An introduction to the mission, story, guiding principles, and company profile of S&S LLC.'
            )}
          </motion.p>
        </div>
      </div>

      {/* Corporate Identity */}
      <section className="py-28 bg-[#f9f9f3]">
        <div className="max-w-4xl mx-auto px-6">
          <FadeUp className="text-center mb-20">
            <p className="text-[#a8d878] font-black tracking-[0.35em] text-xs uppercase mb-5">Corporate Identity</p>
            <h3 className="text-4xl sm:text-5xl md:text-5xl font-serif font-bold text-[#192c0d] leading-tight mb-6">{t('企業理念', 'Our Philosophy')}</h3>
            <HeadingRule />
          </FadeUp>

          {/* Mission */}
          <FadeUp>
            <div className="bg-[#192c0d] rounded-3xl p-10 md:p-14 text-center mb-16 relative overflow-hidden">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-20 -right-20 w-72 h-72 rounded-full border border-[#f9f9f3]/5 pointer-events-none" />
              <span className="text-[#a8d878] text-xs font-bold tracking-[0.3em] uppercase mb-6 block">Mission</span>
              <p className="text-[#f9f9f3] text-xl md:text-2xl font-serif leading-relaxed relative z-10">
                {lang === 'en' ? (
                  <>Bring change to how people work, so that everyone involved can work <span className="text-[#a8d878]">their own way</span>.</>
                ) : (
                  <><span className="inline-block">働く環境に</span><span className="inline-block">変化をもたらし</span><br />
                  <span className="inline-block">関わる人たちが</span><span className="inline-block text-[#a8d878]">自分らしく</span><span className="inline-block">働ける毎日をつくる</span></>
                )}
              </p>
            </div>
          </FadeUp>

          {/* Story */}
          <FadeUp>
            <div className="bg-white rounded-3xl p-10 md:p-14 mb-10 border border-[#3a4a1d]/8">
              <span className="text-[#3a4a1d] text-xs font-bold tracking-[0.3em] uppercase mb-6 block">{t('Story ／ 創業の背景', 'Story / Why we started')}</span>
              <div className="space-y-5 text-[#555] leading-[2] text-base">
                {(lang === 'en'
                  ? [
                      'I grew up in a rural area where graduating from high school or a vocational school and going straight to work was the norm. Thanks to my family\'s support, I went on to a university in Tokyo, and my world changed completely. Trying a new sport and meeting people with different values, I learned firsthand that when your environment changes, you change, and so do the people around you. That experience is still at the core of who I am.',
                      'As a working professional, while improving operations with Salesforce at the core, I saw again and again how much the way people work can change with the right use of technology. With AI, there is even more we can change.',
                      'I started this company because I wanted to change the environment people work in. Wherever you live, whatever your education or career, technology can help you work in your own way. Building that environment is where S&S LLC began.',
                    ]
                  : [
                      '地方出身で、高卒・専門卒で就職するのが当たり前の環境で育ちました。家族の支えもあり都内の大学へ進学したことで、世界は一変しました。新しいスポーツに挑戦し、いろいろな価値観の人と出会う中で、環境が変わると自分だけでなく周りの人まで変わっていくことを身をもって知りました。この経験が、今の自分の根っこにあります。',
                      '社会人になり、Salesforceを軸に業務効率化の現場に携わる中で、テクノロジーの使い方ひとつで人の働き方が大きく変わる場面を何度も見てきました。AIが加わった今、変えられることはさらに増えています。',
                      '働く環境を変えたい。そう思って起業しました。住んでいる場所や学歴、職歴に関係なく、テクノロジーを使って誰もが自分らしく働ける環境をつくる。それがS&S合同会社の原点です。',
                    ]
                ).map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>
          </FadeUp>

          {/* Values */}
          <FadeUp className="mb-4">
            <span className="text-[#3a4a1d] text-xs font-bold tracking-[0.3em] uppercase mb-8 block">{t('Value ／ 3つの行動指針', 'Value / Our 3 guiding principles')}</span>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-5">
            {values.map((v, i) => (
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
            <h3 className="text-4xl sm:text-5xl md:text-5xl font-serif font-bold text-[#192c0d] leading-tight mb-6">{t('会社概要', 'Company Profile')}</h3>
            <HeadingRule />
          </FadeUp>

          <div className="bg-[#f9f9f3] rounded-3xl overflow-hidden">
            {companyRows.map((row, i, arr) => (
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
};

// ---- Device frames for the Service page ----
const ServiceVideo = ({ src, poster, label, className = '' }: { src: string; poster: string; label: string; className?: string }) => (
  <video src={src} poster={poster} autoPlay muted loop playsInline preload="metadata" aria-label={label}
    className={`block w-full aspect-[16/10] object-cover ${className}`} />
);

const MacFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="px-[7%]">
    <div className="bg-[#26282b] rounded-t-[18px] rounded-b-[4px] p-3 pb-3.5 flex flex-col gap-2.5">
      <div aria-hidden="true" className="self-center w-[7px] h-[7px] rounded-full bg-[#4a4d52]" />
      <div className="bg-[#e9eae6] rounded-md overflow-hidden">
        <div aria-hidden="true" className="flex items-center gap-[7px] px-3 py-2">
          <span className="w-[11px] h-[11px] rounded-full bg-[#ee6a5f]" />
          <span className="w-[11px] h-[11px] rounded-full bg-[#f5bd4f]" />
          <span className="w-[11px] h-[11px] rounded-full bg-[#61c454]" />
        </div>
        {children}
      </div>
    </div>
    <div aria-hidden="true" className="-mx-[8%] h-4 rounded-b-[18px] bg-[#c5c8cc] flex justify-center">
      <div className="w-[16%] h-[7px] rounded-b-[10px] bg-[#9fa3a8]" />
    </div>
  </div>
);

const IPadFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-[#1c1c1e] rounded-[20px] md:rounded-[34px] p-2.5 md:p-[22px] shadow-[0_24px_60px_rgba(25,44,13,0.2)]">
    <div className="rounded-lg md:rounded-xl overflow-hidden">{children}</div>
  </div>
);

const PhoneFrame = ({ src, alt }: { src: string; alt: string }) => (
  <div className="mx-auto w-[230px] max-w-full bg-[#1c1c1e] rounded-[38px] p-[9px] shadow-[0_18px_40px_rgba(25,44,13,0.18)]">
    <img src={src} alt={alt} loading="lazy" className="block w-full aspect-[390/844] object-cover rounded-[30px]" />
  </div>
);

const WindowsFrame = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="flex flex-col items-center">
    <div className="w-full bg-[#111214] rounded-xl p-2.5 shadow-[0_24px_60px_rgba(25,44,13,0.2)]">
      <div className="bg-[#f3f3f3]">
        <div className="flex items-center justify-between min-h-[34px] pl-3 text-xs text-[#222]">
          <div className="flex items-center gap-2"><span aria-hidden="true" className="w-3.5 h-3.5 rounded-[3px] bg-[#245e4c]" />{title}</div>
          <div aria-hidden="true" className="flex items-stretch">
            <span className="w-[46px] min-h-[34px] flex items-center justify-center"><svg width="10" height="10" viewBox="0 0 10 10" stroke="#222" strokeWidth="1"><path d="M0 5h10" /></svg></span>
            <span className="w-[46px] min-h-[34px] flex items-center justify-center"><svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#222" strokeWidth="1"><rect x="0.5" y="0.5" width="9" height="9" /></svg></span>
            <span className="w-[46px] min-h-[34px] flex items-center justify-center"><svg width="10" height="10" viewBox="0 0 10 10" stroke="#222" strokeWidth="1"><path d="M0 0l10 10M10 0L0 10" /></svg></span>
          </div>
        </div>
        {children}
        <div aria-hidden="true" className="flex items-center justify-center gap-2.5 min-h-10 bg-[#e4ebf3]">
          <span className="w-[18px] h-[18px] rounded bg-[#3b82c4]" />
          <span className="w-[18px] h-[18px] rounded bg-[#c9d3de]" />
          <span className="w-[18px] h-[18px] rounded bg-[#c9d3de]" />
          <span className="w-[18px] h-[18px] rounded bg-[#245e4c]" />
          <span className="w-[18px] h-[18px] rounded bg-[#c9d3de]" />
        </div>
      </div>
    </div>
    <div aria-hidden="true" className="w-[12%] h-11 bg-[#9a9da1]" />
    <div aria-hidden="true" className="w-[30%] h-3 rounded-t-lg rounded-b-sm bg-[#b9bcc0]" />
  </div>
);

// ---- Service ----
const Service = () => {
  const navigate = useNavigate();
  const { lang, t } = useLang();

  const platforms = lang === 'en'
    ? [
        { name: 'Salesforce', desc: 'Full product coverage: Sales Cloud / Service Cloud / Marketing Cloud / Experience Cloud / Agentforce and more.' },
        { name: 'HubSpot', desc: 'Support for Marketing Hub / Sales Hub / Service Hub: implementation, setup, and operation.' },
        { name: 'Kintone', desc: 'Business-app development, CRM building, and external-system integration with kintone.' },
        { name: 'Claude Code Dev', desc: 'We also design and build custom CRM systems using Claude Code.' },
      ]
    : [
        { name: 'Salesforce', desc: 'Sales Cloud / Service Cloud / Marketing Cloud / Experience Cloud / Agentforce など全製品に対応' },
        { name: 'HubSpot', desc: 'Marketing Hub / Sales Hub / Service Hub の導入・設定・運用をサポート' },
        { name: 'Kintone', desc: 'kintone を活用した業務アプリ開発・CRM構築・外部システム連携' },
        { name: 'Claude Code開発', desc: 'Claude Codeを活用したカスタムCRMシステムの設計・開発も請け負います' },
      ];

  const steps = lang === 'en'
    ? [
        { step: 'STEP 01', img: '/images/service/step-lesson.jpg', alt: 'Lesson screen on a phone, with an explainer video', title: 'Learn with video', desc: 'Each lesson combines a video, a short explanation, and questions.' },
        { step: 'STEP 02', img: '/images/service/step-lab.jpg', alt: 'Practice lab screen on a phone, with Mebu guiding the steps', title: 'Try it on real AI', desc: 'In the practice lab, learners open ChatGPT, Claude, or Gemini and work hands-on.' },
        { step: 'STEP 03', img: '/images/service/step-check.jpg', alt: 'Final check screen on a phone', title: 'Check at the end', desc: 'Answer the check questions to finish the session. Retry as many times as you like.' },
      ]
    : [
        { step: 'STEP 01', img: '/images/service/step-lesson.jpg', alt: 'スマホで開いたレッスンの画面。解説動画が並ぶ', title: '動画で学ぶ', desc: 'レッスンは、|動画と説明と問題の|組み合わせ。' },
        { step: 'STEP 02', img: '/images/service/step-lab.jpg', alt: 'スマホで開いた実践ラボの画面。メブが進め方を案内している', title: '本物のAIで試す', desc: '実践ラボで、|ChatGPT、Claude、Geminiを|実際に開いて進めます。' },
        { step: 'STEP 03', img: '/images/service/step-check.jpg', alt: 'スマホで開いたさいごの確認の画面', title: 'さいごに確かめる', desc: '確認問題に答えて、|セッションを終えます。|何度でも挑戦できます。' },
      ];

  const cases = lang === 'en'
    ? [
        { tag: 'Staffing industry', title: 'Migration to PORTERS, initial setup, and matching-flow design' },
        { tag: 'B2C industry', title: 'Marketing-system implementation and data cleanup' },
        { tag: 'Enterprise', title: 'Agentforce adoption support and Claude consulting' },
      ]
    : [
        { tag: '人材業界', title: 'PORTERSへの移行と初期設定、|マッチングフローの作成' },
        { tag: 'toC業界', title: 'マーケティングシステムの|導入とデータ整理' },
        { tag: 'エンタープライズ企業', title: 'Agentforceの活用支援と|Claudeのコンサルティング' },
      ];

  // Break Japanese copy only between phrases: '|' marks the allowed break points
  const ph = (text: string) => text.includes('|')
    ? text.split('|').map((seg, i) => <span key={i} className="inline-block">{seg}</span>)
    : text;

  const scrollToId = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const workflow = lang === 'en'
    ? [
        { step: 'STEP 01', title: 'Hearing & assessment', desc: 'We carefully listen to your challenges, goals, and current system environment. It all starts with a conversation.' },
        { step: 'STEP 02', title: 'Strategy & proposal', desc: 'We organize the challenges, select the best CRM and implementation approach, and propose a realistic roadmap.' },
        { step: 'STEP 03', title: 'Design & build', desc: 'We design and develop based on the approved requirements, working in an agile way and adapting flexibly to changes.' },
        { step: 'STEP 04', title: 'Adoption & operation', desc: 'From post-release training and adoption to ongoing improvement proposals, we support you over the long term.' },
      ]
    : [
        { step: 'STEP 01', title: 'ヒアリング・現状把握', desc: '貴社の課題・目標・現在のシステム環境をお伺いします。' },
        { step: 'STEP 02', title: '戦略・提案', desc: '課題を整理し、貴社に合うCRMと進め方を選定。実現できるロードマップをご提案します。' },
        { step: 'STEP 03', title: '設計・実装', desc: '承認いただいた要件をもとに設計・開発。アジャイルに進め、途中の変化にも柔軟に対応します。' },
        { step: 'STEP 04', title: '定着化・運用支援', desc: 'リリース後の研修・定着化支援から継続的な改善提案まで、長期的にサポートします。' },
      ];

  const faqs = lang === 'en'
    ? [
        { q: 'How long does a project take?', a: 'It depends on scale, but we can start from as little as one month. For large projects we form a team and provide long-term support.' },
        { q: 'Do you support CRMs other than Salesforce?', a: 'Yes. We support HubSpot, Kintone, and other cloud CRMs, and also build custom CRMs with Claude Code.' },
        { q: 'Can we consult about using AI?', a: 'Yes. We support CRM integration and efficiency improvements using Salesforce Agentforce and generative AI.' },
        { q: 'Can we request operation/support only?', a: 'Yes. We welcome plans for improving existing systems or adoption support only, as well as spot work.' },
        { q: 'How is pricing decided?', a: 'It depends on project scale, duration, and scope. Tell us about your project and we will send you a quote.' },
      ]
    : [
        { q: 'プロジェクトの期間はどのくらいですか？', a: '規模によりますが、最短1ヶ月から対応可能です。大規模プロジェクトはチームを組んで長期的なサポートも承ります。' },
        { q: 'Salesforce以外のCRMにも対応していますか？', a: 'はい。HubSpot・Kintone・その他クラウドCRMにも対応しています。また、Claude Codeを活用したカスタムCRM開発も承ります。' },
        { q: 'AI活用についても相談できますか？', a: 'はい。SalesforceのAgentforceや生成AIを活用したCRM連携・業務効率化の支援も行っています。' },
        { q: '保守・運用サポートのみの依頼も可能ですか？', a: 'はい、可能です。既存システムの改修や定着化支援のみのプラン、スポット対応も歓迎しております。' },
        { q: '料金はどのように決まりますか？', a: 'プロジェクトの規模・期間・内容によって異なります。内容をお伺いしたうえでお見積りをお出しします。' },
      ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">

      {/* Hero: demo video */}
      <section className="bg-[#192c0d] text-[#f9f9f3] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1fr_1.25fr] gap-10 lg:gap-14 items-center">
          <div className="flex flex-col items-start gap-6 min-w-0">
            <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="text-[#a8d878] font-bold tracking-[0.2em] text-xs uppercase">Our Service</motion.span>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-[3.4rem] font-serif font-bold leading-[1.3]">
              {lang === 'en' ? <>Learn it, hand it off,<br />keep using it.</> : <>学ぶ、任せる、<br />使い続ける。</>}
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="text-[#f9f9f3]/80 text-base md:text-[17px] leading-loose max-w-[500px]">
              {ph(t('生成AIの研修から、|プラットフォームの構築、|CRMの導入と運用まで。', 'From generative AI training to platform building and CRM implementation and operation.'))}<br />
              {ph(t('まずは動いている画面を|ご覧ください。', 'Start by watching it in action.'))}
            </motion.p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => scrollToId('training')} className="min-h-12 px-6 rounded-full bg-[#f9f9f3] text-[#192c0d] text-sm font-bold hover:bg-white transition-colors">{t('生成AI研修', 'AI Training')}</button>
              <button onClick={() => scrollToId('platform')} className="min-h-12 px-6 rounded-full border border-[#f9f9f3]/40 text-[#f9f9f3] text-sm font-bold hover:bg-[#f9f9f3]/10 transition-colors">{t('プラットフォーム構築', 'Platform Building')}</button>
              <button onClick={() => scrollToId('crm')} className="min-h-12 px-6 rounded-full border border-[#f9f9f3]/40 text-[#f9f9f3] text-sm font-bold hover:bg-[#f9f9f3]/10 transition-colors">CRM</button>
            </div>
          </div>
          <div className="flex flex-col gap-3.5 min-w-0">
            <MacFrame>
              <ServiceVideo src="/images/service/demo-lesson-lab.mp4" poster="/images/service/demo-poster.png" className="bg-[#f3f4ee]"
                label={t('研修アプリでレッスンを進め、実践ラボで答えを貼り戻すまでの画面', 'The training app: working through a lesson and pasting an answer back in the practice lab')} />
            </MacFrame>
            <p className="text-[13px] text-[#f9f9f3]/80">{ph(t('研修アプリStart & Successの画面。|見本のデータで撮影', 'The Start & Success training app, recorded with sample data'))}</p>
          </div>
        </div>
      </section>

      {/* Training */}
      <section id="training" className="py-16 md:py-28 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-12 md:gap-[72px]">
          <FadeUp>
            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 items-center">
              <div className="flex flex-col gap-3.5 min-w-0">
                <IPadFrame>
                  <ServiceVideo src="/images/service/mebu-tour.mp4" poster="/images/service/mebu-tour-poster.png" className="bg-[#f3f4ee]"
                    label={t('案内役のメブが、研修アプリの使い方を案内している場面', 'Mebu, the guide character, walking a learner through the training app')} />
                </IPadFrame>
                <p className="text-[13px] text-[#555]">{ph(t('案内役のメブ。|はじめて入ると、|1分ほどで使い方を案内します', 'Mebu, the guide. On first login, a tour of about one minute shows how to use the app'))}</p>
              </div>
              <div className="flex flex-col items-start gap-5 min-w-0">
                <span className="text-[#3a4a1d] font-bold tracking-[0.25em] text-xs uppercase">Generative AI Training</span>
                <h2 className="text-3xl md:text-[2.5rem] font-serif font-bold text-[#192c0d] leading-[1.35]">
                  {lang === 'en' ? <>The app teaches,<br />instructors support</> : <>アプリが教え、<br />講師が支える生成AI研修</>}
                </h2>
                <p className="text-[#555] leading-loose">
                  {ph(t('動画、説明、問題、|本物のAIでの実践、|さいごの確認まで。', 'Video, explanation, questions, hands-on practice with real AI, and a final check.'))}<br />
                  {ph(t('受講者は|研修アプリStart & Successで、|自分のペースで進めます。', 'Learners move at their own pace in the Start & Success training app.'))}<br />
                  {ph(t('となりで道案内をするのは、|案内役のメブ。|講師は進み具合を見て、|止まっている人を助け、|相談に答えます。', 'Mebu guides them along the way, while instructors watch progress, help anyone who is stuck, and answer questions.'))}
                </p>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => navigate('/contact')}
                  className="min-h-[52px] px-6 sm:px-8 py-2 rounded-full bg-[#192c0d] text-[#f9f9f3] text-sm sm:text-[15px] font-bold inline-flex items-center gap-3 text-left hover:bg-[#3a4a1d] transition-colors">
                  {t('研修について相談する', 'Talk to us about training')} <ArrowRight size={16} />
                </motion.button>
              </div>
            </div>
          </FadeUp>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div className="bg-[#f9f9f3] rounded-3xl px-7 pt-10 pb-9 h-full flex flex-col gap-2.5">
                  <PhoneFrame src={s.img} alt={s.alt} />
                  <span className="text-[#3a4a1d] text-xs font-bold tracking-[0.2em] pt-6">{s.step}</span>
                  <h3 className="text-lg font-bold text-[#192c0d]">{s.title}</h3>
                  <p className="text-sm text-[#555] leading-loose">{ph(s.desc)}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Platform */}
      <section id="platform" className="py-16 md:py-28 bg-[#f9f9f3] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <FadeUp>
            <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-center">
              <div className="flex flex-col gap-3.5 min-w-0">
                <WindowsFrame title={t('経理デスク', 'Keiri Desk')}>
                  <ServiceVideo src="/images/service/keiri-tour.mp4" poster="/images/service/keiri-poster.jpg" className="bg-[#f7f8f4]"
                    label={t('経理デスクの画面。概要、確認待ちの処理、請求と入出金、案件の順に切り替わる', 'Keiri Desk screens: overview, items awaiting review, invoices and payments, and projects')} />
                </WindowsFrame>
                <p className="text-[13px] text-[#555]">{ph(t('自社で開発中の経理アプリ、|経理デスクの画面。|金額と取引先はすべて架空', 'Keiri Desk, an accounting app we are building in-house. All amounts and company names are fictional'))}</p>
              </div>
              <div className="flex flex-col items-start gap-5 min-w-0">
                <span className="text-[#3a4a1d] font-bold tracking-[0.25em] text-xs uppercase">Platform</span>
                <h2 className="text-[1.65rem] sm:text-3xl md:text-[2.5rem] font-serif font-bold text-[#192c0d] leading-[1.35] [word-break:auto-phrase] [overflow-wrap:anywhere] text-balance">
                  {ph(t('貴社専用の|プラットフォームも、|すぐに形にします', 'Your own platform, built fast'))}
                </h2>
                <p className="text-[#555] leading-loose">
                  {ph(t('研修アプリも、|この経理デスクも、|S&Sが自社で開発しているものです。', 'Both the training app and Keiri Desk are built in-house at S&S.'))}<br />
                  {ph(t('同じ進め方で、|貴社の業務に合わせたプラットフォームを|短期間で作成し、|提供します。', 'With the same approach, we build and deliver a platform tailored to your operations in a short time.'))}
                </p>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => navigate('/contact')}
                  className="min-h-[52px] px-6 sm:px-8 py-2 rounded-full bg-[#192c0d] text-[#f9f9f3] text-sm sm:text-[15px] font-bold inline-flex items-center gap-3 text-left hover:bg-[#3a4a1d] transition-colors">
                  {t('プラットフォームについて相談する', 'Talk to us about platforms')} <ArrowRight size={16} />
                </motion.button>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* CRM */}
      <div id="crm" className="py-20 md:py-28 bg-[#f9f9f3] border-y border-[#3a4a1d]/10 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="text-[#3a4a1d] font-bold tracking-[0.2em] text-xs uppercase mb-6 block">Our Service</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-[#192c0d] leading-tight mb-8">CRM Consulting</motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-[#666] text-base md:text-lg max-w-2xl leading-loose">
            {ph(t(
              'Salesforce・HubSpot・Kintoneなど、|主要CRMの導入から|活用・保守運用まで。|貴社の状況に合わせて|サポートします。',
              'From implementation to utilization and operation of major CRMs such as Salesforce, HubSpot, and Kintone, matched to where you are today.'
            ))}
          </motion.p>
          <FadeUp className="mt-14">
            <h3 className="text-base font-bold text-[#3a4a1d] mb-5">{t('これまでのご支援', 'Recent engagements')}</h3>
            <div className="grid lg:grid-cols-3 gap-px bg-[#3a4a1d]/15 rounded-3xl overflow-hidden">
              {cases.map((c, i) => (
                <div key={i} className="bg-white px-8 py-9 md:px-9 md:py-10 flex flex-col gap-3">
                  <span className="text-xs font-bold tracking-[0.16em] text-[#3a4a1d]">{c.tag}</span>
                  <h4 className="text-xl font-serif font-bold text-[#192c0d] leading-relaxed [word-break:auto-phrase] [overflow-wrap:anywhere] text-balance">{ph(c.title)}</h4>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>

      {/* Supported CRM */}
      <section className="py-20 bg-white border-b border-[#3a4a1d]/8">
        <div className="max-w-7xl mx-auto px-6">
          <FadeUp className="mb-12">
            <span className="text-[#3a4a1d] font-bold tracking-[0.2em] text-xs uppercase mb-4 block">Supported Platforms</span>
            <h3 className="text-3xl font-serif text-[#192c0d]">{t('対応CRM・プラットフォーム', 'Supported CRMs & Platforms')}</h3>
          </FadeUp>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {platforms.map((p, i) => (
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

      {/* Workflow */}
      <section className="py-28 bg-[#192c0d] relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none">
          <defs><pattern id="dots3" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="#f9f9f3" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#dots3)" />
        </svg>
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <FadeUp className="text-center mb-20">
            <span className="text-[#a8d878] font-bold tracking-[0.2em] text-xs uppercase mb-4 block">Workflow</span>
            <h2 className="text-4xl md:text-5xl font-serif text-[#f9f9f3]">{t('進め方', 'How We Work')}</h2>
          </FadeUp>
          <div className="space-y-0">
            {workflow.map((s, i) => (
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
            <h2 className="text-3xl md:text-4xl font-serif text-[#192c0d]">{t('よくあるご質問', 'Frequently Asked Questions')}</h2>
          </FadeUp>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
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
            <h2 className="text-3xl md:text-4xl font-serif text-[#f9f9f3] mb-6">{t('まずはお気軽にご相談ください', 'Start with a friendly chat')}</h2>
            <p className="text-[#f9f9f3]/55 mb-10 leading-loose">{t('初回相談無料。お問い合わせから2営業日以内にご連絡いたします。', 'First consultation is free. We reply within two business days of your inquiry.')}</p>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/contact')}
              className="bg-[#f9f9f3] text-[#192c0d] px-10 py-4 rounded-full font-bold hover:bg-white transition-all inline-flex items-center gap-3">
              {t('お問い合わせ', 'Contact')} <ArrowRight size={16} />
            </motion.button>
          </FadeUp>
        </div>
      </section>
    </motion.div>
  );
};

// ---- Contact ----
const Contact = () => {
  const navigate = useNavigate();
  const { t } = useLang();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Ensure the Salesforce Web-to-Lead retURL points to our /thanks page.
    const retEl = document.querySelector('input[name="retURL"]') as HTMLInputElement | null;
    if (retEl) retEl.value = `https://ss-and.com/thanks`;
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
      <div className="py-28 md:py-40 bg-[#f9f9f3] border-b border-[#3a4a1d]/10">
        <div className="max-w-4xl mx-auto px-6">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-[#3a4a1d] font-bold tracking-[0.2em] text-xs uppercase mb-6 block">Get in Touch</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#192c0d] mb-8 leading-tight">{t('お問い合わせ', 'Contact')}</motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-[#666] leading-loose text-base md:text-lg">
            {t(
              'CRM導入・DX推進に関するご相談は下記フォームより。初回相談無料・通常2営業日以内にご連絡いたします',
              'For consultations on CRM implementation and DX, please use the form below. The first consultation is free, and we usually reply within two business days.'
            )}
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
            <h3 className="text-2xl font-serif text-[#192c0d] mb-4">{t('お問い合わせありがとうございます', 'Thank you for your inquiry')}</h3>
            <p className="text-[#555] leading-relaxed mb-2">{t('内容を確認のうえ、2営業日以内にご連絡いたします。', 'We will review your message and reply within two business days.')}</p>
            <button onClick={() => setSubmitStatus('idle')}
              className="mt-8 text-[#3a4a1d] font-bold underline underline-offset-4 hover:opacity-70 transition-opacity text-sm">
              {t('新しいお問い合わせ', 'New inquiry')}
            </button>
          </motion.div>
        ) : (
          <form
            action="https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8&orgId=00Dd500000Fup0n"
            method="POST"
            target="hidden_iframe"
            onSubmit={() => { setSubmitted(true); setIsSubmitting(true); }}
            className={`bg-white p-10 md:p-16 rounded-3xl shadow-xl border space-y-8 ${submitStatus === 'error' ? 'border-red-300' : 'border-[#3a4a1d]/8'}`}>
            <input type="hidden" name="oid" value="00Dd500000Fup0n" />
            <input type="hidden" name="retURL" value="https://ss-and.com/thanks" />
            <input type="hidden" name="lead_source" value="Website" />

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="last_name" className="block text-xs font-bold text-[#192c0d] mb-3 tracking-wider uppercase">{t('名字', 'Last name')} <span className="text-[#3a4a1d]">*</span></label>
                <input id="last_name" name="last_name" type="text" autoComplete="family-name" required className="w-full bg-[#f9f9f3] border-b-2 border-[#3a4a1d]/20 rounded-t-lg p-4 focus:outline-none focus:border-[#3a4a1d] transition-colors text-sm" />
              </div>
              <div>
                <label htmlFor="first_name" className="block text-xs font-bold text-[#192c0d] mb-3 tracking-wider uppercase">{t('名前', 'First name')} <span className="text-[#3a4a1d]">*</span></label>
                <input id="first_name" name="first_name" type="text" autoComplete="given-name" required className="w-full bg-[#f9f9f3] border-b-2 border-[#3a4a1d]/20 rounded-t-lg p-4 focus:outline-none focus:border-[#3a4a1d] transition-colors text-sm" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="company" className="block text-xs font-bold text-[#192c0d] mb-3 tracking-wider uppercase">{t('会社名', 'Company')} <span className="text-[#3a4a1d]">*</span></label>
                <input id="company" name="company" type="text" autoComplete="organization" required className="w-full bg-[#f9f9f3] border-b-2 border-[#3a4a1d]/20 rounded-t-lg p-4 focus:outline-none focus:border-[#3a4a1d] transition-colors text-sm" />
                <p className="text-xs text-[#666] mt-2">{t('法人でない場合は、こちらに個人名（名字と名前）をご記入ください。', 'If you are not a company, please enter your personal name (last and first) here.')}</p>
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-[#192c0d] mb-3 tracking-wider uppercase">{t('メールアドレス', 'Email')} <span className="text-[#3a4a1d]">*</span></label>
                <input id="email" name="email" type="email" autoComplete="email" required className="w-full bg-[#f9f9f3] border-b-2 border-[#3a4a1d]/20 rounded-t-lg p-4 focus:outline-none focus:border-[#3a4a1d] transition-colors text-sm" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="mobile" className="block text-xs font-bold text-[#192c0d] mb-3 tracking-wider uppercase">{t('携帯', 'Mobile')}</label>
                <input id="mobile" name="mobile" type="text" autoComplete="tel" className="w-full bg-[#f9f9f3] border-b-2 border-[#3a4a1d]/20 rounded-t-lg p-4 focus:outline-none focus:border-[#3a4a1d] transition-colors text-sm" />
              </div>
              <div>
                <label htmlFor="city" className="block text-xs font-bold text-[#192c0d] mb-3 tracking-wider uppercase">{t('市区郡', 'City')}</label>
                <input id="city" name="city" type="text" autoComplete="address-level2" className="w-full bg-[#f9f9f3] border-b-2 border-[#3a4a1d]/20 rounded-t-lg p-4 focus:outline-none focus:border-[#3a4a1d] transition-colors text-sm" />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-xs font-bold text-[#192c0d] mb-3 tracking-wider uppercase">{t('お問い合わせ内容', 'Your message')}</label>
              <textarea id="description" name="00NRA00000SUvlV2AT" rows={6} placeholder={t('ご相談内容をご記入ください', 'Please write your inquiry here')} autoComplete="off" className="w-full bg-[#f9f9f3] border-b-2 border-[#3a4a1d]/20 rounded-t-lg p-4 focus:outline-none focus:border-[#3a4a1d] transition-colors resize-none text-sm" />
            </div>

            <div className="text-center">
              <div>
                <button type="submit" className="w-full md:w-auto bg-[#192c0d] text-[#f9f9f3] px-16 py-5 rounded-full font-bold tracking-widest hover:bg-[#1e3610] transition-all shadow-lg disabled:opacity-50 text-sm">{isSubmitting ? t('送信中...', 'Sending...') : t('送信する', 'Submit')}</button>
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
  const { t } = useLang();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full py-28 md:py-40">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-[#f0f5eb] p-16 rounded-3xl border border-[#3a4a1d]/20 text-center">
          <div className="w-16 h-16 rounded-full bg-[#192c0d] flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-8 h-8 text-[#a8d878]" />
          </div>
          <h3 className="text-2xl font-serif text-[#192c0d] mb-4">{t('送信が完了しました', 'Your message has been sent')}</h3>
          <p className="text-[#555] leading-relaxed mb-2">{t('お問い合わせありがとうございます。内容を確認のうえ、2営業日以内にご連絡いたします。', 'Thank you for your inquiry. We will review it and reply within two business days.')}</p>
          <div className="mt-8">
            <Link to="/" className="text-[#3a4a1d] font-bold underline underline-offset-4 hover:opacity-70 transition-opacity text-sm">{t('トップに戻る', 'Back to Home')}</Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ---- App Inner (uses Router hooks) ----
const AppInner = ({ loading, setLoading }: { loading: boolean; setLoading: (v: boolean) => void }) => {
  const location = useLocation();
  const { lang } = useLang();

  useEffect(() => {
    const titlesJa: Record<string, string> = {
      '/': 'S＆S合同会社 | CRMコンサルティング・構築・保守運用',
      '/about': '会社について | S＆S合同会社',
      '/service': 'サービス | S＆S合同会社 - CRM導入・構築・保守',
      '/contact': 'お問い合わせ | S＆S合同会社',
      '/thanks': 'お問い合わせありがとうございました | S＆S合同会社',
    };
    const titlesEn: Record<string, string> = {
      '/': 'S&S LLC | CRM Consulting, Implementation & Operation',
      '/about': 'About | S&S LLC',
      '/service': 'Service | S&S LLC - CRM Implementation & Support',
      '/contact': 'Contact | S&S LLC',
      '/thanks': 'Thank you for your inquiry | S&S LLC',
    };
    const titles = lang === 'en' ? titlesEn : titlesJa;
    document.title = titles[location.pathname] || (lang === 'en' ? 'S&S LLC' : 'S＆S合同会社');
    window.scrollTo(0, 0);
  }, [location, lang]);

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
          <AgentforceChat />
        </motion.div>
      )}
    </div>
  );
};

// ---- App ----
export default function App() {
  const [loading, setLoading] = useState(true);
  return (
    <LangProvider>
      <BrowserRouter>
        <AppInner loading={loading} setLoading={setLoading} />
      </BrowserRouter>
    </LangProvider>
  );
}
