import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Menu,
  X,
  Users,
  Layers,
  CheckCircle,
  Briefcase,
  Database,
  Code,
  MessageSquare,
  HelpCircle,
  Star,
  Zap,
  Target,
  Instagram,
  MapPin,
  User,
  Building
} from 'lucide-react';

// --- Types ---
type Page = 'home' | 'concept' | 'service' | 'case' | 'contact';

// --- Logo Component (with fallback) ---
const BrandLogo = ({ size = 'medium', showTagline = false }: { size?: 'small' | 'medium' | 'large', showTagline?: boolean }) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    small: { width: 'w-24', height: 'h-auto', text: 'text-xl', ruby: 'text-[6px] -top-2 -right-4' },
    medium: { width: 'w-40', height: 'h-auto', text: 'text-3xl', ruby: 'text-[8px] -top-3 -right-6' },
    large: { width: 'w-80', height: 'h-auto', text: 'text-6xl', ruby: 'text-xs -top-5 -right-10' },
  };
  const s = sizeClasses[size];

  // If image fails to load, show text-based logo
  if (imageError) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="relative inline-block">
          <h1 className={`font-serif font-bold text-[#3a4a1d] tracking-widest leading-none ${s.text}`}>S & S</h1>
          <span className={`absolute text-[#3a4a1d] font-sans font-bold tracking-widest whitespace-nowrap ${s.ruby}`}>
            エスアンドエス
          </span>
        </div>
        {showTagline && size === 'large' && (
          <div className="flex flex-col items-center w-full mt-2">
            <div className="w-full h-px bg-[#3a4a1d] my-2 opacity-80"></div>
            <p className="text-[#3a4a1d] font-sans font-bold tracking-tight uppercase whitespace-nowrap text-xs">
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
        className={`${s.width} ${s.height} object-contain`}
        onError={() => setImageError(true)}
      />
    </div>
  );
};

// --- Splash Screen Component ---
const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#f9f9f3]"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="scale-125 md:scale-150"
      >
        <BrandLogo size="large" showTagline={true} />
      </motion.div>
    </motion.div>
  );
};

