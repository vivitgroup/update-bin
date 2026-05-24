'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { Search, Filter, ShoppingCart, SlidersHorizontal } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
const ChatWidget = dynamic(() => import('@/components/chat/ChatWidget'), { ssr: false });
import { useProductsStore } from '@/stores/productsStore';
import { Product } from '@/types';

const BS = { deep: '#8B1A1A', vivid: '#D41E2F', silver: '#B8B8B8', pearl: '#F7F5F2' };
const CATEGORIES = ['الكل', 'جورجيت', 'ساتان', 'شيفون', 'قطن', 'كريب', 'حرير', 'قطيفة', 'دانتيل'];

export default function ProductsPage() {
  const { getActive } = useProductsStore();
  const addItem = useCartStore((s) => s.addItem);
  const [search,    setSearch]    = useState('');
  const [category,  setCategory]  = useState('الكل');
  const [sortBy,    setSortBy]    = useState('default');
  const [addedIds,  setAddedIds]  = useState<Set<string>>(new Set());

  const allProducts = getActive();
  const filtered = allProducts
    .filter((p) => category === 'الكل' || p.category === category)
    .filter((p) => p.name.includes(search) || p.description.includes(search) || p.category.includes(search))
    .sort((a, b) => {
      if (sortBy === 'price-asc')  return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

  const handleAdd = (p: Product) => {
    addItem(p, 1);
    setAddedIds((s) => new Set([...Array.from(s), p.id]));
    setTimeout(() => setAddedIds((s) => { const n = new Set(Array.from(s)); n.delete(p.id); return n; }), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: BS.pearl }}>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-10 w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black" style={{ color: BS.deep }}>جميع المنتجات</h1>
            <p className="text-gray-500 mt-1">{filtered.length} منتج متاح من أصل {allProducts.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 mb-8 shadow-sm" style={{ border: `1px solid ${BS.silver}30` }}>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="ابحث عن قماش..." value={search}
                onChange={(e) => setSearch(e.target.value)} className="input pr-10" />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-wrap">
              <SlidersHorizontal className="w-4 h-4 flex-shrink-0" style={{ color: BS.silver }} />
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => setCategory(c)}
                  className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all"
                  style={{
                    backgroundColor: category === c ? BS.vivid : `${BS.silver}20`,
                    color:           category === c ? 'white'  : '#555',
                  }}>
                  {c}
                </button>
              ))}
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="input w-auto min-w-[160px]">
              <option value="default">الترتيب الافتراضي</option>
              <option value="price-asc">السعر: الأقل أولاً</option>
              <option value="price-desc">السعر: الأعلى أولاً</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <div key={p.id} className="card overflow-hidden group flex flex-col bg-white">
              <Link href={`/products/${p.id}`}>
                <div className="h-44 flex items-center justify-center relative overflow-hidden"
                     style={{ background: `linear-gradient(135deg, ${p.colors[0]?.hex || BS.vivid}, ${p.colors[1]?.hex || BS.deep})` }}>
                  <span className="text-8xl font-black text-white/10 select-none">Q</span>
                  <div className="absolute bottom-3 left-3 flex gap-1.5">
                    {p.colors.map((c) => (
                      <div key={c.hex} className="w-5 h-5 rounded-full border-2 border-white shadow"
                           style={{ backgroundColor: c.hex }} />
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                </div>
              </Link>
              <div className="p-5 flex flex-col flex-1">
                <p className="text-xs font-semibold mb-1" style={{ color: BS.vivid }}>{p.category}</p>
                <Link href={`/products/${p.id}`}>
                  <h3 className="font-bold text-lg mb-2 hover:opacity-70 transition-opacity"
                      style={{ color: BS.deep }}>{p.name}</h3>
                </Link>
                <p className="text-gray-500 text-sm mb-4 flex-1 line-clamp-2">{p.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black" style={{ color: BS.vivid }}>
                    {p.price}<span className="text-sm font-normal text-gray-400"> ر.س/م</span>
                  </span>
                  <span className={`badge ${p.stock_quantity > 50 ? 'badge-green' : p.stock_quantity > 0 ? 'badge-yellow' : 'badge-red'}`}>
                    {p.stock_quantity > 0 ? 'متوفر' : 'نفد'}
                  </span>
                </div>
                <button
                  onClick={() => handleAdd(p)}
                  disabled={p.stock_quantity === 0}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all duration-300"
                  style={{
                    background: addedIds.has(p.id) ? '#16a34a' : `linear-gradient(135deg, ${BS.deep}, ${BS.vivid})`,
                    color: 'white',
                  }}>
                  <ShoppingCart className="w-4 h-4" />
                  {addedIds.has(p.id) ? '✓ تمت الإضافة' : 'أضف للسلة'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-20" style={{ color: BS.silver }} />
            <p className="text-lg text-gray-500">لا توجد منتجات تطابق بحثك</p>
            <button onClick={() => { setSearch(''); setCategory('الكل'); }}
              className="mt-4 btn-outline">إعادة الضبط</button>
          </div>
        )}
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
