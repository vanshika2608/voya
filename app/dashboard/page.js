'use client';
import Link from 'next/link';
import Sidebar from '@/components/voya/Sidebar';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Plus, MapPin, Calendar, TrendingUp, Plane } from 'lucide-react';
import { useEffect, useState } from 'react';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1697030131971-5d8889e5304d?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200';
const IMGS = [
  'https://images.unsplash.com/photo-1542027162039-67cb61de57df?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
  'https://images.unsplash.com/photo-1758739824218-049eeab22d11?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
  'https://images.unsplash.com/photo-1544621021-6dc694c44278?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200',
  'https://images.pexels.com/photos/4472161/pexels-photo-4472161.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/7079773/pexels-photo-7079773.jpeg?auto=compress&cs=tinysrgb&w=1200',
];

export default function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/trips').then(r => r.json()).then(d => { setTrips(Array.isArray(d) ? d : []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-bone">
      <Sidebar />
      <main className="flex-1 min-w-0">
        {/* top bar */}
        <div className="sticky top-0 z-20 bg-bone/80 backdrop-blur-xl border-b border-border/60 px-6 lg:px-10 py-4 flex items-center justify-between">
          <div>
            <div className="text-[12px] uppercase tracking-[0.2em] text-muted-foreground">Saturday</div>
            <h1 className="font-display text-[28px] text-ink leading-tight">Welcome back, Marcus.</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/chat"><Button variant="outline" className="rounded-full h-10 border-border/60 gap-2"><Sparkles className="h-4 w-4" /> Ask Voya</Button></Link>
            <Link href="/plan"><Button className="rounded-full h-10 bg-ink text-bone hover:bg-ink/90 gap-2"><Plus className="h-4 w-4" /> New trip</Button></Link>
          </div>
        </div>

        <div className="p-6 lg:p-10 space-y-10">
          {/* AI panel + stats */}
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 relative rounded-3xl overflow-hidden bg-ink text-bone p-8 md:p-10">
              <div className="absolute inset-0 gradient-mesh opacity-40" />
              <div className="relative max-w-lg">
                <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-bone/60 mb-4"><Sparkles className="h-3 w-3" /> Voya assistant</div>
                <h2 className="font-display text-[34px] md:text-[44px] leading-[1.05] text-balance">Your week looks light. <em className="italic">Shall we dream up</em> something?</h2>
                <p className="text-bone/70 text-[14px] mt-3 leading-relaxed">Three quiet days in Lisbon? A long weekend in the Dolomites? Tell me a mood, I’ll do the rest.</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {['Cozy autumn escape', 'Beach + culture, 5 days', 'Solo, under $1500'].map(s => (
                    <Link key={s} href={`/chat?q=${encodeURIComponent(s)}`} className="text-[12px] px-3 py-1.5 rounded-full bg-bone/10 hover:bg-bone/20 transition">{s}</Link>
                  ))}
                </div>
                <Link href="/chat"><Button className="mt-7 rounded-full h-10 bg-bone text-ink hover:bg-bone/90">Open assistant <ArrowRight className="ml-1 h-4 w-4" /></Button></Link>
              </div>
            </div>
            <div className="grid gap-5">
              <div className="rounded-3xl bg-white border border-border/60 p-6">
                <div className="flex items-center gap-2 text-[12px] uppercase tracking-wider text-muted-foreground mb-3"><TrendingUp className="h-3.5 w-3.5" /> Trips this year</div>
                <div className="font-display text-[44px] text-ink leading-none">{Math.max(trips.length, 7)}</div>
                <div className="text-[13px] text-muted-foreground mt-2">3 more than last year</div>
              </div>
              <div className="rounded-3xl bg-white border border-border/60 p-6">
                <div className="flex items-center gap-2 text-[12px] uppercase tracking-wider text-muted-foreground mb-3"><Plane className="h-3.5 w-3.5" /> Next departure</div>
                <div className="font-display text-[24px] text-ink leading-tight">Kyoto, Japan</div>
                <div className="text-[13px] text-muted-foreground mt-1">In 24 days • 6 nights</div>
              </div>
            </div>
          </div>

          {/* Saved trips */}
          <section>
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="text-[12px] uppercase tracking-[0.2em] text-muted-foreground">Your library</div>
                <h2 className="font-display text-[32px] text-ink leading-tight mt-1">Saved trips</h2>
              </div>
              <Link href="/plan" className="text-[14px] text-muted-foreground hover:text-ink">Plan another →</Link>
            </div>
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1,2,3].map(i => <div key={i} className="aspect-[4/5] rounded-2xl bg-mist animate-pulse" />)}
              </div>
            ) : trips.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {trips.map((trip, i) => (
                  <Link key={trip.id} href={`/itinerary?id=${trip.id}`} className="group relative aspect-[4/5] rounded-2xl overflow-hidden">
                    <img src={IMGS[i % IMGS.length]} alt={trip.destination} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                    <div className="absolute left-5 bottom-5 right-5">
                      <div className="text-[11px] uppercase tracking-[0.2em] text-bone/70 mb-1">{trip.vibe || 'Itinerary'}</div>
                      <div className="font-display text-[28px] text-bone leading-tight">{trip.destination}</div>
                      <div className="text-[13px] text-bone/80 mt-1 flex items-center gap-1"><Calendar className="h-3 w-3" /> {trip.days?.length || 0} days</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-border p-12 text-center">
      <div className="font-display text-[28px] text-ink leading-tight">No trips yet.</div>
      <p className="text-muted-foreground text-[14px] mt-2 max-w-sm mx-auto">Plan your first itinerary in under a minute. Voya will save it here.</p>
      <Link href="/plan"><Button className="mt-6 rounded-full bg-ink text-bone hover:bg-ink/90">Plan a trip <ArrowRight className="ml-1 h-4 w-4" /></Button></Link>
    </div>
  );
}
