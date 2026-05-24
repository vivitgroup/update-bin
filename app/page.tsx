'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { Calculator, Sparkles, Star, Truck, Shield, RefreshCw, ChevronLeft } from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

const ChatWidget      = dynamic(() => import('@/components/chat/ChatWidget'),      { ssr: false });
const WhatsAppButton  = dynamic(() => import('@/components/ui/WhatsAppButton'),     { ssr: false });
const CookieConsent   = dynamic(() => import('@/components/ui/CookieConsent'),      { ssr: false });
const VideoBanner  = dynamic(() => import('@/components/ui/VideoBanner'),    { ssr: false });

const FEATURED = [
  { id:'1', name:'قماش جورجيت فاخر',  price:85,  cat:'جورجيت', c1:'#8B0000', c2:'#5C0000', desc:'ناعم كالحرير، يسقط بأناقة على الجسم' },
  { id:'2', name:'قماش ساتان ملكي',    price:250, cat:'ساتان',   c1:'#D4AF37', c2:'#8B6914', desc:'بريق الأعراس والمناسبات الخاصة' },
  { id:'3', name:'قماش شيفون شفاف',    price:65,  cat:'شيفون',   c1:'#1E3A5F', c2:'#0A1E3A', desc:'خفيف كالهواء، مثالي للصيف' },
  { id:'6', name:'قماش حرير طبيعي',    price:450, cat:'حرير',    c1:'#B8B8B8', c2:'#888',    desc:'الفخامة في أجمل تجلياتها' },
];

const TRUST = [
  { icon: Truck,     text: 'شحن مجاني فوق 200 ر.س',   sub: 'لجميع مناطق المملكة' },
  { icon: Shield,    text: 'ضمان جودة 100%',           sub: 'أو استرداد كامل' },
  { icon: RefreshCw, text: 'إرجاع مجاني',              sub: 'خلال 14 يوم' },
  { icon: Star,      text: '+500 نوع قماش',            sub: 'تجدده أسبوعياً' },
];

