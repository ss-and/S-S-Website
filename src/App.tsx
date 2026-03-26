import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  ArrowRight, Menu, X, Users, Layers, CheckCircle,
  Briefcase, Database, Code, HelpCircle, Zap,
  Target, Instagram, MapPin, User, Building
} from 'lucide-react';

type Page = 'home' | 'concept' | 'service' | 'contact';

// ---- Brand Logo ----
const BrandLogo = ({ size = 'medium', showTagline = false, invert = false }: {
  size?: 'small' | 'medium' | 'large';
  showTagline?: boolean;
  invert?: boolean;
}) => {
  const [imageError, setImageError] = useState(false);
  const sizeClasses = {
    small: { width: 'w-24', text: 'text-xl', ruby: 'text-[6px] -top-2 -right-4' },
    medium: { width: 'w-40', text: 'text-3xl', ruby: 'text-[8px] -top-3 -right-6' },
    large: { width: 'w-80', text: 'text-6xl', ruby: 'text-xs -top-5 -right-10' },
  };
  const s = sizeClasses[size];
  const color = invert ? 'text-[#f9f9f3]' : 'text-[#3a4a1d]';

  if (imageError) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="relative inline-block">
          <h1 className={`font-serif font-bold tracking-widest leading-none ${s.text} ${color}`}>S & S</h1>
          <span className={`absolute font-sans font-bold tracking-widest whitespace-nowrap ${s.ruby} ${color}`}>
            エスアンドエス
          </span>
        </div>
        {showTagline && size === 'large' && (
          <div className="flex flex-col items-center w-full mt-2">
            <div className={`w-full h-px my-2 opacity-80 ${invert ? 'bg-[#f9f9f3]' : 'bg-[#3a4a1d]'}`}></div>
            <p className={`font-sans font-bold tracking-tight uppercase whitespace-nowrap text-xs ${color}`}>
              Success Strategy Synergy Simple Side-by-side Straight Smile
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <img
        src="/images/logo.png"
        alt="S&S エスアンドエス"
        className={`${s.width} h-auto object-contain`}
        style={invert ? { filter: 'brightness(0) invert(1)' } : undefined}
        onError={() => setImageError(true)}
      />
    </div>
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#f9f9f3]"
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
const Navbar = ({ activePage, navigate }: { activePage: Page; navigate: (p: Page) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setScrolled(false);
  }, [activePage]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDark = activePage === 'home' && !scrolled;

  const navItems: { id: Page; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'concept', label: 'About' },
    { id: 'service', label: 'Service' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav className={`sticky top-0 z-40 transition-all duration-500 ${
      isDark ? 'bg-transparent' : 'bg-[#f9f9f3]/95 backdrop-blur-md border-b border-[#3a4a1d]/10 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <button onClick={() => navigate('home')} className="hover:opacity-80 transition-opacity">
            <BrandLogo size="small" invert={isDark} />
          </button>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`text-sm font-medium tracking-wide transition-all duration-300 relative py-2 ${
                  activePage === item.id
                    ? isDark ? 'text-white' : 'text-[#3a4a1d]'
                    : isDark ? 'text-white/70 hover:text-white' : 'text-[#555] hover:text-[#3a4a1d]'
                }`}
              >
                {item.label}
                {activePage === item.id && (
                  <motion.div
                    layoutId="underline"
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDark ? 'bg-white' : 'bg-[#3a4a1d]'}`}
                  />
                )}
              </button>
            ))}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('contact')}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                isDark
                  ? 'bg-white text-[#1a2e10] hover:bg-[#f9f9f3]'
                  : 'bg-[#3a4a1d] text-[#f9f9f3] hover:bg-[#2d3a17]'
              }`}
            >
              相談する
            </motion.button>
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
                  key={item.id}
                  onClick={() => { navigate(item.id); setIsOpen(false); }}
                  className={`block w-full text-left px-4 py-3 text-base rounded-lg transition-colors ${
                    activePage === item.id ? 'text-[#f9f9f3] bg-[#3a4a1d] font-bold' : 'text-[#333] hover:bg-[#3a4a1d]/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => { navigate('contact'); setIsOpen(false); }}
                className="block w-full text-center mt-4 px-4 py-3 bg-[#3a4a1d] text-[#f9f9f3] font-bold rounded-full"
              >
                相談する
              </button>
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

// ---- Home ----
const Home = ({ navigate }: { navigate: (p: Page) => void }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">

    {/* Hero */}
    <section className="relative min-h-screen bg-[#192c0d] flex items-center justify-center overflow-hidden">
      {/* Dot grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none">
        <defs>
          <pattern id="dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#f9f9f3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* Animated circles */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-48 -right-48 w-[700px] h-[700px] rounded-full border border-[#f9f9f3]/8 pointer-events-none"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 100, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-64 -left-48 w-[900px] h-[900px] rounded-full border border-[#f9f9f3]/5 pointer-events-none"
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[#a8d878]/10 pointer-events-none"
      />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 right-1/3 w-80 h-80 bg-[#3a6a1a] rounded-full blur-[120px] opacity-30 pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-60 h-60 bg-[#2a5010] rounded-full blur-[100px] opacity-25 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <span className="inline-block text-[#a8d878] text-xs font-bold tracking-[0.4em] uppercase mb-10 px-4 py-2 border border-[#a8d878]/30 rounded-full">
            AI & CRM Consulting
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9 }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-serif text-[#f9f9f3] mb-8 leading-[1.05] font-bold"
        >
          ビジネスの<br />
          <span className="text-[#a8d878]">可能性</span>を、<br />
          解き放つ。
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-base md:text-xl text-[#f9f9f3]/65 mb-12 max-w-2xl mx-auto leading-loose"
        >
          AI・CRMのコンサルティングから構築・保守運用まで。<br />
          S＆S合同会社が、貴社のデジタル変革を一気通貫で支援します。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('service')}
            className="bg-[#f9f9f3] text-[#1a2e10] px-10 py-4 rounded-full font-bold text-base hover:bg-white transition-all shadow-2xl inline-flex items-center justify-center gap-3"
          >
            サービスを見る <ArrowRight size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('contact')}
            className="border border-[#f9f9f3]/30 text-[#f9f9f3] px-10 py-4 rounded-full font-bold text-base hover:border-[#f9f9f3]/60 hover:bg-[#f9f9f3]/5 transition-all inline-flex items-center justify-center gap-3"
          >
            無料相談はこちら
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#f9f9f3]/30"
      >
        <span className="text-xs tracking-[0.2em] uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-[#f9f9f3]/30 to-transparent" />
      </motion.div>
    </section>

    {/* Services */}
    <section className="py-32 bg-[#f9f9f3]">
      <div className="max-w-7xl mx-auto px-6">
        <FadeUp className="mb-20">
          <span className="text-[#3a4a1d] font-bold tracking-[0.2em] text-xs uppercase mb-4 block">What We Do</span>
          <h2 className="text-5xl md:text-7xl font-serif text-[#192c0d] leading-tight">Services</h2>
        </FadeUp>

        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#3a4a1d]/10 border border-[#3a4a1d]/10 rounded-3xl overflow-hidden">
          {[
            {
              num: '01',
              icon: <Target size={32} />,
              title: 'AI活用コンサルティング',
              en: 'AI Consulting',
              desc: '生成AI・Agentforceの業務活用から戦略策定まで。現状分析と実行可能なロードマップを提供します。',
            },
            {
              num: '02',
              icon: <Database size={32} />,
              title: 'CRM導入・構築',
              en: 'CRM Implementation',
              desc: 'Salesforceを中心としたCRM/MAツールの設計・実装。ビジネスに合わせた柔軟な構築を実現します。',
            },
            {
              num: '03',
              icon: <Layers size={32} />,
              title: '保守・運用サポート',
              en: 'Operations & Support',
              desc: '導入後の定着化支援から継続的な改善まで。長期パートナーとして運用をフルサポートします。',
            },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              whileHover={{ backgroundColor: '#192c0d' }}
              onClick={() => navigate('service')}
              className="group relative p-10 md:p-12 bg-white cursor-pointer transition-colors duration-500"
            >
              <span className="text-7xl font-serif font-bold text-[#3a4a1d]/8 group-hover:text-[#a8d878]/15 transition-colors leading-none block mb-6">
                {s.num}
              </span>
              <div className="text-[#3a4a1d] group-hover:text-[#a8d878] transition-colors mb-6">{s.icon}</div>
              <h3 className="text-xl font-bold text-[#192c0d] group-hover:text-[#f9f9f3] transition-colors mb-1 leading-snug">{s.title}</h3>
              <p className="text-xs text-[#999] group-hover:text-[#a8d878]/70 transition-colors mb-6 uppercase tracking-widest">{s.en}</p>
              <p className="text-[#555] group-hover:text-[#f9f9f3]/70 transition-colors leading-relaxed text-sm mb-8">{s.desc}</p>
              <div className="flex items-center gap-2 text-[#3a4a1d] group-hover:text-[#a8d878] transition-all">
                <span className="text-sm font-bold">詳しく見る</span>
                <motion.span className="group-hover:translate-x-1 transition-transform inline-block">
                  <ArrowRight size={14} />
                </motion.span>
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
              S＆Sとは、<br />
              お客様と共に<br />
              <em className="not-italic text-[#3a4a1d]">成長するパートナー</em>。
            </h2>
            <p className="text-[#555] leading-loose text-base md:text-lg mb-10">
              S＆S合同会社は、AI活用・CRM（Salesforce等）のコンサルティング・構築・保守運用を手がけます。
              元Salesforce SEの専門知識と、戦略から実装・定着化までの一貫支援が強みです。
              大手にはないスピードと柔軟性で、貴社の課題を解決します。
            </p>
            <button
              onClick={() => navigate('concept')}
              className="group inline-flex items-center gap-3 text-[#3a4a1d] font-bold border-b-2 border-[#3a4a1d] pb-1 hover:gap-5 transition-all duration-300"
            >
              私たちについて
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </FadeUp>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Success', desc: '顧客の成功をゴールに', icon: <Target size={22} /> },
              { label: 'Strategy', desc: '全体俯瞰の戦略設計', icon: <Zap size={22} /> },
              { label: 'Synergy', desc: '共創による相乗効果', icon: <Users size={22} /> },
              { label: 'Speed', desc: 'アジャイルな実行力', icon: <ArrowRight size={22} /> },
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

    {/* Strengths bar */}
    <section className="py-24 bg-[#f9f9f3] border-t border-[#3a4a1d]/8">
      <div className="max-w-6xl mx-auto px-6">
        <FadeUp className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-[#192c0d]">S＆Sが選ばれる理由</h2>
        </FadeUp>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Briefcase size={28} />,
              title: '元Salesforce SEによる高品質実装',
              desc: 'Salesforce Japan出身のエンジニアが直接対応。認定資格保有者による確かな技術力で、高品質な実装を提供します。',
            },
            {
              icon: <Zap size={28} />,
              title: '少数精鋭のスピード対応',
              desc: '大手にはない意思決定の速さと柔軟性。お客様のニーズに合わせた迅速な対応で、スピーディな課題解決を実現します。',
            },
            {
              icon: <CheckCircle size={28} />,
              title: '戦略〜運用まで一気通貫',
              desc: '導入支援だけで終わらない。定着化・継続改善まで伴走するロングタームなサポートで、投資対効果を最大化します。',
            },
          ].map((item, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className="bg-white p-10 rounded-2xl h-full hover:shadow-xl transition-shadow duration-300 border border-[#3a4a1d]/5">
                <div className="w-14 h-14 bg-[#192c0d] rounded-2xl flex items-center justify-center text-[#a8d878] mb-6">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-[#192c0d] mb-4 leading-snug">{item.title}</h3>
                <p className="text-[#666] leading-loose text-sm">{item.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>

    {/* CTA Banner */}
    <section className="py-28 bg-[#192c0d] relative overflow-hidden">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full border border-[#f9f9f3]/5 pointer-events-none"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full border border-[#a8d878]/10 pointer-events-none"
      />
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <FadeUp>
          <h2 className="text-3xl md:text-5xl font-serif text-[#f9f9f3] mb-6 leading-tight">
            AI・CRMのことなら、<br />まずはご相談を。
          </h2>
          <p className="text-[#f9f9f3]/55 text-base md:text-lg mb-10 leading-loose">
            導入を検討中の方から、既存システムの改善をお考えの方まで。<br />
            初回のご相談は無料で承っております。
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('contact')}
            className="bg-[#f9f9f3] text-[#192c0d] px-12 py-5 rounded-full font-bold text-base hover:bg-white transition-all shadow-2xl inline-flex items-center gap-3"
          >
            お問い合わせはこちら <ArrowRight size={18} />
          </motion.button>
        </FadeUp>
      </div>
    </section>
  </motion.div>
);

// ---- Concept ----
const Concept = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">

    {/* Hero */}
    <div className="min-h-[60vh] flex items-center justify-center bg-[#192c0d] relative overflow-hidden">
      <svg className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none">
        <defs>
          <pattern id="dots2" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#f9f9f3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots2)" />
      </svg>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full border border-[#f9f9f3]/6 pointer-events-none"
      />
      <div className="text-center z-10 px-6 py-24">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="block text-xs tracking-[0.4em] mb-6 text-[#a8d878] uppercase"
        >
          Philosophy
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-6xl md:text-8xl font-serif font-bold text-[#f9f9f3]"
        >
          The 3 &quot;S&quot;
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-base text-[#f9f9f3]/60 max-w-xl mx-auto leading-loose"
        >
          私たちが大切にする、3つの指針。
        </motion.p>
      </div>
    </div>

    {/* The 3 S's */}
    <div className="max-w-6xl mx-auto px-6 py-28 space-y-20">
      {[
        {
          num: '01',
          title: 'Success',
          ja: '成功',
          icon: <Target size={100} />,
          text: 'プロジェクトの完了はゴールではありません。お客様のビジネスが実際に成長し、成果を生み出すことこそが、真の成功です。私たちは常に「顧客の成功」を第一義に考え、すべての施策を設計します。',
        },
        {
          num: '02',
          title: 'Strategy',
          ja: '戦略',
          icon: <Zap size={100} />,
          text: '場当たり的な対応ではなく、全体俯瞰に基づいた戦略を。現状の課題分析から、あるべき姿（To-Be）の策定まで、ロジカルかつ実現可能なロードマップを描きます。',
        },
        {
          num: '03',
          title: 'Synergy',
          ja: '相乗効果',
          icon: <Users size={100} />,
          text: 'S＆Sという社名には、お客様との共創という意味が込められています。私たちの技術と、お客様のビジネス知見。二つが掛け合わさることで、想像以上の価値を生み出します。',
        },
      ].map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={`grid md:grid-cols-2 gap-12 items-stretch ${i % 2 === 1 ? 'md:grid-flow-dense' : ''}`}
        >
          <div className={`bg-white border border-[#3a4a1d]/8 p-12 rounded-3xl flex flex-col justify-center relative overflow-hidden ${i % 2 === 1 ? 'md:col-start-2' : ''}`}>
            <div className="absolute top-0 right-0 p-8 opacity-[0.04] text-[#3a4a1d]">{s.icon}</div>
            <span className="text-7xl font-serif text-[#3a4a1d]/10 font-bold mb-4">{s.num}</span>
            <h3 className="text-4xl font-serif text-[#192c0d] mb-2">
              {s.title}
              <span className="text-base ml-4 text-[#999] font-sans font-normal">{s.ja}</span>
            </h3>
            <div className="w-12 h-0.5 bg-[#3a4a1d] my-6 opacity-30" />
            <p className="text-[#555] leading-loose text-base">{s.text}</p>
          </div>
          <div className={`bg-[#192c0d] rounded-3xl flex items-center justify-center min-h-56 relative overflow-hidden ${i % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}`}>
            <div className="absolute inset-0 opacity-10">
              <motion.div
                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-20 -right-20 w-80 h-80 rounded-full border border-[#f9f9f3]"
              />
            </div>
            <div className="relative z-10 text-center p-12">
              <div className="text-[#a8d878] opacity-40 flex justify-center mb-6">{s.icon}</div>
              <span className="text-[#f9f9f3]/40 text-xs tracking-[0.3em] uppercase">{s.title}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>

    {/* Corporate Identity */}
    <section className="py-28 bg-[#f9f9f3] border-t border-[#3a4a1d]/8">
      <div className="max-w-4xl mx-auto px-6">
        <FadeUp className="text-center mb-20">
          <span className="text-[#3a4a1d] font-bold tracking-[0.2em] text-xs uppercase mb-4 block">Corporate Identity</span>
          <h3 className="text-4xl md:text-5xl font-serif text-[#192c0d]">企業理念</h3>
        </FadeUp>

        {/* Mission */}
        <FadeUp>
          <div className="bg-[#192c0d] rounded-3xl p-10 md:p-14 text-center mb-16 relative overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-20 -right-20 w-72 h-72 rounded-full border border-[#f9f9f3]/5 pointer-events-none"
            />
            <span className="text-[#a8d878] text-xs font-bold tracking-[0.3em] uppercase mb-6 block">Mission</span>
            <p className="text-[#f9f9f3] text-xl md:text-2xl font-serif leading-relaxed relative z-10">
              「働く環境に変化をもたらし、<br />
              関わる人たちの毎日を少しでも<span className="text-[#a8d878]">『楽』</span>にする。」
            </p>
          </div>
        </FadeUp>

        {/* Story */}
        <FadeUp>
          <div className="bg-white rounded-3xl p-10 md:p-14 mb-10 border border-[#3a4a1d]/8">
            <span className="text-[#3a4a1d] text-xs font-bold tracking-[0.3em] uppercase mb-6 block">Story — 創業の背景</span>
            <div className="space-y-5 text-[#555] leading-[2] text-base">
              <p>
                子どもの頃、初めて「チョコットランド」や「メイプルストーリー」といったオンラインゲームの世界に触発された時の、あの衝撃とワクワク感。世界が一気に広がり、常識が変わるような感動がありました。
              </p>
              <p>
                大人になり、AIやCRMといった最新テクノロジーに触れた時、私はあの頃と全く同じ「感動」を覚えました。テクノロジーは、一瞬にして目の前の環境を変え、人を驚かせ、そして毎日の作業を劇的に「楽」にしてくれます。
              </p>
              <p>
                S&S合同会社は、この「環境が変わる感動」をビジネスの世界で提供し続け、関わるすべての人たちの毎日を少しでも楽に、そして笑顔にするためのお手伝いをします。
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
              num: '1',
              title: 'Speed & Share',
              sub: '最速の行動と、価値の共有',
              desc: '完璧主義を捨てて最速で動き、得た知識や感動は出し惜しみせずに関わる人とシェアする。',
            },
            {
              num: '2',
              title: 'Smart & Strong',
              sub: '賢い戦略と、ブレない強さ',
              desc: '既存の枠にとらわれない賢い視点（ハック）を持ち、それを最後まで実行しきる強さを持つ。',
            },
            {
              num: '3',
              title: 'Smile & Synergy',
              sub: '笑顔と相乗効果',
              desc: '相手の課題に笑顔で寄り添い、お互いの強みを掛け合わせることで、一人では生み出せない変化とゆとりを創り出す。',
            },
          ].map((v, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white border border-[#3a4a1d]/8 rounded-2xl p-8 h-full hover:shadow-xl transition-all duration-300"
              >
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
          <span className="text-[#3a4a1d] font-bold tracking-[0.2em] text-xs uppercase mb-4 block">About</span>
          <h3 className="text-4xl md:text-5xl font-serif text-[#192c0d]">会社概要</h3>
        </FadeUp>

        <div className="bg-[#f9f9f3] rounded-3xl overflow-hidden">
          {[
            { icon: <Building size={18} />, label: '会社名', value: 'S＆S合同会社' },
            { icon: <User size={18} />, label: '代表取締役', value: '境野 竣介' },
            {
              icon: <MapPin size={18} />, label: '所在地',
              value: (
                <span>〒150-0043<br />東京都渋谷区道玄坂1丁目10番8号<br />渋谷道玄坂東急ビル2F−C</span>
              ),
            },
            { icon: <Code size={18} />, label: '資本金', value: '1,000,000円' },
            {
              icon: <Layers size={18} />, label: '事業内容',
              value: (
                <ul className="space-y-1">
                  <li>AI・CRMのコンサルティング・構築・保守運用</li>
                  <li>クラウドサービスの導入支援・運用</li>
                  <li>ITシステム・ソフトウェアの企画・開発・販売</li>
                  <li>DX推進・経営コンサルティング</li>
                  <li>人材育成・研修・セミナーの企画・運営</li>
                </ul>
              ),
            },
          ].map((row, i, arr) => (
            <FadeUp key={i} delay={i * 0.05}>
              <div className={`flex gap-6 p-6 md:p-8 ${i < arr.length - 1 ? 'border-b border-[#3a4a1d]/8' : ''}`}>
                <div className="w-10 h-10 bg-[#192c0d] rounded-xl flex items-center justify-center text-[#a8d878] shrink-0">
                  {row.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#3a4a1d] tracking-widest uppercase mb-1">{row.label}</p>
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
const Service = ({ navigate }: { navigate: (p: Page) => void }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">

    {/* Hero */}
    <div className="py-28 md:py-40 bg-[#f9f9f3] border-b border-[#3a4a1d]/10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-[#3a4a1d] font-bold tracking-[0.2em] text-xs uppercase mb-6 block"
        >
          Our Service
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-6xl md:text-8xl font-serif text-[#192c0d] leading-tight mb-8"
        >
          AI & CRM<br />Consulting
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-[#666] text-lg max-w-2xl leading-loose"
        >
          導入検討から設計・実装・運用まで、貴社のフェーズに合わせた柔軟なサポートを提供します。
        </motion.p>
      </div>
    </div>

    {/* Service Detail */}
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 space-y-20">
        {[
          {
            num: '01',
            title: 'AI活用コンサルティング',
            en: 'AI Consulting',
            icon: <Target size={40} />,
            points: ['生成AI・ChatGPT業務活用の戦略策定', 'Agentforce / Salesforce AI導入支援', 'AI活用研修・社内展開支援', 'PoC（概念実証）設計と評価'],
            desc: '「AIを使いたいが何から始めればいいかわからない」という企業様に。現状把握から優先度の高いユースケース選定、PoC設計、実装、社内展開まで一貫してサポートします。',
          },
          {
            num: '02',
            title: 'CRM導入・構築',
            en: 'CRM Implementation',
            icon: <Database size={40} />,
            points: ['Salesforce設計・構築・カスタマイズ', 'Sales Cloud / Service Cloud / Marketing Cloud', 'データ移行・外部システム連携', 'アジャイルな反復開発'],
            desc: 'Salesforce認定資格を持つ元SEが直接担当。要件定義から実装・テスト・リリースまで、お客様の業務プロセスに完全フィットしたCRM環境を構築します。',
          },
          {
            num: '03',
            title: '保守・運用サポート',
            en: 'Operations & Support',
            icon: <Layers size={40} />,
            points: ['導入後の定着化・ユーザー研修', '継続的な機能改善・追加開発', 'システム監視・障害対応', '月次レポートと改善提案'],
            desc: '「システムを入れたら終わり」ではなく、使い続けられる体制を一緒に作ります。定着化支援から継続改善まで、長期パートナーとして伴走します。',
          },
        ].map((s, i) => (
          <FadeUp key={i}>
            <div className={`grid md:grid-cols-2 gap-16 items-start ${i % 2 === 1 ? 'md:grid-flow-dense' : ''}`}>
              <div className={i % 2 === 1 ? 'md:col-start-2' : ''}>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-5xl font-serif font-bold text-[#3a4a1d]/15">{s.num}</span>
                  <div className="text-[#3a4a1d]">{s.icon}</div>
                </div>
                <h3 className="text-3xl font-serif font-bold text-[#192c0d] mb-2">{s.title}</h3>
                <p className="text-sm text-[#999] tracking-widest uppercase mb-6">{s.en}</p>
                <p className="text-[#555] leading-loose mb-8">{s.desc}</p>
                <ul className="space-y-3">
                  {s.points.map((p, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-[#444]">
                      <CheckCircle size={16} className="text-[#3a4a1d] shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`bg-[#f9f9f3] rounded-3xl p-12 flex items-center justify-center min-h-64 relative overflow-hidden ${i % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}`}>
                <motion.div
                  animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                  transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 m-8 rounded-full border-2 border-dashed border-[#3a4a1d]/10"
                />
                <div className="relative z-10 text-center">
                  <div className="text-[#3a4a1d]/30 flex justify-center mb-4">{s.icon}</div>
                  <span className="text-[#3a4a1d]/40 text-xs tracking-[0.3em] uppercase">{s.en}</span>
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
        <defs>
          <pattern id="dots3" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="#f9f9f3" />
          </pattern>
        </defs>
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
            { step: 'STEP 02', title: '戦略・提案', desc: '課題を整理し、最適なツール・アプローチを選定。実現可能なロードマップをご提案します。' },
            { step: 'STEP 03', title: '設計・実装', desc: '承認いただいた要件をもとに設計・開発。アジャイルに進め、途中でも柔軟に対応します。' },
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

    {/* Why S&S */}
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <FadeUp className="mb-16">
          <span className="text-[#3a4a1d] font-bold tracking-[0.2em] text-xs uppercase mb-4 block">Why S&S?</span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#192c0d]">選ばれる理由</h2>
        </FadeUp>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Speed', desc: '少数精鋭ならではの意思決定スピードとアジャイルな開発体制で、迅速に課題解決を進めます。' },
            { title: 'Quality', desc: '元Salesforce SE・認定資格保有者による高品質な実装。大手ベンダーに劣らない技術力を提供します。' },
            { title: 'Flexibility', desc: 'マニュアル通りではなく、お客様の状況・予算・フェーズに合わせた柔軟なプランをご提案します。' },
          ].map((s, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                className="p-10 bg-[#f9f9f3] rounded-2xl hover:shadow-xl transition-all duration-300"
              >
                <div className="text-[#192c0d] font-serif text-3xl font-bold mb-4">{s.title}</div>
                <div className="w-8 h-0.5 bg-[#3a4a1d] mb-4 opacity-40" />
                <p className="text-[#666] leading-relaxed text-sm">{s.desc}</p>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>

    {/* FAQ */}
    <section className="py-28 bg-[#f9f9f3]">
      <div className="max-w-3xl mx-auto px-6">
        <FadeUp className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-[#192c0d]">よくあるご質問</h2>
        </FadeUp>
        <div className="space-y-4">
          {[
            { q: 'プロジェクトの期間はどのくらいですか？', a: '規模によりますが、最短1ヶ月から対応可能です。大規模プロジェクトはチームを組んで長期的なサポートも承ります。' },
            { q: 'S＆S合同会社ならではの強みは何ですか？', a: '少数精鋭によるスピードと柔軟性が強みです。元Salesforce SEの専門知識を活かした高品質な実装を、適正価格でご提供します。' },
            { q: 'Salesforce以外のご相談も可能ですか？', a: 'はい、DX全般に対応しています。CRM/MAツール選定、業務フロー設計、データ活用戦略など幅広くご相談ください。' },
            { q: 'AI活用についても相談できますか？', a: 'はい。生成AIの業務活用コンサルから、Agentforce・ChatGPT活用の研修・導入支援まで対応しています。' },
            { q: '保守・運用サポートのみの依頼も可能ですか？', a: 'はい、可能です。既存システムの改修や定着化支援のみのプラン、スポット対応も歓迎しております。' },
          ].map((faq, i) => (
            <FadeUp key={i} delay={i * 0.05}>
              <div className="bg-white p-7 rounded-2xl border border-[#3a4a1d]/8 hover:border-[#3a4a1d]/20 transition-colors">
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
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('contact')}
            className="bg-[#f9f9f3] text-[#192c0d] px-10 py-4 rounded-full font-bold hover:bg-white transition-all inline-flex items-center gap-3"
          >
            お問い合わせ <ArrowRight size={16} />
          </motion.button>
        </FadeUp>
      </div>
    </section>
  </motion.div>
);

// ---- Contact ----
const Contact = () => {
  const [formData, setFormData] = useState({
    lastname: '', firstname: '', company: '', email: '', phone: '', description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

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

      {/* Hero */}
      <div className="py-28 md:py-40 bg-[#f9f9f3] border-b border-[#3a4a1d]/10">
        <div className="max-w-4xl mx-auto px-6">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#3a4a1d] font-bold tracking-[0.2em] text-xs uppercase mb-6 block"
          >
            Get in Touch
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-7xl font-serif text-[#192c0d] mb-8"
          >
            Contact
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[#666] leading-loose text-base md:text-lg"
          >
            AI・CRM導入・DX推進に関するご相談は下記フォームより。<br />
            初回相談無料・通常2営業日以内にご連絡いたします。
          </motion.p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20">
        {submitStatus === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#f0f5eb] p-16 rounded-3xl border border-[#3a4a1d]/20 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-[#192c0d] flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-8 h-8 text-[#a8d878]" />
            </div>
            <h3 className="text-2xl font-serif text-[#192c0d] mb-4">お問い合わせありがとうございます</h3>
            <p className="text-[#555] leading-relaxed mb-2">内容を確認のうえ、2営業日以内にご連絡いたします。</p>
            <button
              onClick={() => setSubmitStatus('idle')}
              className="mt-8 text-[#3a4a1d] font-bold underline underline-offset-4 hover:opacity-70 transition-opacity text-sm"
            >
              新しいお問い合わせ
            </button>
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className={`bg-white p-10 md:p-16 rounded-3xl shadow-xl border space-y-8 transition-all duration-300 ${
              submitStatus === 'error' ? 'border-red-300' : 'border-[#3a4a1d]/8'
            }`}
          >
            {submitStatus === 'error' && (
              <p className="text-center text-red-600 text-sm pb-4 border-b border-red-200">
                送信に失敗しました。もう一度お試しください。
              </p>
            )}
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { label: '姓', field: 'lastname', placeholder: '山田', required: true },
                { label: '名', field: 'firstname', placeholder: '太郎', required: true },
              ].map(({ label, field, placeholder, required }) => (
                <div key={field}>
                  <label className="block text-xs font-bold text-[#192c0d] mb-3 tracking-wider uppercase">
                    {label} {required && <span className="text-[#3a4a1d]">*</span>}
                  </label>
                  <input
                    type="text"
                    required={required}
                    value={formData[field as keyof typeof formData]}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full bg-[#f9f9f3] border-b-2 border-[#3a4a1d]/20 rounded-t-lg p-4 focus:outline-none focus:border-[#3a4a1d] focus:bg-[#3a4a1d]/5 transition-colors text-sm"
                  />
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { label: '会社名', field: 'company', placeholder: '株式会社〇〇', type: 'text', required: false },
                { label: '電話番号', field: 'phone', placeholder: '03-1234-5678', type: 'tel', required: false },
              ].map(({ label, field, placeholder, type, required }) => (
                <div key={field}>
                  <label className="block text-xs font-bold text-[#192c0d] mb-3 tracking-wider uppercase">{label}</label>
                  <input
                    type={type}
                    required={required}
                    value={formData[field as keyof typeof formData]}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full bg-[#f9f9f3] border-b-2 border-[#3a4a1d]/20 rounded-t-lg p-4 focus:outline-none focus:border-[#3a4a1d] focus:bg-[#3a4a1d]/5 transition-colors text-sm"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-xs font-bold text-[#192c0d] mb-3 tracking-wider uppercase">
                メールアドレス <span className="text-[#3a4a1d]">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="info@example.com"
                className="w-full bg-[#f9f9f3] border-b-2 border-[#3a4a1d]/20 rounded-t-lg p-4 focus:outline-none focus:border-[#3a4a1d] focus:bg-[#3a4a1d]/5 transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#192c0d] mb-3 tracking-wider uppercase">
                お問い合わせ内容 <span className="text-[#3a4a1d]">*</span>
              </label>
              <textarea
                rows={6}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="ご相談内容をご記入ください"
                className="w-full bg-[#f9f9f3] border-b-2 border-[#3a4a1d]/20 rounded-t-lg p-4 focus:outline-none focus:border-[#3a4a1d] focus:bg-[#3a4a1d]/5 transition-colors resize-none text-sm"
              />
            </div>
            <div className="text-center pt-4">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.03 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
                className="w-full md:w-auto bg-[#192c0d] text-[#f9f9f3] px-16 py-5 rounded-full font-bold tracking-widest hover:bg-[#1e3610] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isSubmitting ? '送信中...' : '送信する'}
              </motion.button>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
};

// ---- App ----
export default function App() {
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState<Page>('home');

  useEffect(() => {
    const pageTitles: Record<Page, string> = {
      home: 'S＆S合同会社 | AI・CRMコンサルティング・構築・保守運用',
      concept: 'コンセプト | S＆S合同会社',
      service: 'サービス | S＆S合同会社 - AI・CRM導入支援',
      contact: 'お問い合わせ | S＆S合同会社',
    };
    document.title = pageTitles[activePage];
    window.scrollTo(0, 0);
  }, [activePage]);

  return (
    <div className="min-h-screen bg-[#f9f9f3] font-sans text-[#333] selection:bg-[#3a4a1d] selection:text-[#f9f9f3]">
      <AnimatePresence>
        {loading && <SplashScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          <Navbar activePage={activePage} navigate={setActivePage} />

          <main className="min-h-screen">
            <AnimatePresence mode="wait">
              {activePage === 'home' && <Home key="home" navigate={setActivePage} />}
              {activePage === 'concept' && <Concept key="concept" />}
              {activePage === 'service' && <Service key="service" navigate={setActivePage} />}
              {activePage === 'contact' && <Contact key="contact" />}
            </AnimatePresence>
          </main>

          <footer className="bg-[#0f1f07] text-[#f9f9f3] pt-20 pb-10 rounded-t-[2.5rem]">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid md:grid-cols-4 gap-12 mb-16 pb-12 border-b border-[#f9f9f3]/8">
                <div className="md:col-span-2 space-y-6">
                  <div className="inline-block bg-[#f9f9f3] p-5 rounded-2xl">
                    <BrandLogo size="small" />
                  </div>
                  <p className="text-sm leading-loose text-[#f9f9f3]/45 max-w-sm">
                    AI・CRMのコンサルティング・構築・保守運用を通じて、<br />
                    お客様のデジタル変革を一気通貫で支援します。
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-6 text-[#f9f9f3]/60 tracking-widest uppercase">Menu</h4>
                  <div className="flex flex-col gap-3 text-sm text-[#f9f9f3]/45">
                    {(['home', 'concept', 'service', 'contact'] as Page[]).map((p) => (
                      <button
                        key={p}
                        onClick={() => setActivePage(p)}
                        className="text-left hover:text-white hover:opacity-100 transition-all capitalize"
                      >
                        {p === 'home' ? 'Home' : p === 'concept' ? 'About' : p === 'service' ? 'Service' : 'Contact'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-6 text-[#f9f9f3]/60 tracking-widest uppercase">Contact</h4>
                  <div className="flex flex-col gap-3 text-sm text-[#f9f9f3]/45">
                    <p className="leading-relaxed">〒150-0043<br />東京都渋谷区道玄坂1丁目10番8号<br />渋谷道玄坂東急ビル2F−C</p>
                    <p>ssakaino@ss-and.com</p>
                    <button
                      onClick={() => setActivePage('contact')}
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
        </motion.div>
      )}
    </div>
  );
}