// --- Navigation Component ---
const Navbar = ({ activePage, navigate }: { activePage: Page; navigate: (p: Page) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems: { id: Page; label: string }[] = [
    { id: 'home', label: 'ホーム' },
    { id: 'concept', label: 'コンセプト' },
    { id: 'service', label: 'サービス' },
    { id: 'case', label: '導入事例' },
    { id: 'contact', label: 'お問い合わせ' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-[#f9f9f3]/95 backdrop-blur-md border-b border-[#3a4a1d]/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <button onClick={() => navigate('home')} className="hover:opacity-80 transition-opacity">
            <BrandLogo size="small" showTagline={false} />
          </button>

          <div className="hidden md:flex space-x-10">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`text-sm font-medium tracking-wide transition-all duration-300 relative py-2 ${activePage === item.id
                  ? 'text-[#3a4a1d]'
                  : 'text-[#333333] hover:text-[#3a4a1d]'
                  }`}
              >
                {item.label}
                {activePage === item.id && (
                  <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3a4a1d]" />
                )}
              </button>
            ))}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#3a4a1d] p-2">
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
            <div className="px-6 pt-4 pb-8 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.id);
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 text-lg rounded-lg transition-colors ${activePage === item.id ? 'text-[#f9f9f3] bg-[#3a4a1d] font-bold' : 'text-[#333333] hover:bg-[#3a4a1d]/5'
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

// --- Page Components ---

const Home = ({ navigate }: { navigate: (p: Page) => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="pb-32"
  >
    {/* 1. Hero Section */}
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-32">
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-none stroke-[#3a4a1d] stroke-[0.3]">
          <path d="M-10 50 Q 25 20, 50 50 T 110 50" />
          <path d="M-10 60 Q 30 30, 60 60 T 110 60" />
          <path d="M-10 40 Q 20 80, 40 40 T 110 40" />
          <circle cx="80" cy="20" r="30" strokeDasharray="2 2" />
        </svg>
      </div>

      <div className="relative z-10 text-center max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-5xl md:text-8xl font-serif text-[#3a4a1d] mb-8 leading-tight font-medium">
            Organic Professional.<br />
            Timeless Trust.
          </h2>
          <div className="w-24 h-1 bg-[#3a4a1d] mx-auto mb-10 opacity-30"></div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-lg md:text-2xl text-[#333333] mb-16 max-w-3xl mx-auto leading-loose font-light"
        >
          戦略から実装まで。<br className="md:hidden" />
          確かな技術とお客様第一の姿勢で、<br />
          企業のCRM活用を次のステージへ。
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('service')}
          className="bg-[#3a4a1d] text-[#f9f9f3] px-10 py-4 text-lg rounded-full hover:bg-[#2d3a17] transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-3"
        >
          サービスを見る <ArrowRight size={20} />
        </motion.button>
      </div>
    </section>

    {/* 2. Introduction Section */}
    <section className="py-32 bg-white relative">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div className="order-2 md:order-1">
          <span className="text-[#3a4a1d] font-bold tracking-[0.2em] text-sm uppercase mb-6 block">Who We Are</span>
          <h3 className="text-4xl font-serif text-[#3a4a1d] mb-8 leading-tight">
            デジタル時代だからこそ、<br />有機的なつながりを。
          </h3>
          <p className="text-[#333333] leading-loose text-lg mb-8">
            テクノロジーは日々進化していますが、それを扱うのは「人」です。
            S&Sは、Salesforceをはじめとする最新のクラウド技術に精通したプロフェッショナル集団でありながら、
            何よりもクライアントとの「対話」と「信頼」を重視しています。
          </p>
          <button onClick={() => navigate('concept')} className="text-[#3a4a1d] font-bold border-b border-[#3a4a1d] pb-1 hover:opacity-70 transition-opacity">
            私たちの想い（コンセプト）へ
          </button>
        </div>
        <div className="order-1 md:order-2 bg-[#f9f9f3] h-96 rounded-3xl flex items-center justify-center relative overflow-hidden">
          <img src="/images/organic_connection.png" alt="Organic Connection" className="w-full h-full object-cover" />
        </div>
      </div>
    </section>

    {/* 3. Service Pickup */}
    <section className="py-32 max-w-7xl mx-auto px-6">
      <div className="text-center mb-20">
        <span className="text-[#3a4a1d] font-bold tracking-[0.2em] text-sm uppercase mb-4 block">What We Do</span>
        <h3 className="text-4xl font-serif text-[#3a4a1d]">Solutions</h3>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { icon: <Target size={32} />, title: "Consulting", desc: "現状分析から戦略策定まで" },
          { icon: <Database size={32} />, title: "Development", desc: "Salesforce・MAツールの実装" },
          { icon: <Users size={32} />, title: "Training", desc: "定着化支援とチーム育成" },
        ].map((item, i) => (
          <div key={i} className="bg-white p-10 rounded-2xl border border-[#3a4a1d]/10 hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('service')}>
            <div className="w-16 h-16 bg-[#3a4a1d]/5 rounded-full flex items-center justify-center text-[#3a4a1d] mb-6">
              {item.icon}
            </div>
            <h4 className="text-xl font-serif font-bold mb-4 text-[#333333]">{item.title}</h4>
            <p className="text-[#666] mb-6">{item.desc}</p>
            <span className="text-[#3a4a1d] text-sm font-bold flex items-center gap-2">More <ArrowRight size={14} /></span>
          </div>
        ))}
      </div>
    </section>

    {/* 4. News Section */}
    <section className="max-w-6xl mx-auto px-6 mb-32 pt-20 border-t border-[#3a4a1d]/10">
      <div className="flex flex-col md:flex-row items-start gap-8 md:gap-16">
        <h3 className="text-2xl font-serif text-[#3a4a1d] whitespace-nowrap px-4">Latest News</h3>
        <div className="flex flex-col gap-6 w-full">
          <div className="group flex flex-col md:flex-row gap-2 md:gap-8 cursor-pointer hover:bg-[#3a4a1d]/5 p-4 rounded transition-colors border-b border-[#3a4a1d]/5 pb-4">
            <span className="text-sm font-bold text-[#3a4a1d] opacity-60">2026.02.07</span>
            <span className="text-base text-[#333333] group-hover:text-[#3a4a1d] transition-colors">ホームページをリリースしました。</span>
            <span className="md:ml-auto text-xs border border-[#3a4a1d] text-[#3a4a1d] px-2 py-0.5 rounded-full w-fit">Info</span>
          </div>
          <div className="group flex flex-col md:flex-row gap-2 md:gap-8 cursor-pointer hover:bg-[#3a4a1d]/5 p-4 rounded transition-colors border-b border-[#3a4a1d]/5 pb-4">
            <span className="text-sm font-bold text-[#3a4a1d] opacity-60">2025.10.31</span>
            <span className="text-base text-[#333333] group-hover:text-[#3a4a1d] transition-colors">セールスフォース・ジャパンを卒業しました。</span>
            <span className="md:ml-auto text-xs border border-[#3a4a1d] text-[#3a4a1d] px-2 py-0.5 rounded-full w-fit">Press</span>
          </div>
        </div>
      </div>
    </section>
  </motion.div>
);

const Concept = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="w-full"
  >
    {/* Hero Area */}
    <div className="h-[60vh] flex items-center justify-center bg-[#3a4a1d] text-[#f9f9f3] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-white fill-none stroke-[0.2]">
          <circle cx="100" cy="100" r="50" />
          <circle cx="0" cy="0" r="50" />
        </svg>
      </div>
      <div className="text-center z-10 px-6">
        <span className="block text-sm tracking-[0.3em] mb-4 opacity-80 uppercase">Philosophy</span>
        <h2 className="text-5xl md:text-7xl font-serif font-bold">The 3 &quot;S&quot;</h2>
        <p className="mt-6 text-lg opacity-80 max-w-xl mx-auto">私たちが大切にする、3つの指針。</p>
      </div>
    </div>

    {/* The 3 S's - Expanded Vertical Layout */}
    <div className="max-w-7xl mx-auto px-6 py-32 space-y-32">

      {/* S1: Success */}
      <motion.div
        initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="grid md:grid-cols-2 gap-16 items-center min-h-[50vh]"
      >
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-[#3a4a1d]/10 h-full flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 text-[#3a4a1d]">
            <Star size={120} />
          </div>
          <span className="text-6xl font-serif text-[#3a4a1d] opacity-20 mb-4 font-bold">01</span>
          <h3 className="text-4xl font-serif text-[#3a4a1d] mb-6">Success<span className="text-lg ml-4 opacity-60 font-sans">成功</span></h3>
          <p className="text-lg leading-loose text-[#333333]">
            プロジェクトの完了はゴールではありません。<br />
            お客様のビジネスが実際に成長し、成果を生み出すことこそが、真の成功です。<br />
            私たちは常に「顧客の成功」を第一義に考えます。
          </p>
        </div>
        <div className="h-64 md:h-full bg-[#3a4a1d]/5 rounded-3xl flex items-center justify-center overflow-hidden">
          <img src="/images/growth_chart.png" alt="Growth Chart" className="w-full h-full object-cover" />
        </div>
      </motion.div>

      {/* S2: Strategy */}
      <motion.div
        initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="grid md:grid-cols-2 gap-16 items-center min-h-[50vh]"
      >
        <div className="order-2 md:order-1 h-64 md:h-full bg-[#3a4a1d]/5 rounded-3xl flex items-center justify-center overflow-hidden">
          <img src="/images/blueprint.png" alt="Blueprint" className="w-full h-full object-cover" />
        </div>
        <div className="order-1 md:order-2 bg-white p-12 rounded-3xl shadow-sm border border-[#3a4a1d]/10 h-full flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 text-[#3a4a1d]">
            <Target size={120} />
          </div>
          <span className="text-6xl font-serif text-[#3a4a1d] opacity-20 mb-4 font-bold">02</span>
          <h3 className="text-4xl font-serif text-[#3a4a1d] mb-6">Strategy<span className="text-lg ml-4 opacity-60 font-sans">戦略</span></h3>
          <p className="text-lg leading-loose text-[#333333]">
            場当たり的な対応ではなく、全体俯瞰に基づいた戦略を。<br />
            現状の課題分析から、あるべき姿（To-Be）の策定まで、<br />
            ロジカルかつ実現可能なロードマップを描きます。
          </p>
        </div>
      </motion.div>

      {/* S3: Synergy */}
      <motion.div
        initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="grid md:grid-cols-2 gap-16 items-center min-h-[50vh]"
      >
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-[#3a4a1d]/10 h-full flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 text-[#3a4a1d]">
            <Zap size={120} />
          </div>
          <span className="text-6xl font-serif text-[#3a4a1d] opacity-20 mb-4 font-bold">03</span>
          <h3 className="text-4xl font-serif text-[#3a4a1d] mb-6">Synergy<span className="text-lg ml-4 opacity-60 font-sans">相乗効果</span></h3>
          <p className="text-lg leading-loose text-[#333333]">
            S&Sという社名には、お客様との共創という意味も込められています。<br />
            私たちの技術と、お客様のビジネス知見。<br />
            二つが掛け合わさることで、想像以上の価値を生み出します。
          </p>
        </div>
        <div className="h-64 md:h-full bg-[#3a4a1d]/5 rounded-3xl flex items-center justify-center overflow-hidden">
          <img src="/images/handshake.png" alt="Handshake" className="w-full h-full object-cover" />
        </div>
      </motion.div>

    </div>

    {/* Company Info Section */}
    <section className="bg-white py-24 border-t border-[#3a4a1d]/10">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[#3a4a1d] font-bold tracking-[0.2em] text-sm uppercase mb-4 block">About</span>
          <h3 className="text-3xl md:text-5xl font-serif text-[#3a4a1d]">会社概要</h3>
        </div>

        <div className="bg-[#f9f9f3] rounded-3xl p-8 md:p-12">
          <div className="space-y-8">
            <div className="flex items-start gap-6 pb-6 border-b border-[#3a4a1d]/10">
              <div className="w-12 h-12 bg-[#3a4a1d]/10 rounded-full flex items-center justify-center text-[#3a4a1d] shrink-0">
                <Building size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#3a4a1d] mb-2">屋号</h4>
                <p className="text-xl text-[#333333] font-serif">S&S</p>
              </div>
            </div>

            <div className="flex items-start gap-6 pb-6 border-b border-[#3a4a1d]/10">
              <div className="w-12 h-12 bg-[#3a4a1d]/10 rounded-full flex items-center justify-center text-[#3a4a1d] shrink-0">
                <User size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#3a4a1d] mb-2">代表</h4>
                <p className="text-xl text-[#333333] font-serif">境野 竣介</p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-[#3a4a1d]/10 rounded-full flex items-center justify-center text-[#3a4a1d] shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#3a4a1d] mb-2">所在地</h4>
                <p className="text-xl text-[#333333] font-serif">フルリモート</p>
                <p className="text-sm text-[#666] mt-1">（目黒区周辺）</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Team Diagram */}
    <section className="bg-[#fff]/60 backdrop-blur-sm py-32 border-t border-[#3a4a1d]/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <h3 className="text-3xl md:text-5xl font-serif text-[#3a4a1d] mb-6">Team Structure</h3>
          <p className="text-lg text-[#666] tracking-wide">プロフェッショナルによる強固なネットワーク</p>
        </div>

        <div className="relative h-[600px] w-full max-w-4xl mx-auto flex items-center justify-center">
          {/* Connecting Lines - 3-way symmetrical */}
          <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-visible">
            {/* Line to top-left (Ex-Salesforce SE) */}
            <motion.line initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5 }} x1="50%" y1="50%" x2="15%" y2="20%" stroke="#3a4a1d" strokeWidth="2" strokeDasharray="4 4" />
            {/* Line to top-right (Partner PM) */}
            <motion.line initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5 }} x1="50%" y1="50%" x2="85%" y2="20%" stroke="#3a4a1d" strokeWidth="2" strokeDasharray="4 4" />
            {/* Line to bottom center (Specialist Dev) */}
            <motion.line initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1.5 }} x1="50%" y1="50%" x2="50%" y2="85%" stroke="#3a4a1d" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="50%" cy="50%" r="35%" stroke="#3a4a1d" strokeWidth="0.5" fill="none" strokeDasharray="8 8" className="opacity-20 animate-spin-slow" />
          </svg>

          {/* Center Node */}
          <div className="absolute z-20 w-48 h-48 rounded-full bg-[#3a4a1d] flex flex-col items-center justify-center text-[#f9f9f3] shadow-2xl border-4 border-[#f9f9f3]" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
            <span className="font-serif text-4xl font-bold mb-2">S&S</span>
            <span className="text-sm tracking-widest opacity-90">Core Team</span>
          </div>

          {/* Satellite Nodes - 3-way symmetrical positioning */}
          {/* Top-left: Ex-Salesforce SE */}
          <div className="absolute w-36 h-36 md:w-40 md:h-40 rounded-full bg-white border border-[#3a4a1d]/20 flex flex-col items-center justify-center text-[#3a4a1d] shadow-xl z-10 p-4 text-center" style={{ left: '15%', top: '20%', transform: 'translate(-50%, -50%)' }}>
            <Briefcase size={28} className="mb-2 opacity-80" />
            <span className="text-sm font-bold leading-tight">Ex-Salesforce<br />SE</span>
          </div>
          {/* Top-right: Partner PM */}
          <div className="absolute w-36 h-36 md:w-40 md:h-40 rounded-full bg-white border border-[#3a4a1d]/20 flex flex-col items-center justify-center text-[#3a4a1d] shadow-xl z-10 p-4 text-center" style={{ left: '85%', top: '20%', transform: 'translate(-50%, -50%)' }}>
            <Users size={28} className="mb-2 opacity-80" />
            <span className="text-sm font-bold leading-tight">Partner<br />PM</span>
          </div>
          {/* Bottom center: Specialist Dev */}
          <div className="absolute w-36 h-36 md:w-40 md:h-40 rounded-full bg-white border border-[#3a4a1d]/20 flex flex-col items-center justify-center text-[#3a4a1d] shadow-xl z-10 p-4 text-center" style={{ left: '50%', top: '85%', transform: 'translate(-50%, -50%)' }}>
            <Code size={28} className="mb-2 opacity-80" />
            <span className="text-sm font-bold leading-tight">Specialist<br />Dev</span>
          </div>
        </div>
      </div>
    </section>
  </motion.div>
);

