'use client';
import Link from 'next/link';
import Image from 'next/image';
import Nav from '@/components/voya/Nav';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, MessageSquareText, Map, Wallet, CloudSun, Hotel, Plane, Star, Compass } from 'lucide-react';
import { useEffect, useState } from 'react';

const HERO = 'https://images.unsplash.com/photo-1542027162039-67cb61de57df?crop=entropy&cs=srgb&fm=jpg&q=85&w=2400';
const CARD1 = 'https://images.unsplash.com/photo-1697030131971-5d8889e5304d?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200';
const CARD2 = 'https://images.unsplash.com/photo-1758739824218-049eeab22d11?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200';
const CARD3 = 'https://images.unsplash.com/photo-1544621021-6dc694c44278?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200';
const CARD4 = 'https://images.pexels.com/photos/4472161/pexels-photo-4472161.jpeg?auto=compress&cs=tinysrgb&w=1200';
const CARD5 = 'https://images.pexels.com/photos/7079773/pexels-photo-7079773.jpeg?auto=compress&cs=tinysrgb&w=1200';

const features = [
  { icon: Sparkles, title: 'Itineraries that feel handcrafted', body: 'Not a generic list. A day-by-day plan tuned to your pace, taste and budget.' },
  { icon: MessageSquareText, title: 'A concierge in your pocket', body: 'Ask anything mid-trip. Voya answers in your tone, with local insight.' },
  { icon: Wallet, title: 'Budget that breathes', body: 'See where every dollar goes — from hotels to that perfect natural wine bar.' },
  { icon: CloudSun, title: 'Weather-aware suggestions', body: 'Rain on day three? Voya quietly reshuffles your plan. No anxiety.' },
  { icon: Hotel, title: 'Stays you’d save on Pinterest', body: 'Boutique hotels, hidden riads, design-forward rentals — not the obvious chain.' },
  { icon: Map, title: 'Maps that actually help', body: 'Walking routes, neighborhood logic, transit times — organized like a local.' },
];

const testimonials = [
  { quote: 'I gave it three lines about my anniversary. It came back with the most thoughtful five-day plan I’ve ever seen.', name: 'Hana K.', meta: 'Tokyo → Lisbon' },
  { quote: 'It feels less like an app and more like a friend who happens to know everything.', name: 'Marcus D.', meta: 'Copenhagen' },
  { quote: 'The first travel tool that doesn’t feel built by engineers who don’t travel.', name: 'Sofia A.', meta: 'Marrakech' },
];

const destinations = [
  { name: 'Kyoto', tag: 'Quiet temples, soft mornings', img: CARD1 },
  { name: 'Amalfi', tag: 'Lemon groves, slow lunches', img: CARD2 },
  { name: 'Banff', tag: 'Glacial silence', img: CARD3 },
  { name: 'Marrakech', tag: 'Spice and shadow', img: CARD4 },
];

function TypeLine({ text, delay = 0 }) {
  const [shown, setShown] = useState('');
  useEffect(() => {
    let i = 0;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setShown(text.slice(0, i));
        if (i >= text.length) clearInterval(iv);
      }, 18);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [text, delay]);
  return <span>{shown}</span>;
}

