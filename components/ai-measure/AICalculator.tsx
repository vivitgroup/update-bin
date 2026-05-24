'use client';

import { useState } from 'react';
import { Sparkles, Info, ShoppingCart, Loader2 } from 'lucide-react';
import Link from 'next/link';

const BS = { deep: '#8B1A1A', vivid: '#D41E2F', silver: '#B8B8B8', pearl: '#F7F5F2' };

const DRESS_STYLES = [
  { id: 'fitted',      label: 'ضيق',          desc: 'يلتصق بالجسم تماماً' },
  { id: 'semi-fitted', label: 'نصف ضيق',       desc: 'فضفاض نسبياً' },
  { id: 'loose',       label: 'واسع',          desc: 'واسع ومريح' },
  { id: 'mermaid',     label: 'حورية البحر',   desc: 'ضيق ثم يتسع من الركبة' },
];

interface AIResult {
  estimated_meters: number;
  recommended_size: string;
  notes: string[];
}

export default function AICalculator() {
  const [height,     setHeight]     = useState(165);
  const [style,      setStyle]      = useState('fitted');
  const [hasPattern, setHasPattern] = useState(false);
  const [result,     setResult]     = useState<AIResult | null>(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');

  const handleCalculate = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch('/api/ai/calculate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ height_cm: height, dress_style: style, has_pattern: hasPattern }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'خطأ في الحساب');
      const data: AIResult = await res.json();
      setResult(data);
    } catch (e: any) {
      setError(e.message || 'حدث خطأ، حاولي مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="card p-8 shadow-xl" style={{ borderTop: `4px solid ${BS.vivid}` }}>

        {/* ── Inputs ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Height */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full" style={{ background: `linear-gradient(to bottom, ${BS.vivid}, ${BS.deep})` }} />
              <label className="font-semibold text-gray-700">الطول</label>
            </div>
            <input type="range" min={140} max={190} value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full mb-2" style={{ accentColor: BS.vivid }} />
            <div className="flex justify-between text-sm text-gray-400">
              <span>140 سم</span>
              <span className="text-2xl font-black" style={{ color: BS.deep }}>{height} سم</span>
              <span>190 سم</span>
            </div>
          </div>

          {/* Style */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 rounded-full" style={{ backgroundColor: BS.vivid }} />
              <label className="font-semibold text-gray-700">موديل الفستان</label>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {DRESS_STYLES.map((s) => (
                <button key={s.id} onClick={() => setStyle(s.id)}
                  className="p-3 rounded-xl border-2 text-center transition-all"
                  style={{
                    borderColor:     style === s.id ? BS.vivid : '#e5e7eb',
                    backgroundColor: style === s.id ? `${BS.vivid}10` : 'white',
                    color:           style === s.id ? BS.deep : '#374151',
                  }}>
                  <p className="font-bold text-sm">{s.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Pattern */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" checked={hasPattern} onChange={(e) => setHasPattern(e.target.checked)}
                  className="sr-only" />
                <div className="w-12 h-6 rounded-full transition-all duration-300"
                     style={{ backgroundColor: hasPattern ? BS.vivid : '#d1d5db' }}>
                  <div className="w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 m-0.5"
                       style={{ transform: hasPattern ? 'translateX(24px)' : 'translateX(0)' }} />
                </div>
              </div>
              <div>
                <span className="font-semibold text-gray-700">القماش له نقشة أو مربعات</span>
                <p className="text-xs text-gray-400">يُضاف 0.5 متر إضافي لمطابقة النقش</p>
              </div>
            </label>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 rounded-xl text-sm text-red-700 bg-red-50 border border-red-200">
            {error}
          </div>
        )}

        {/* Calculate button */}
        <button
          onClick={handleCalculate}
          disabled={loading}
          className="w-full py-5 rounded-xl text-xl font-black flex items-center justify-center gap-3 transition-all disabled:opacity-60"
          style={{
            background: `linear-gradient(135deg, ${BS.deep}, ${BS.vivid})`,
            color: 'white',
            boxShadow: `0 6px 24px ${BS.vivid}44`,
          }}
        >
          {loading
            ? <><Loader2 className="w-6 h-6 animate-spin" /> جاري الحساب...</>
            : <><Sparkles className="w-6 h-6" /> احسبي القماش</>
          }
        </button>

        {/* ── Result ── */}
        {result && (
          <div className="mt-8 animate-float-up">
            {/* Main numbers */}
            <div className="rounded-2xl p-6 mb-4"
                 style={{ background: `linear-gradient(135deg, ${BS.deep}08, ${BS.vivid}12)`, border: `2px solid ${BS.vivid}30` }}>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-500 mb-1">كمية القماش</p>
                  <p className="text-5xl font-black" style={{ color: BS.deep }}>{result.estimated_meters}</p>
                  <p className="text-gray-500 font-medium text-sm">متر</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">المقاس المقترح</p>
                  <p className="text-5xl font-black" style={{ color: BS.vivid }}>{result.recommended_size}</p>
                  <p className="text-gray-500 font-medium text-sm">مقاس</p>
                </div>
              </div>
            </div>

            {/* Notes from API */}
            {result.notes && result.notes.length > 0 && (
              <div className="rounded-xl p-4 mb-4 flex gap-3"
                   style={{ backgroundColor: `${BS.silver}20`, border: `1px solid ${BS.silver}50` }}>
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: BS.deep }} />
                <ul className="text-sm text-gray-600 space-y-1">
                  {result.notes.map((n, i) => <li key={i}>• {n}</li>)}
                </ul>
              </div>
            )}

            <Link
              href="/products"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl text-lg font-bold text-white transition-all hover:opacity-90"
              style={{ background: `linear-gradient(135deg, ${BS.deep}, ${BS.vivid})`, boxShadow: `0 4px 16px ${BS.vivid}44` }}
            >
              <ShoppingCart className="w-5 h-5" />
              تسوق الأقمشة الآن
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