const Service = () => {
  const steps = [
    {
      icon: <Layers size={48} />,
      title: "Strategy & Planning",
      sub: "戦略策定",
      desc: "現状の業務プロセスを可視化し、最適なCRM戦略を策定します。ツールの選定からKPI設計まで、成功へのロードマップを描きます。"
    },
    {
      icon: <Database size={48} />,
      title: "Implementation",
      sub: "実装・開発",
      desc: "Salesforceを中心としたクラウドソリューションの実装。アジャイル開発手法を用い、ビジネスの変化に強い柔軟なシステムを構築します。"
    },
    {
      icon: <CheckCircle size={48} />,
      title: "Onboarding & Growth",
      sub: "定着化・活用",
      desc: "導入後の定着化支援と継続的な改善。ユーザー教育やマニュアル作成、データ分析に基づくネクストアクションの提案を行います。"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="text-center mb-32">
          <span className="text-[#3a4a1d] font-bold tracking-[0.2em] text-sm uppercase mb-4 block">Our Service</span>
          <h2 className="text-5xl md:text-6xl font-serif text-[#3a4a1d]">Workflow</h2>
        </div>

        {/* Why Choose Us */}
        <div className="mb-40">
          <h3 className="text-3xl font-serif text-[#3a4a1d] mb-12 text-center border-b border-[#3a4a1d]/20 pb-4 inline-block mx-auto">Why S&S?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Speed", desc: "少数精鋭ならではの意思決定スピードと、アジャイルな開発体制。" },
              { title: "Quality", desc: "元Salesforce SEを中心とした、ベンダー認定資格保有者による高品質な実装。" },
              { title: "Flexibility", desc: "マニュアル通りの対応ではなく、お客様の状況に合わせた柔軟な提案。" }
            ].map((s, i) => (
              <div key={i} className="text-center p-8 bg-white rounded-2xl">
                <div className="text-[#3a4a1d] font-serif text-2xl font-bold mb-4">{s.title}</div>
                <p className="text-[#666] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow Steps */}
        <div className="space-y-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col md:flex-row items-center gap-12 p-12 bg-white rounded-3xl border border-[#3a4a1d]/5 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="shrink-0 w-32 h-32 rounded-full bg-[#f9f9f3] flex items-center justify-center text-[#3a4a1d]">
                {step.icon}
              </div>
              <div className="flex-1 text-center md:text-left">
                <span className="text-[#3a4a1d] font-bold opacity-50 block mb-2">STEP 0{index + 1}</span>
                <h3 className="text-3xl font-serif font-bold text-[#333333] mb-2">{step.title}</h3>
                <p className="text-sm font-bold text-[#3a4a1d] mb-6">{step.sub}</p>
                <p className="text-[#333333] leading-loose text-base opacity-80 max-w-2xl">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Case = () => {
  const cases = [
    { cat: "Salesforce", title: "大手製造業：営業プロセスの標準化と可視化", tag: "Strategy", image: "/images/manufacturing.png" },
    { cat: "MA Tool", title: "ITベンチャー：リードナーチャリングの自動化", tag: "Implementation", image: "/images/it_startup.png" },
    { cat: "CRM", title: "金融機関：顧客データ統合基盤の構築", tag: "Consulting", image: "/images/finance.png" },
    { cat: "Agentforce", title: "不動産販売：現場主導のモバイルCRM活用", tag: "Onboarding", image: "/images/real_estate.png" },
    { cat: "Data", title: "小売業：AIを活用した需要予測システムの導入", tag: "DX", image: "/images/retail.png" },
    { cat: "Agentforce", title: "通信業：コンタクトセンターのオムニチャネル化", tag: "Service", image: "/images/telecom.png" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-6 py-24 md:py-32"
    >
      <div className="text-center mb-24">
        <span className="text-[#3a4a1d] font-bold tracking-[0.2em] text-sm uppercase mb-4 block">Case Studies</span>
        <h2 className="text-5xl md:text-6xl font-serif text-[#3a4a1d] mb-8">Projects</h2>
        <p className="text-[#666] max-w-2xl mx-auto">様々な業界・業種におけるS&Sの導入支援実績をご紹介します。</p>
      </div>

      {/* Client Voice */}
      <div className="mb-32">
        <div className="bg-[#3a4a1d] text-[#f9f9f3] rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <MessageSquare size={200} />
          </div>
          <h3 className="text-3xl font-serif mb-12 relative z-10">Client Voice</h3>
          <div className="grid md:grid-cols-2 gap-12 relative z-10">
            <div className="bg-[#f9f9f3]/10 p-8 rounded-2xl backdrop-blur-sm">
              <p className="leading-loose mb-6 italic">導入前のコンサルティングから非常に丁寧で、自社の業務フローに完全にフィットしたシステムが完成しました。営業効率が昨対比で120%向上しています。</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#f9f9f3] rounded-full"></div>
                <div>
                  <div className="font-bold text-sm">製造業 営業部長</div>
                </div>
              </div>
            </div>
            <div className="bg-[#f9f9f3]/10 p-8 rounded-2xl backdrop-blur-sm">
              <p className="leading-loose mb-6 italic">システムを入れて終わりではなく、定着化まで伴走してくれたのが大きかったです。現場が使いこなせるようになるまで、粘り強くサポートしてくれました。</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#f9f9f3] rounded-full"></div>
                <div>
                  <div className="font-bold text-sm">不動産業 経営企画</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {cases.map((c, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white group cursor-pointer overflow-hidden rounded-[2rem] border border-[#3a4a1d]/10 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="h-64 bg-[#f9f9f3] flex items-center justify-center group-hover:scale-105 transition-transform duration-500 relative overflow-hidden">
              <img
                src={c.image}
                alt={c.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-10">
              <div className="flex gap-3 mb-4">
                <span className="text-xs font-bold text-[#f9f9f3] bg-[#3a4a1d] px-3 py-1 rounded-full">{c.cat}</span>
                <span className="text-xs text-[#666] border border-[#666]/30 px-3 py-1 rounded-full">{c.tag}</span>
              </div>
              <h3 className="text-xl font-bold text-[#333333] group-hover:text-[#3a4a1d] transition-colors leading-relaxed">{c.title}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({
    lastname: '',
    firstname: '',
    company: '',
    email: '',
    phone: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Create a hidden iframe for form submission
    const iframe = document.createElement('iframe');
    iframe.name = 'hidden_iframe';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Create a temporary form for submission
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://script.google.com/macros/s/AKfycbw1Us_NobvOU50BBvYsjI9eCucHxOqC3PICOU6rD9G-p2-ktS06wE4XySbsJKHvzqnj/exec';
    form.target = 'hidden_iframe';

    // Add form fields
    const fields = ['lastname', 'firstname', 'company', 'email', 'phone', 'description'];
    fields.forEach(field => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = field;
      input.value = formData[field as keyof typeof formData];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();

    // Clean up and show success after a short delay
    setTimeout(() => {
      document.body.removeChild(form);
      document.body.removeChild(iframe);
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        lastname: '',
        firstname: '',
        company: '',
        email: '',
        phone: '',
        description: ''
      });
    }, 2000);
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-6 py-24 md:py-32"
    >
      <div className="text-center mb-20">
        <span className="text-[#3a4a1d] font-bold tracking-[0.2em] text-sm uppercase mb-4 block">Get in Touch</span>
        <h2 className="text-5xl font-serif text-[#3a4a1d] mb-8">Contact</h2>
        <p className="text-[#333333] leading-loose">
          CRM導入、DX推進に関するご相談は、<br />
          下記フォームよりお気軽にお問い合わせください。<br />
          通常2営業日以内に担当者よりご連絡いたします。
        </p>
      </div>

      {/* FAQ Section - 上に配置 */}
      <div className="max-w-3xl mx-auto mb-32">
        <h3 className="text-2xl font-serif text-[#3a4a1d] text-center mb-12">FAQ</h3>
        <div className="space-y-6">
          {[
            { q: "プロジェクトの期間はどのくらいですか？", a: "プロジェクトの規模によりますが、最短で1ヶ月から対応可能です。大規模なプロジェクトでは、チームを組んで長期的なサポートも行っております。" },
            { q: "個人事業主ならではの強みは何ですか？", a: "大手にはないスピード感と柔軟な対応が強みです。意思決定が速く、お客様のご要望に迅速にお応えできます。また、中間マージンがないため、高品質なサービスを適正価格でご提供できます。" },
            { q: "Salesforce以外のご相談も可能ですか？", a: "はい、DX全般に精通しております。CRM/MAツール選定、業務フロー設計、データ活用戦略など、デジタル変革に関する幅広いご相談に対応可能です。" },
            { q: "AI活用についても相談できますか？", a: "はい、法人様向けにAI活用の講師・コンサルティングも行っております。ChatGPT/生成AIの業務活用、Agentforceの導入支援など、AIに関するお困りごともお気軽にご相談ください。" },
            { q: "保守・運用サポートのみの依頼も可能ですか？", a: "はい、可能です。既存システムの改修や定着化支援のみのプランもご用意しております。スポットでのご依頼も歓迎です。" }
          ].map((faq, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-[#3a4a1d]/10">
              <div className="flex gap-4 items-start mb-2">
                <HelpCircle className="text-[#3a4a1d] shrink-0 mt-1" size={20} />
                <h4 className="font-bold text-[#333333]">{faq.q}</h4>
              </div>
              <p className="pl-9 text-[#666] text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {submitStatus === 'success' ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#f0f5eb] p-10 md:p-16 rounded-[3rem] shadow-xl border-2 border-[#3a4a1d]/30 text-center"
        >
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-20 h-20 rounded-full bg-[#3a4a1d]/10 flex items-center justify-center mb-8">
              <CheckCircle className="w-10 h-10 text-[#3a4a1d]" />
            </div>
            <h3 className="text-2xl font-serif text-[#3a4a1d] mb-4">お問い合わせありがとうございます</h3>
            <p className="text-[#333333] leading-relaxed mb-2">
              ご入力いただいたメールアドレスに確認メールをお送りしました。
            </p>
            <p className="text-[#666] text-sm">
              2営業日以内に担当者よりご連絡いたします。<br />
              しばらくお待ちくださいませ。
            </p>
            <button
              onClick={() => setSubmitStatus('idle')}
              className="mt-8 text-[#3a4a1d] font-medium underline underline-offset-4 hover:opacity-70 transition-opacity"
            >
              新しいお問い合わせ
            </button>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className={`bg-white p-10 md:p-16 rounded-[3rem] shadow-xl border transition-all duration-300 space-y-10 ${submitStatus === 'error'
          ? 'border-red-300 bg-red-50/30'
          : 'border-[#3a4a1d]/10'
          }`}>
          {submitStatus === 'error' && (
            <div className="text-center text-red-700 text-sm pb-4 border-b border-red-200">
              送信に失敗しました。お手数ですが、もう一度お試しください。
            </div>
          )}
          {/* Form Fields */}
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <label className="block text-sm font-bold text-[#333333] mb-3 ml-2">姓 <span className="text-[#3a4a1d]">*</span></label>
              <input
                type="text"
                required
                value={formData.lastname}
                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                className="w-full bg-[#f9f9f3] border-b-2 border-[#3a4a1d]/20 rounded-t-lg p-4 focus:outline-none focus:border-[#3a4a1d] focus:bg-[#3a4a1d]/5 transition-colors"
                placeholder="山田"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#333333] mb-3 ml-2">名 <span className="text-[#3a4a1d]">*</span></label>
              <input
                type="text"
                required
                value={formData.firstname}
                onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                className="w-full bg-[#f9f9f3] border-b-2 border-[#3a4a1d]/20 rounded-t-lg p-4 focus:outline-none focus:border-[#3a4a1d] focus:bg-[#3a4a1d]/5 transition-colors"
                placeholder="太郎"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <label className="block text-sm font-bold text-[#333333] mb-3 ml-2">会社名</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full bg-[#f9f9f3] border-b-2 border-[#3a4a1d]/20 rounded-t-lg p-4 focus:outline-none focus:border-[#3a4a1d] focus:bg-[#3a4a1d]/5 transition-colors"
                placeholder="株式会社S&S"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#333333] mb-3 ml-2">電話番号</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#f9f9f3] border-b-2 border-[#3a4a1d]/20 rounded-t-lg p-4 focus:outline-none focus:border-[#3a4a1d] focus:bg-[#3a4a1d]/5 transition-colors"
                placeholder="03-1234-5678"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#333333] mb-3 ml-2">メールアドレス <span className="text-[#3a4a1d]">*</span></label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-[#f9f9f3] border-b-2 border-[#3a4a1d]/20 rounded-t-lg p-4 focus:outline-none focus:border-[#3a4a1d] focus:bg-[#3a4a1d]/5 transition-colors"
              placeholder="info@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#333333] mb-3 ml-2">お問い合わせ内容 <span className="text-[#3a4a1d]">*</span></label>
            <textarea
              rows={6}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#f9f9f3] border-b-2 border-[#3a4a1d]/20 rounded-t-lg p-4 focus:outline-none focus:border-[#3a4a1d] focus:bg-[#3a4a1d]/5 transition-colors"
              placeholder="ご相談内容をご記入ください"
            ></textarea>
          </div>
          <div className="text-center pt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto bg-[#3a4a1d] text-[#f9f9f3] px-16 py-5 rounded-full hover:bg-[#2d3a17] transition-all transform hover:scale-[1.02] font-bold tracking-widest shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '送信中...' : '送信する'}
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
};



// --- Main App Component ---
export default function App() {
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState<Page>('home');

  // Dynamic SEO title based on active page
  useEffect(() => {
    const pageTitles: Record<Page, string> = {
      home: 'S&S | Salesforce・DXコンサルティング | CRM導入・AI活用支援',
      concept: 'コンセプト | S&S - Success, Strategy, Synergy',
      service: 'サービス | S&S - Salesforce導入・DX推進・AI活用支援',
      case: '導入事例 | S&S - お客様の成功事例',
      contact: 'お問い合わせ | S&S - 無料相談受付中'
    };

    document.title = pageTitles[activePage];
    window.scrollTo(0, 0);
  }, [activePage]);

  return (
    <div className="min-h-screen bg-[#f9f9f3] font-sans text-[#333333] selection:bg-[#3a4a1d] selection:text-[#f9f9f3]">
      <AnimatePresence>
        {loading && <SplashScreen onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <Navbar activePage={activePage} navigate={setActivePage} />

          <main className="min-h-screen">
            <AnimatePresence mode="wait">
              {activePage === 'home' && <Home key="home" navigate={setActivePage} />}
              {activePage === 'concept' && <Concept key="concept" />}
              {activePage === 'service' && <Service key="service" />}
              {activePage === 'case' && <Case key="case" />}
              {activePage === 'contact' && <Contact key="contact" />}
            </AnimatePresence>
          </main>

          <footer className="bg-[#333333] text-[#f9f9f3] pt-24 pb-12 mt-20 rounded-t-[3rem]">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid md:grid-cols-4 gap-12 mb-20 border-b border-[#f9f9f3]/10 pb-12">
                <div className="md:col-span-2 space-y-8">
                  <div className="inline-block bg-[#f9f9f3] p-6 rounded-xl">
                    <BrandLogo size="medium" showTagline={true} />
                  </div>
                  <p className="text-sm leading-loose opacity-60 max-w-md">
                    Success（成功）、Strategy（戦略）、Synergy（相乗効果）。<br />
                    私たちは、お客様と共に持続可能な成長を実現するパートナーです。
                  </p>
                </div>

                <div>
                  <h4 className="font-serif text-lg mb-6 text-[#f9f9f3]/80">Menu</h4>
                  <div className="flex flex-col gap-4 text-sm opacity-60">
                    <button onClick={() => setActivePage('home')} className="text-left hover:text-white hover:opacity-100 transition-all">Home</button>
                    <button onClick={() => setActivePage('concept')} className="text-left hover:text-white hover:opacity-100 transition-all">Concept</button>
                    <button onClick={() => setActivePage('service')} className="text-left hover:text-white hover:opacity-100 transition-all">Service</button>
                    <button onClick={() => setActivePage('case')} className="text-left hover:text-white hover:opacity-100 transition-all">Projects</button>
                  </div>
                </div>

                <div>
                  <h4 className="font-serif text-lg mb-6 text-[#f9f9f3]/80">Contact</h4>
                  <div className="flex flex-col gap-4 text-sm opacity-60">
                    <p>フルリモート<br />（目黒区周辺）</p>
                    <p>ssakaino@ss-and.com</p>
                    <button onClick={() => setActivePage('contact')} className="text-left mt-2 underline hover:text-white hover:opacity-100 transition-all">
                      お問い合わせフォーム
                    </button>

                    {/* Instagram Link Added Here */}
                    <div className="pt-6 border-t border-[#f9f9f3]/10 mt-6">
                      <p className="mb-4 text-xs">Follow Us</p>
                      <a
                        href="https://www.instagram.com/ai_rakuchin/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#f9f9f3]/10 hover:bg-[#f9f9f3]/20 text-[#f9f9f3] transition-all"
                      >
                        <Instagram size={20} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs opacity-40">
                <p>© 2024 S&S Consulting. All Rights Reserved.</p>
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