export default function Page() {
  return (
    <div className="relative min-h-screen bg-bone overflow-x-hidden">
      <Nav />

      {/* HERO */}
      <section className="relative pt-32 pb-24 md:pt-44 md:pb-32 gradient-mesh">
        <div className="container max-w-6xl relative">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass shadow-soft text-[12px] text-muted-foreground mb-8 animate-fade-in">
              <span className="h-1.5 w-1.5 rounded-full bg-sage animate-pulse-soft" />
              Powered by GPT, Claude & Gemini — unified.
            </div>
            <h1 className="font-display text-[56px] leading-[1.02] md:text-[88px] md:leading-[0.98] text-balance text-ink animate-fade-up">
              Travel, <em className="italic gradient-text">considered.</em>
              <br />Planned in minutes.
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-[1.55] text-muted-foreground text-balance animate-fade-up" style={{ animationDelay: '120ms' }}>
              Voya is your AI travel companion. Tell it where your head is at — it returns an itinerary you’d actually be proud to follow.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 animate-fade-up" style={{ animationDelay: '220ms' }}>
              <Link href="/plan"><Button size="lg" className="rounded-full h-12 px-7 bg-ink text-bone hover:bg-ink/90 text-[15px]">Plan my trip <ArrowRight className="ml-1 h-4 w-4" /></Button></Link>
              <Link href="/chat"><Button size="lg" variant="outline" className="rounded-full h-12 px-7 text-[15px] border-ink/15 hover:bg-ink/5">Try the assistant</Button></Link>
            </div>
          </div>

          {/* Hero visual */}
          <div className="mt-20 relative animate-fade-up" style={{ animationDelay: '320ms' }}>
            <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-[28px] overflow-hidden shadow-lift">
              <img src={HERO} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
              {/* floating glass card */}
              <div className="absolute left-4 bottom-4 md:left-8 md:bottom-8 max-w-sm glass rounded-2xl p-5 shadow-glass">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
                  <Sparkles className="h-3 w-3" /> Voya is composing
                </div>
                <p className="text-[14px] leading-[1.5] text-ink">
                  <TypeLine text="A six-day Kyoto plan with quiet mornings at Nanzen-ji, lunch at Sobakiri Yoshimura, and a slow walk through Gion at dusk — weather permitting." />
                  <span className="streaming-cursor" />
                </p>
              </div>
              <div className="hidden md:block absolute right-8 top-8 glass rounded-2xl p-4 shadow-glass w-56 animate-float">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Today</div>
                <div className="font-display text-[28px] text-ink leading-tight">Kyoto</div>
                <div className="text-[13px] text-muted-foreground mt-1">22° / 14° • light rain</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOGOS / SOCIAL PROOF */}
      <section className="py-8 border-y border-border/60">
        <div className="container max-w-6xl flex flex-wrap items-center justify-center gap-x-12 gap-y-3 text-[12px] uppercase tracking-[0.2em] text-muted-foreground">
          <span>Featured in Condé Nast</span><span className="opacity-40">•</span>
          <span>Monocle</span><span className="opacity-40">•</span>
          <span>The New York Times</span><span className="opacity-40">•</span>
          <span>Cereal</span><span className="opacity-40">•</span>
          <span>Kinfolk</span>
        </div>
      </section>

      {/* DEMO */}
      <section id="demo" className="py-28 md:py-36">
        <div className="container max-w-6xl grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-[12px] uppercase tracking-[0.2em] text-muted-foreground mb-4">The conversation</div>
            <h2 className="font-display text-[44px] md:text-[56px] leading-[1.02] text-ink text-balance">
              It doesn’t feel like a form. It feels like a <em className="italic gradient-text">conversation</em>.
            </h2>
            <p className="mt-5 text-[16px] text-muted-foreground leading-relaxed max-w-md">
              Tell Voya what you’re craving — a slow week, a foodie weekend, two weeks alone with a notebook. It listens, asks the right things, and writes back like a friend who travels well.
            </p>
            <Link href="/chat" className="inline-flex items-center gap-2 mt-7 text-[15px] text-ink hover:gap-3 transition-all">
              Open the assistant <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-3xl bg-white shadow-soft border border-border/60 p-6 space-y-4">
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-tr-md bg-ink text-bone px-4 py-3 text-[14px]">
                Slow week in Portugal in October. No big cities. Wine, water, walking.
              </div>
            </div>
            <div className="flex">
              <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-mist/60 px-4 py-3 text-[14px] leading-relaxed text-ink">
                Try the <b>Alentejo</b> coast — Comporta to Vila Nova de Milfontes. Cliff walks, salt marshes, and the kind of light October was made for. Want me to draft 7 days with two anchor stays?
              </div>
            </div>
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-tr-md bg-ink text-bone px-4 py-3 text-[14px]">Yes — around €3,500 for two.</div>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-muted-foreground pt-2">
              <Sparkles className="h-3 w-3" /> Drafting your itinerary…
            </div>
          </div>
        </div>
      </section>

      {/* DESTINATIONS STRIP */}
      <section className="py-12">
        <div className="container max-w-6xl">
          <div className="flex items-end justify-between mb-8">
            <h3 className="font-display text-[32px] md:text-[40px] text-ink leading-tight">A few places<br/>Voya loves right now.</h3>
            <Link href="/plan" className="text-[14px] text-muted-foreground hover:text-ink">Browse all →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {destinations.map((d) => (
              <div key={d.name} className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer">
                <img src={d.img} alt={d.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                <div className="absolute left-4 bottom-4 right-4">
                  <div className="font-display text-[24px] text-bone leading-tight">{d.name}</div>
                  <div className="text-[12px] text-bone/70">{d.tag}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-28 md:py-36">
        <div className="container max-w-6xl">
          <div className="max-w-2xl mb-16">
            <div className="text-[12px] uppercase tracking-[0.2em] text-muted-foreground mb-4">What’s inside</div>
            <h2 className="font-display text-[44px] md:text-[56px] leading-[1.02] text-ink text-balance">Quiet intelligence,<br/>everywhere you need it.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/60 rounded-3xl overflow-hidden border border-border/60">
            {features.map((f, i) => (
              <div key={f.title} className="bg-bone p-8 md:p-10 hover:bg-white transition-colors duration-500">
                <f.icon className="h-5 w-5 text-ink mb-6" strokeWidth={1.5} />
                <h3 className="font-display text-[24px] text-ink leading-tight mb-2">{f.title}</h3>
                <p className="text-[14px] text-muted-foreground leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-28 md:py-36 bg-mist/40">
        <div className="container max-w-6xl">
          <h2 className="font-display text-[40px] md:text-[56px] text-ink leading-[1.02] max-w-2xl mb-16 text-balance">
            Loved by people who hate <em className="italic gradient-text">travel apps</em>.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl bg-bone p-8 border border-border/60 hover:shadow-soft transition">
                <div className="flex gap-1 mb-4">{[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-ink/80 text-ink/80" />)}</div>
                <p className="text-[16px] leading-relaxed text-ink mb-6">“{t.quote}”</p>
                <div>
                  <div className="text-[14px] text-ink font-medium">{t.name}</div>
                  <div className="text-[13px] text-muted-foreground">{t.meta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28">
        <div className="container max-w-5xl">
          <div className="relative rounded-[32px] overflow-hidden p-12 md:p-20 text-center bg-ink text-bone">
            <div className="absolute inset-0 gradient-mesh opacity-40" />
            <div className="relative">
              <h2 className="font-display text-[44px] md:text-[64px] leading-[1.02] text-balance">Your next trip is already <em className="italic">waiting</em>.</h2>
              <p className="mt-5 text-[16px] text-bone/70 max-w-md mx-auto">Start with a sentence. Voya does the rest.</p>
              <Link href="/plan"><Button size="lg" className="mt-8 rounded-full h-12 px-7 bg-bone text-ink hover:bg-bone/90">Begin planning <ArrowRight className="ml-1 h-4 w-4" /></Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-border/60">
        <div className="container max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-muted-foreground">
          <div className="flex items-center gap-3"><Compass className="h-4 w-4" /> © 2025 Voya. Travel, considered.</div>
          <div className="flex gap-6"><a className="hover:text-ink" href="#">Privacy</a><a className="hover:text-ink" href="#">Terms</a><a className="hover:text-ink" href="#">Press</a></div>
        </div>
      </footer>
    </div>
  );
}
