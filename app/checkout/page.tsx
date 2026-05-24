'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Image from 'next/image';
import { useCartStore } from '@/stores/cartStore';
import Link from 'next/link';
import { CheckCircle, CreditCard, Truck, Shield, Lock, ChevronLeft, AlertCircle } from 'lucide-react';
import { trackInitiateCheckout, trackPurchase } from '@/components/pixels/PixelScripts';

const STEPS = [
  { n:1, label:'بيانات الشحن', icon: Truck },
  { n:2, label:'طريقة الدفع',  icon: CreditCard },
  { n:3, label:'التأكيد',       icon: CheckCircle },
];

const PAYMENT_METHODS = [
  {
    id:   'mada',
    label:'بطاقة مدى',
    sub:  'ادفع مباشرة من حسابك البنكي',
    note: 'مدعومة في جميع بنوك المملكة',
    icon: (
      <svg viewBox="0 0 60 24" className="h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="60" height="24" rx="4" fill="#00a651"/>
        <text x="30" y="17" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="sans-serif">mada</text>
      </svg>
    ),
  },
  {
    id:   'visa',
    label:'فيزا / ماستركارد',
    sub:  'Visa · Mastercard · Amex',
    note: 'مشفرة بـ SSL 256-bit',
    icon: (
      <div className="flex gap-1.5 items-center">
        <svg viewBox="0 0 48 16" className="h-5" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="16" rx="2" fill="#1a1f71"/>
          <text x="24" y="12" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="sans-serif" letterSpacing="0.5">VISA</text>
        </svg>
        <svg viewBox="0 0 32 20" className="h-5" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="10" r="10" fill="#eb001b"/>
          <circle cx="20" cy="10" r="10" fill="#f79e1b"/>
          <path d="M16 4.5a10 10 0 0 1 0 11A10 10 0 0 1 16 4.5z" fill="#ff5f00"/>
        </svg>
      </div>
    ),
  },
  {
    id:   'apple',
    label:'Apple Pay',
    sub:  'ادفع بسرعة وأمان',
    note: 'يتطلب جهاز Apple',
    icon: (
      <svg viewBox="0 0 50 20" className="h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="50" height="20" rx="4" fill="black"/>
        <text x="25" y="14" textAnchor="middle" fill="white" fontSize="8" fontFamily="-apple-system,sans-serif" fontWeight="500"> Pay</text>
        <path d="M8 6.5c.5-.6 1.3-1 2.1-.9.1.8-.3 1.6-.8 2.2-.5.6-1.2.9-1.9.9-.2-.8.2-1.6.6-2.2zm.6 3c-1.1 0-2.1.6-2.6.6-.6 0-1.4-.6-2.4-.5C2 9.7.8 10.4.2 11.6c-1.3 2.4-.3 5.9 1 7.8.6.9 1.4 1.9 2.3 1.9.9 0 1.3-.6 2.3-.6 1 0 1.4.6 2.3.6 1 0 1.7-1 2.3-1.9.7-1 1-2 1-2s-2-.8-2-2.9c0-1.9 1.6-2.8 1.6-2.8-1-.9-2.3-1.1-2.8-1.2z" fill="white" transform="scale(0.6) translate(2,3)"/>
      </svg>
    ),
  },
  {
    id:   'stc',
    label:'STC Pay',
    sub:  'محفظة STC الإلكترونية',
    note: 'مدفوعات فورية',
    icon: (
      <svg viewBox="0 0 50 20" className="h-5" xmlns="http://www.w3.org/2000/svg">
        <rect width="50" height="20" rx="4" fill="#7b2d8b"/>
        <text x="25" y="14" textAnchor="middle" fill="white" fontSize="8" fontFamily="sans-serif" fontWeight="bold">STC Pay</text>
      </svg>
    ),
  },
  {
    id:   'cod',
    label:'الدفع عند الاستلام',
    sub:  'ادفع نقداً عند وصول طلبك',
    note: 'متاح داخل ينبع',
    icon: <span className="text-2xl">💵</span>,
  },
];

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const [step,    setStep]    = useState(1);
  const [done,    setDone]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [form,    setForm]    = useState({
    name:'', phone:'', address:'', city:'', email:'', payment:'mada',
  });

  const subtotal = total();
  const shipping = subtotal >= 200 ? 0 : 25;
  const grand    = subtotal + shipping;
  const step1Valid = form.name && form.phone && form.address && form.city;

  // Track initiate checkout
  useEffect(() => {
    if (step === 2) trackInitiateCheckout(grand, items.length);
  }, [step]);

  const handleConfirm = async () => {
    setLoading(true);
    setStep(3);

    try {
      // Create order in backend
      const orderRes = await fetch('/api/orders', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            product_id:    i.product.id,
            product_name:  i.product.name,
            price_per_meter: i.product.price_per_meter,
            meters:        i.meters,
          })),
          shipping_address: {
            full_name: form.name,
            phone:     form.phone,
            address:   form.address,
            city:      form.city,
            email:     form.email,
          },
          payment_method: form.payment,
          total_amount:   grand,
        }),
      });

      const { order } = await orderRes.json();
      const id = order?.id || `ORD-${Date.now().toString().slice(-6)}`;
      setOrderId(id);

      // If Moyasar payment (not COD)
      if (form.payment !== 'cod') {
        const payRes = await fetch('/api/moyasar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: grand, orderId: id,
            description: `طلب ${id} — بن صديق للأقمشة`,
            source: { type: form.payment === 'apple' ? 'applepay' : form.payment === 'stc' ? 'stcpay' : 'creditcard' },
            callbackUrl: `${window.location.origin}/checkout/confirm`,
          }),
        });
        // In production: redirect to payment page or show iframe
        // const { payment } = await payRes.json();
      }

      // Track purchase pixel
      trackPurchase(grand, 'SAR', items.map(i => ({ item_name: i.product.name })));

      // Simulate processing (remove in production)
      await new Promise(r => setTimeout(r, 1500));

      clearCart();
      setDone(true);
    } catch {
      setLoading(false);
      setStep(2);
    }
  };

  if (done) return (
    <div className="min-h-screen flex flex-col" style={{ background:'var(--bs-pearl)' }}>
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="card max-w-md w-full p-10 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 animate-spin-in"
               style={{ background:'linear-gradient(135deg, #16a34a, #22c55e)' }}>
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl overflow-hidden bg-white/20 p-1">
            <Image src="/logo.png" alt="Bin Siddiq Fabric" width={64} height={64} className="object-contain" />
          </div>
          <h1 className="font-black text-2xl mb-3" style={{ color:'var(--bs-deep)' }}>
            تم تأكيد طلبك! 🎉
          </h1>
          <p className="text-gray-500 mb-3 text-sm leading-relaxed">
            شكراً لثقتك ببن صديق للأقمشة. سيتم التواصل معك خلال 24 ساعة.
          </p>
          <div className="p-3 rounded-xl mb-6" style={{ background:'rgba(139,0,0,0.06)' }}>
            <p className="text-xs" style={{ color:'var(--bs-silver)' }}>رقم الطلب</p>
            <p className="font-mono font-black text-lg" style={{ color:'var(--bs-deep)' }}>{orderId}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/products" className="btn-primary flex-1 justify-center text-sm">
              مواصلة التسوق
            </Link>
            <Link href="/orders" className="btn-secondary flex-1 justify-center text-sm">
              طلباتي
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background:'var(--bs-pearl)' }}>
      <Navbar />
      <main className="flex-1 page-container">
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link href="/cart" className="hover:opacity-70 transition-opacity flex items-center gap-1" style={{ color:'var(--bs-silver)' }}>
            <ChevronLeft className="w-3.5 h-3.5" /> السلة
          </Link>
          <span style={{ color:'var(--bs-silver)' }}>/</span>
          <span className="font-semibold" style={{ color:'var(--bs-deep)' }}>إتمام الشراء</span>
        </div>

        <h1 className="font-black text-2xl sm:text-3xl mb-8" style={{ color:'var(--bs-deep)' }}>إتمام الشراء</h1>

        {/* Progress */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.n} className="flex items-center flex-1">
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black transition-all duration-300"
                     style={{
                       background: step > s.n ? '#16a34a' : step === s.n ? 'var(--bs-grad)' : 'rgba(184,184,184,0.25)',
                       color:      step >= s.n ? 'white' : 'var(--bs-silver)',
                       boxShadow:  step === s.n ? '0 4px 14px rgba(227,24,55,0.35)' : 'none',
                     }}>
                  {step > s.n ? '✓' : s.n}
                </div>
                <span className="text-sm font-semibold hidden sm:block"
                      style={{ color: step >= s.n ? 'var(--bs-deep)' : 'var(--bs-silver)' }}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 mx-3 h-0.5 rounded-full transition-all duration-500"
                     style={{ background: step > s.n ? '#16a34a' : 'rgba(184,184,184,0.3)' }} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">

            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="card p-6 sm:p-8 animate-float-up">
                <div className="flex items-center gap-3 mb-6">
                  <Truck className="w-5 h-5" style={{ color:'var(--bs-vivid)' }} />
                  <h2 className="font-black text-xl" style={{ color:'var(--bs-deep)' }}>بيانات الشحن</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-bold mb-2" style={{ color:'var(--bs-deep)' }}>الاسم الكامل *</label>
                    <input className="input" placeholder="مثال: نورة أحمد الشمري" value={form.name} onChange={e => setForm({...form, name:e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color:'var(--bs-deep)' }}>رقم الجوال *</label>
                    <input className="input" placeholder="05XXXXXXXX" value={form.phone} onChange={e => setForm({...form, phone:e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color:'var(--bs-deep)' }}>البريد الإلكتروني</label>
                    <input className="input" type="email" placeholder="example@email.com" value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color:'var(--bs-deep)' }}>المدينة *</label>
                    <select className="input" value={form.city} onChange={e => setForm({...form, city:e.target.value})}>
                      <option value="">اختاري المدينة</option>
                      {['ينبع','جدة','مكة المكرمة','المدينة المنورة','الرياض','الدمام','الخبر','تبوك','أبها','نجران'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color:'var(--bs-deep)' }}>العنوان *</label>
                    <input className="input" placeholder="الحي، اسم الشارع..." value={form.address} onChange={e => setForm({...form, address:e.target.value})} />
                  </div>
                </div>
                <button onClick={() => setStep(2)} disabled={!step1Valid}
                  className="btn-primary w-full mt-6 py-4 text-base font-black justify-center">
                  التالي: طريقة الدفع ←
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="card p-6 sm:p-8 animate-float-up">
                <div className="flex items-center gap-3 mb-6">
                  <Lock className="w-5 h-5" style={{ color:'var(--bs-vivid)' }} />
                  <h2 className="font-black text-xl" style={{ color:'var(--bs-deep)' }}>طريقة الدفع الآمنة</h2>
                </div>

                <div className="space-y-3 mb-5">
                  {PAYMENT_METHODS.map(m => (
                    <label key={m.id}
                      className="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all"
                      style={{
                        borderColor: form.payment === m.id ? 'var(--bs-vivid)' : 'rgba(184,184,184,0.3)',
                        background:  form.payment === m.id ? 'rgba(227,24,55,0.04)' : 'white',
                      }}>
                      <input type="radio" name="payment" value={m.id} checked={form.payment===m.id}
                        onChange={e => setForm({...form, payment:e.target.value})} className="sr-only" />

                      <div className="flex-shrink-0 h-8 flex items-center">{m.icon}</div>

                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm" style={{ color:'var(--bs-dark)' }}>{m.label}</p>
                        <p className="text-xs mt-0.5" style={{ color:'var(--bs-silver)' }}>{m.sub}</p>
                        {m.note && <p className="text-[10px] mt-0.5 text-green-600 font-medium">{m.note}</p>}
                      </div>

                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                           style={{ borderColor: form.payment===m.id ? 'var(--bs-vivid)' : 'var(--bs-silver)' }}>
                        {form.payment===m.id && <div className="w-2.5 h-2.5 rounded-full" style={{ background:'var(--bs-vivid)' }} />}
                      </div>
                    </label>
                  ))}
                </div>

                {/* Security badge */}
                <div className="flex items-center gap-2.5 p-3 rounded-xl mb-5"
                     style={{ background:'rgba(139,0,0,0.04)', border:'1px solid rgba(139,0,0,0.1)' }}>
                  <Shield className="w-4 h-4 flex-shrink-0" style={{ color:'var(--bs-vivid)' }} />
                  <div>
                    <p className="text-xs font-bold" style={{ color:'var(--bs-deep)' }}>
                      مدفوعاتك محمية بالكامل
                    </p>
                    <p className="text-[10px] text-gray-500">
                      SSL 256-bit · PCI DSS Compliant · مدعوم من Moyasar وGeidea
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-secondary flex-1 py-4">← رجوع</button>
                  <button onClick={handleConfirm} disabled={loading}
                    className="btn-primary flex-1 py-4 text-base font-black justify-center">
                    {loading
                      ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />جاري المعالجة...</span>
                      : `تأكيد وادفع ${grand.toFixed(0)} ر.س`
                    }
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Processing */}
            {step === 3 && (
              <div className="card p-12 text-center animate-float-up">
                <div className="w-16 h-16 mx-auto mb-5 relative">
                  <div className="w-full h-full rounded-full border-4 animate-spin"
                       style={{ borderColor:'rgba(184,184,184,0.3)', borderTopColor:'var(--bs-vivid)' }} />
                </div>
                <p className="font-black text-lg" style={{ color:'var(--bs-deep)' }}>جاري معالجة طلبك...</p>
                <p className="text-sm text-gray-400 mt-2">لا تغلق الصفحة</p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="card p-6 h-fit sticky top-24">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/95 p-0.5">
                <Image src="/logo.png" alt="" width={32} height={32} className="object-contain" />
              </div>
              <h3 className="font-black text-base" style={{ color:'var(--bs-deep)' }}>ملخص الطلب</h3>
            </div>

            <div className="space-y-2.5 mb-4">
              {items.map(item => (
                <div key={item.product.id} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex-shrink-0"
                       style={{ background:`linear-gradient(135deg, ${item.selected_color?.hex||'#D41E2F'}, #8B0000)` }} />
                  <span className="text-xs flex-1 truncate text-gray-600">{item.product.name} ({item.meters}م)</span>
                  <span className="text-xs font-bold flex-shrink-0">{(item.product.price_per_meter*item.meters).toFixed(0)} ر.س</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 space-y-1.5 text-sm" style={{ borderColor:'rgba(184,184,184,0.2)' }}>
              <div className="flex justify-between text-gray-500"><span>الإجمالي الفرعي</span><span>{subtotal.toFixed(0)} ر.س</span></div>
              <div className="flex justify-between text-gray-500">
                <span>الشحن</span>
                <span className={shipping===0?'text-green-600 font-bold':''}>
                  {shipping===0 ? 'مجاني 🎉' : `${shipping} ر.س`}
                </span>
              </div>
            </div>

            <div className="flex justify-between font-black text-lg mt-3 pt-3 border-t"
                 style={{ borderColor:'rgba(184,184,184,0.2)', color:'var(--bs-deep)' }}>
              <span>الإجمالي الكلي</span>
              <span style={{ color:'var(--bs-vivid)' }}>{grand.toFixed(0)} ر.س</span>
            </div>

            {/* Payment logos */}
            <div className="mt-4 pt-3 border-t flex items-center gap-2 justify-center flex-wrap"
                 style={{ borderColor:'rgba(184,184,184,0.15)' }}>
              {['مدى','Visa','MC','Apple Pay','STC'].map(p => (
                <span key={p} className="text-[9px] px-2 py-1 rounded border font-bold text-gray-400"
                      style={{ borderColor:'rgba(184,184,184,0.3)' }}>{p}</span>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
