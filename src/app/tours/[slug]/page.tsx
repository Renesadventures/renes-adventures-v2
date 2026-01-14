"use client";
import React, { useState } from 'react';
import { Anchor, Luggage, CheckCircle2 } from 'lucide-react';

export default function TourPage() {
  const [activeVideo, setActiveVideo] = useState(`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/videos/hero/renes-custom-adventures.mp4`);
  const [guests, setGuests] = useState(4);
  const [addonQtys, setAddonQtys] = useState<{ [key: string]: number }>({});

  const basePrice = 400;
  const extraPassengerPrice = guests > 4 ? (guests - 4) * 75 : 0;
  
  const addonList = [
    { name: "Beach BBQ", price: 25 },
    { name: "BBQ Additional Guest", price: 15 },
    { name: "Snorkel Gear", price: 10 },
    { name: "Hol Chan Fee", price: 15, note: "$15.00 fee paid directly to the ranger at the time of boat entry" },
    { name: "Adult T-Shirt", price: 25 },
    { name: "Youth T-Shirt", price: 20 },
    { name: "XXL T-Shirt", price: 30 }
  ];

  const updateQty = (name: string, delta: number) => {
    setAddonQtys(prev => {
      const current = prev[name] || 0;
      if (current === 0 && delta > 0) return { ...prev, [name]: guests };
      return { ...prev, [name]: Math.max(0, current + delta) };
    });
  };

  const selectedAddons = addonList.filter(item => (addonQtys[item.name] || 0) > 0);
  const addonsTotal = selectedAddons.reduce((sum, item) => sum + (addonQtys[item.name] * item.price), 0);
  const grandTotal = basePrice + extraPassengerPrice + addonsTotal + (basePrice + extraPassengerPrice + addonsTotal) * 0.185;

  const activities = [
    { name: "PROMO", vid: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/videos/hero/renes-custom-adventures.mp4`, thumb: "https://images.unsplash.com/photo-1544551763-47a016066e53?w=400" },
    { name: "FISHING", vid: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/videos/hero/reef-fishing.mp4`, thumb: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400" },
    { name: "SNORKEL", vid: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/videos/hero/renes-custom-adventures.mp4`, thumb: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400" },
    { name: "BEACH BBQ", vid: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/videos/hero/beach-bbq.mp4`, thumb: "https://images.unsplash.com/photo-1583212292354-0837cc556eb2?w=400" }
  ];

  return (
    <main className="bg-[#000814] min-h-screen p-10 flex flex-col items-center font-sans text-white pt-24">
      <div className="flex justify-center gap-10 w-full max-w-7xl relative">
        
        {/* LEFT COLUMN: THE SOUL ENGINE */}
        <div className="w-[700px] flex flex-col gap-16">
          <div className="w-full h-[450px] rounded-[2rem] overflow-hidden border border-[#c5a059] shadow-2xl bg-black">
            <video key={activeVideo} autoPlay muted loop playsInline className="w-full h-full object-cover">
              <source src={activeVideo} type="video/mp4" />
            </video>
          </div>

          {/* Quick Clips Selector */}
          <div className="flex gap-4">
            {activities.map((act, i) => (
              <button key={i} onClick={() => setActiveVideo(act.vid)} className="flex-1 h-24 rounded-2xl border-2 border-[#c5a059]/40 relative overflow-hidden transition-all hover:border-[#c5a059]">
                <img src={act.thumb} className="w-full h-full object-cover opacity-50" alt="" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="text-[10px] font-black tracking-widest uppercase">{act.name}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Mosaic Overview */}
          <section className="bg-[#001d3d] rounded-[2.5rem] p-12 border border-[#c5a059]/20 relative">
            <div className="flex gap-10 items-center">
              <div className="flex-1 space-y-6">
                <h2 className="text-[#c5a059] text-4xl font-black uppercase tracking-tighter italic">Island Soul,<br/>Engineered for Wow.</h2>
                <p className="text-gray-400 leading-relaxed text-base font-light">
                  This isn&apos;t a scripted excursion. It&apos;s a private day on the water curated live—fast when you want adrenaline, slow when you want calm.
                </p>
              </div>
              <div className="w-64 h-64 rounded-3xl overflow-hidden border border-[#c5a059] rotate-3 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1544551763-47a016066e53?w=600" className="w-full h-full object-cover" alt="" />
              </div>
            </div>
          </section>

          {/* Fish Story Narrative */}
          <section className="bg-black/40 rounded-[2.5rem] p-12 border border-white/5">
             <h3 className="text-[#c5a059] text-xs font-black uppercase mb-4 tracking-widest">Fish Story</h3>
             <h2 className="text-3xl font-black mb-6">The moment the water explodes.</h2>
             <p className="text-gray-400 leading-relaxed italic text-sm">
                You feel the tap—then the line goes tight. The boat pivots. Someone shouts directions. Your heart spikes. The fish runs hard and the sea turns electric. That&apos;s Island Soul: calm luxury with sudden, cinematic action. You don&apos;t just catch fish—you collect stories you&apos;ll repeat for years.
             </p>
          </section>

          {/* The Flow Itinerary */}
          <section className="bg-gradient-to-br from-[#001d3d] to-[#000814] rounded-[2.5rem] p-12 border border-[#c5a059]/20">
            <h3 className="text-[#c5a059] text-xs font-black uppercase mb-10 tracking-widest text-center">Personalized itinerary. No rush.</h3>
            <div className="grid grid-cols-3 gap-8">
              {['Start', 'Peak', 'Finish'].map((stage, i) => (
                <div key={stage} className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center">
                   <div className="w-10 h-10 rounded-full bg-[#c5a059] text-black flex items-center justify-center font-black mx-auto mb-6">{i+1}</div>
                   <h4 className="font-black uppercase text-[#c5a059] text-xs mb-4">{stage}</h4>
                   <p className="text-xs text-gray-400 leading-relaxed">
                     {i === 0 && "Meet the crew & set priorities. Reef? Fishing? Food? We align the day to your vibe."}
                     {i === 1 && "Action blocks + iconic Belize moments. High-adrenaline or island calm—you decide."}
                     {i === 2 && "Slow down into sunset energy. Beach time, photos, and the last swim—no fixed checklist."}
                   </p>
                </div>
              ))}
            </div>
          </section>

          {/* Essentials Icon Grid */}
          <div className="grid grid-cols-2 gap-12 px-6 pb-20">
             <div className="space-y-8">
                <h4 className="text-[#c5a059] font-black uppercase text-sm tracking-widest flex items-center gap-3"><Luggage size={18}/> Essentials</h4>
                <ul className="space-y-4 text-sm text-gray-400">
                   <li className="flex items-center gap-4"><CheckCircle2 size={16} className="text-[#c5a059]"/> Reef-safe sunscreen</li>
                   <li className="flex items-center gap-4"><CheckCircle2 size={16} className="text-[#c5a059]"/> Swimwear & towel</li>
                   <li className="flex items-center gap-4"><CheckCircle2 size={16} className="text-[#c5a059]"/> Polarized sunglasses</li>
                </ul>
             </div>
             <div className="space-y-8">
                <h4 className="text-[#c5a059] font-black uppercase text-sm tracking-widest flex items-center gap-3"><Anchor size={18}/> Inclusions</h4>
                <ul className="space-y-4 text-sm text-gray-400">
                   <li className="flex items-center gap-4"><CheckCircle2 size={16} className="text-[#c5a059]"/> Gold standard crew</li>
                   <li className="flex items-center gap-4"><CheckCircle2 size={16} className="text-[#c5a059]"/> Ice, water & sodas</li>
                   <li className="flex items-center gap-4"><CheckCircle2 size={16} className="text-[#c5a059]"/> Core snorkel & fishing gear</li>
                </ul>
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STICKY LOCKDOWN */}
        <div className="w-[380px] flex-shrink-0">
          <div className="sticky top-28 flex flex-col gap-8">
            <div className="bg-[#001d3d] rounded-[2rem] border border-[#c5a059] p-8 pt-10 relative shadow-2xl">
              <h2 className="text-[#FFD700] text-[10px] font-black tracking-widest uppercase absolute -top-3 left-10 bg-[#001d3d] px-4 border border-[#c5a059] rounded-full">Adventure Add-Ons</h2>
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {addonList.map(item => (
                  <div key={item.name} className="flex flex-col border-b border-white/5 pb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] font-bold">{item.name} <span className="text-[#c5a059] ml-1">${item.price}</span></span>
                      <div className="flex items-center gap-3">
                        <button onClick={() => updateQty(item.name, -1)} className="bg-[#c5a059] w-7 h-7 rounded text-black font-black">-</button>
                        <span className="min-w-[15px] text-center font-black text-xs">{addonQtys[item.name] || 0}</span>
                        <button onClick={() => updateQty(item.name, 1)} className="bg-[#c5a059] w-7 h-7 rounded text-black font-black">+</button>
                      </div>
                    </div>
                    {item.note && <p className="text-[9px] text-[#c5a059]/70 mt-2 italic">{item.note}</p>}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#001d3d] rounded-[2rem] border border-[#c5a059] p-8 shadow-2xl">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-[#c5a059] text-[10px] font-black uppercase tracking-widest">Order Summary</h3>
                  <div className="flex items-center gap-4 bg-black/40 px-4 py-1 rounded-full border border-[#c5a059]/30">
                     <button onClick={() => setGuests(Math.max(1, guests - 1))} className="text-[#c5a059] font-black">-</button>
                     <span className="font-black text-xs">{guests} GUESTS</span>
                     <button onClick={() => setGuests(Math.min(8, guests + 1))} className="text-[#c5a059] font-black">+</button>
                  </div>
               </div>
               <div className="space-y-4 text-xs font-medium">
                  <div className="flex justify-between text-gray-400"><span>Base Charter</span><span>$400.00</span></div>
                  {guests > 4 && <div className="flex justify-between text-gray-400"><span>Extra Passengers</span><span>${extraPassengerPrice}.00</span></div>}
                  {selectedAddons.map(item => (
                    <div key={item.name} className="flex justify-between text-[#c5a059] pl-4 border-l border-[#c5a059]/20 italic">
                      <span>+ {item.name} (x{addonQtys[item.name]})</span>
                      <span>${addonQtys[item.name] * item.price}.00</span>
                    </div>
                  ))}
                  <div className="h-[1px] bg-[#c5a059]/20 my-6" />
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Total</span>
                     <span className="text-[#fbbf24] text-3xl font-black">${grandTotal.toFixed(2)}</span>
                  </div>
               </div>
               <button className="w-full mt-8 py-5 bg-[#fbbf24] hover:bg-[#c5a059] text-black font-black text-xs uppercase rounded-2xl transition-all shadow-xl tracking-widest">Proceed to Checkout</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