const FEATURES = [
  { icon:'🧵', title:'أقمشة مختارة',  desc:'أكثر من 500 نوع من أفضل المصانع العالمية', color:'#E31837' },
  { icon:'🧮', title:'حاسبة ذكية',   desc:'احسبي كمية القماش المناسبة بدقة تامة',       color:'#8B0000' },
  { icon:'👗', title:'مصمم تفاعلي',  desc:'جربي الألوان على موديل واقعي قبل الشراء',    color:'#D4AF37' },
  { icon:'🤖', title:'مساعد ذكي',    desc:'سدى — مستشارتك للأقمشة على مدار الساعة',    color:'#C0C0C0' },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--bs-pearl)' }}>
      <Navbar />
      <main className="flex-1">

        {/* ═══════════════ HERO ═══════════════ */}
        <section
          className="relative overflow-hidden text-white"
          style={{ background: 'linear-gradient(135deg, #1C0A0A 0%, #3D0808 35%, #8B0000 65%, #E31837 100%)' }}
        >
          {/* Grid texture */}
          <div className="absolute inset-0 opacity-[0.04]"
               style={{ backgroundImage:'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 12px)', backgroundSize:'12px 12px' }} />
          {/* Glow blobs */}
          <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-15"
               style={{ background:'radial-gradient(circle, #E31837, transparent)' }} />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-10"
               style={{ background:'radial-gradient(circle, #D4AF37, transparent)' }} />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28 lg:py-36">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

              {/* Left: Text */}
              <div className="flex-1 text-center lg:text-right fade-up">
                {/* Real logo from upload */}
                <div className="inline-block mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-2xl blur-xl opacity-50"
                         style={{ background: '#E31837' }} />
                    <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden bg-white/95 p-1.5 shadow-2xl ring-2 ring-white/30">
                      <Image src="/logo.png" alt="Bin Siddiq Fabric" width={110} height={110}
                             className="w-full h-full object-contain" priority />
                    </div>
                  </div>
                </div>

                <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-5 fade-up-1"
                   style={{ background:'rgba(255,255,255,0.12)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.2)' }}>
                  <Star className="w-3.5 h-3.5 fill-current" style={{ color:'#D4AF37' }} />
                  أكثر من 10,000 عميلة سعيدة في المملكة
                </p>

                <h1 className="font-black leading-none mb-2 fade-up-2"
                    style={{ fontSize:'clamp(2.8rem,8vw,5.5rem)', fontFamily:'Georgia,serif' }}>
                  BIN SIDDIQ
                </h1>
                <h2 className="font-light tracking-[0.3em] uppercase mb-6 fade-up-2"
                    style={{ fontSize:'clamp(1rem,3vw,1.6rem)', color:'#E31837', letterSpacing:'0.3em', fontFamily:'Georgia,serif' }}>
                  FABRIC
                </h2>
                <p className="text-white/70 mb-8 max-w-lg mx-auto lg:mx-0 fade-up-3"
                   style={{ fontSize:'clamp(0.95rem,2vw,1.1rem)', lineHeight:1.8 }}>
                  أفضل الأقمشة الفاخرة في ينبع والمملكة العربية السعودية — نوصل لجميع المناطق
                </p>

                <div className="flex flex-col xs:flex-row gap-3 justify-center lg:justify-end fade-up-4">
                  <Link href="/products"
                    className="btn-primary text-base px-8 py-4 font-black shadow-xl">
                    تسوق الآن <ChevronLeft className="w-4 h-4" />
                  </Link>
                  <Link href="/dress-viewer"
                    className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition-all hover:bg-white/20"
                    style={{ background:'rgba(255,255,255,0.1)', border:'1.5px solid rgba(255,255,255,0.25)', color:'white', backdropFilter:'blur(8px)' }}>
                    ✨ صممي فستانك
                  </Link>
                </div>
              </div>

              {/* Right: Animated BS preview */}
              <div className="flex-shrink-0 fade-up-2 hidden md:flex flex-col items-center gap-3">
                {/* Logo + tagline */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-3xl blur-2xl opacity-20"
                       style={{ background:'radial-gradient(circle, #E31837, transparent)' }} />
                  <div className="relative w-52 h-52 lg:w-64 lg:h-64 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/15"
                       style={{ background:'rgba(255,255,255,0.06)', backdropFilter:'blur(4px)' }}>
                    <Image src="/logo.png" alt="Bin Siddiq Fabric Logo" width={256} height={256}
                           className="w-full h-full object-contain p-4" priority />
                  </div>
                </div>
                {/* Brand tagline */}
                <div className="text-center">
                  <p className="text-white/90 font-black tracking-widest text-sm uppercase" style={{ fontFamily:'Georgia,serif' }}>
                    BIN SIDDIQ FABRIC
                  </p>
                  <p className="text-xs tracking-[0.35em] uppercase font-semibold" style={{ color:'#E31837' }}>
                    PREMIUM QUALITY
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ VIDEO / CUTTING BANNER ═══════════════ */}
        <VideoBanner />

        {/* ═══════════════ TRUST BAR ═══════════════ */}
        <section className="bg-white border-b" style={{ borderColor:'rgba(184,184,184,0.2)' }}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-x-reverse"
                 style={{ borderColor:'rgba(184,184,184,0.2)' }}>
              {TRUST.map((t, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-5">
                  <t.icon className="w-5 h-5 flex-shrink-0" style={{ color:'var(--bs-vivid)' }} />
                  <div>
                    <p className="text-sm font-bold" style={{ color:'var(--bs-deep)' }}>{t.text}</p>
                    <p className="text-xs text-gray-400">{t.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ FEATURES ═══════════════ */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color:'var(--bs-vivid)' }}>
                لماذا بن صديق؟
              </p>
              <h2 className="section-title mb-2">تجربة تسوق استثنائية</h2>
              <div className="brand-divider mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {FEATURES.map((f, i) => (
                <div key={i} className="card p-7 text-center group cursor-default">
                  <div className="text-4xl mb-5 transition-transform duration-300 group-hover:scale-110 inline-block">
                    {f.icon}
                  </div>
                  <h3 className="font-black text-lg mb-2" style={{ color:'var(--bs-deep)' }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color:'#7a6e68' }}>{f.desc}</p>
                  <div className="mt-5 h-0.5 rounded-full transition-all duration-300 mx-8 opacity-0 group-hover:opacity-100"
                       style={{ background:`linear-gradient(to right, transparent, ${f.color}, transparent)` }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ FEATURED PRODUCTS ═══════════════ */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color:'var(--bs-vivid)' }}>
                  الأكثر مبيعاً
                </p>
                <h2 className="section-title">منتجات مميزة</h2>
              </div>
              <Link href="/products" className="hidden md:flex items-center gap-1.5 text-sm font-bold hover:opacity-70 transition-opacity"
                    style={{ color:'var(--bs-deep)' }}>
                عرض الكل <ChevronLeft className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {FEATURED.map((p) => (
                <Link key={p.id} href={`/products/${p.id}`} className="card overflow-hidden group block">
                  <div className="h-44 relative overflow-hidden"
                       style={{ background:`linear-gradient(135deg, ${p.c1}, ${p.c2})` }}>
                    <div className="absolute inset-0 opacity-10"
                         style={{ backgroundImage:'repeating-linear-gradient(45deg,#fff 0,#fff 0.5px,transparent 0,transparent 8px)', backgroundSize:'8px 8px' }} />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                    {/* Logo watermark */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <Image src="/logo.png" alt="" width={80} height={80} className="object-contain filter invert" />
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span className="badge badge-silver text-[10px] backdrop-blur-sm bg-white/80">{p.cat}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-black text-base mb-1 leading-snug" style={{ color:'var(--bs-dark)' }}>{p.name}</h3>
                    <p className="text-xs mb-4 leading-relaxed" style={{ color:'#7a6e68' }}>{p.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xl" style={{ color:'var(--bs-vivid)' }}>
                        {p.price}<span className="text-xs font-normal mr-0.5" style={{ color:'var(--bs-silver)' }}> ر.س/م</span>
                      </span>
                      <span className="badge badge-green">متوفر</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8 md:hidden">
              <Link href="/products" className="btn-outline inline-flex items-center gap-2">
                عرض جميع المنتجات <ChevronLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════ CTA ═══════════════ */}
        <section className="py-16 md:py-24 relative overflow-hidden"
                 style={{ background:'linear-gradient(135deg, #1C0A0A 0%, #8B0000 50%, #E31837 100%)' }}>
          <div className="absolute inset-0 opacity-[0.04]"
               style={{ backgroundImage:'repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 0,transparent 40px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 0,transparent 40px)' }} />
          <div className="relative max-w-3xl mx-auto px-4 text-center text-white">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl overflow-hidden bg-white/10 p-2">
              <Image src="/logo.png" alt="Bin Siddiq Fabric" width={80} height={80} className="w-full h-full object-contain" />
            </div>
            <h2 className="font-black mb-4" style={{ fontSize:'clamp(1.8rem,5vw,3rem)', fontFamily:'Georgia,serif' }}>
              صممي فستانك قبل ما تشتري
            </h2>
            <p className="text-white/70 mb-8 text-base md:text-lg" style={{ lineHeight:1.8 }}>
              اختاري لون قماشك، موديل فستانك، ولون بشرتك — وشوفي النتيجة فوراً
            </p>
            <div className="flex flex-col xs:flex-row gap-3 justify-center">
              <Link href="/dress-viewer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-base transition-all hover:opacity-90"
                style={{ background:'white', color:'var(--bs-deep)' }}>
                <Sparkles className="w-5 h-5" style={{ color:'#E31837' }} />
                مصمم الفستان
              </Link>
              <Link href="/ai-measure"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-base transition-all hover:bg-white/20"
                style={{ background:'rgba(255,255,255,0.12)', border:'1.5px solid rgba(255,255,255,0.3)', color:'white' }}>
                <Calculator className="w-5 h-5" />
                حاسبة القماش
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
      <ChatWidget />
      <WhatsAppButton />
      <CookieConsent />
    </div>
  );
}
