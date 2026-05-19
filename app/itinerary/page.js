'use client';
import Link from 'next/link';
import Sidebar from '@/components/voya/Sidebar';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, CloudSun, Wallet, Hotel, Sparkles, Calendar, Coffee, UtensilsCrossed, Camera, Bed, Bus, MoonStar, Star } from 'lucide-react';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const IMGS = [
  'https://images.unsplash.com/photo-1542027162039-67cb61de57df?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600',
  'https://images.unsplash.com/photo-1758739824218-049eeab22d11?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600',
  'https://images.unsplash.com/photo-1544621021-6dc694c44278?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600',
  'https://images.unsplash.com/photo-1697030131971-5d8889e5304d?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600',
];

const typeIcon = (t) => ({ eat: UtensilsCrossed, see: Camera, stay: Bed, move: Bus, rest: MoonStar }[t] || Sparkles);

function ItineraryInner() {
  const params = useSearchParams();
  const id = params.get('id');
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(1);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    fetch(`/api/trips/${id}`).then(r => r.json()).then(d => { setTrip(d); setLoading(false); setActiveDay(d.days?.[0]?.day || 1); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-bone">
        <Sidebar />
        <main className="flex-1 p-10 space-y-6">
          <div className="h-72 rounded-3xl bg-mist animate-pulse" />
          <div className="grid grid-cols-3 gap-4">{[1,2,3].map(i => <div key={i} className="h-32 rounded-2xl bg-mist animate-pulse" />)}</div>
          <div className="h-96 rounded-3xl bg-mist animate-pulse" />
        </main>
      </div>
    );
  }

  if (!trip || !id) {
    return (
      <div className="flex min-h-screen bg-bone">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center p-10">
          <div className="text-center max-w-md">
            <h1 className="font-display text-[40px] text-ink">No itinerary selected.</h1>
            <p className="text-muted-foreground mt-2">Plan your first trip to see it here.</p>
            <Link href="/plan"><Button className="mt-6 rounded-full bg-ink text-bone hover:bg-ink/90">Plan a trip <ArrowRight className="ml-1 h-4 w-4" /></Button></Link>
          </div>
        </main>
      </div>
    );
  }

  const hero = IMGS[(trip.days?.[0]?.day || 1) % IMGS.length];
  const day = trip.days?.find(d => d.day === activeDay) || trip.days?.[0];

  return (
    <div className="flex min-h-screen bg-bone">
      <Sidebar />
      <main className="flex-1 min-w-0">
        {/* HERO */}
        <section className="relative h-[420px] overflow-hidden">
          <img src={hero} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12 text-bone">
            <div className="text-[12px] uppercase tracking-[0.2em] text-bone/70 mb-2">{trip.vibe}</div>
            <h1 className="font-display text-[56px] md:text-[80px] leading-[0.98]">{trip.destination}</h1>
            <p className="max-w-xl mt-3 text-[15px] text-bone/80 leading-relaxed">{trip.summary}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button className="rounded-full h-10 bg-bone text-ink hover:bg-bone/90 gap-2">Book this trip <ArrowRight className="h-4 w-4" /></Button>
              <Link href="/chat"><Button variant="outline" className="rounded-full h-10 border-bone/30 text-bone bg-transparent hover:bg-bone/10">Refine with Voya</Button></Link>
            </div>
          </div>
        </section>

        {/* WIDGETS */}
        <section className="px-6 lg:px-12 -mt-12 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Widget icon={CloudSun} label="Weather" value={trip.weather ? `${trip.weather.avgHigh}° / ${trip.weather.avgLow}°` : '—'} sub={trip.weather?.condition || trip.bestTimeNote || ''} />
            <Widget icon={Wallet} label="Total budget" value={`$${(trip.budget?.total || 0).toLocaleString()}`} sub={`Flights $${trip.budget?.flights || 0} • Stay $${trip.budget?.stay || 0}`} />
            <Widget icon={Calendar} label="Length" value={`${trip.days?.length || 0} days`} sub={`${trip.days?.length ? trip.days.length - 1 : 0} nights`} />
            <Widget icon={Hotel} label="Stays" value={`${trip.stays?.length || 0} curated`} sub={trip.stays?.[0]?.name || ''} />
          </div>
        </section>

        {/* DAY TIMELINE */}
        <section className="px-6 lg:px-12 mt-14">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="text-[12px] uppercase tracking-[0.2em] text-muted-foreground">Itinerary</div>
              <h2 className="font-display text-[36px] text-ink leading-tight">Day by day</h2>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2 mb-6">
            {trip.days?.map(d => (
              <button key={d.day} onClick={() => setActiveDay(d.day)} className={`shrink-0 px-5 py-3 rounded-2xl border transition text-left min-w-[180px] ${activeDay === d.day ? 'bg-ink text-bone border-ink' : 'bg-white border-border/60 hover:border-ink/30'}`}>
                <div className={`text-[11px] uppercase tracking-wider ${activeDay === d.day ? 'text-bone/70' : 'text-muted-foreground'}`}>Day {d.day} • {d.date}</div>
                <div className="font-display text-[18px] leading-tight mt-1">{d.title}</div>
              </button>
            ))}
          </div>
          {day && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-3">
                <div className="rounded-3xl bg-white border border-border/60 p-6">
                  <div className="text-[12px] uppercase tracking-wider text-muted-foreground">Day {day.day} • {day.date}</div>
                  <h3 className="font-display text-[28px] text-ink leading-tight mt-1">{day.title}</h3>
                  <p className="text-[14px] text-muted-foreground mt-2">{day.hero}</p>
                </div>
                <div className="relative pl-6">
                  <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
                  {day.items?.map((it, i) => {
                    const Icon = typeIcon(it.type);
                    return (
                      <div key={i} className="relative pb-4">
                        <div className="absolute -left-[18px] top-4 h-3 w-3 rounded-full bg-ink ring-4 ring-bone" />
                        <div className="rounded-2xl bg-white border border-border/60 p-5 hover:shadow-soft transition">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 text-[12px] text-muted-foreground"><Icon className="h-3.5 w-3.5" /> {it.time}</div>
                              <div className="font-display text-[20px] text-ink leading-tight mt-1">{it.title}</div>
                              <div className="text-[13px] text-muted-foreground mt-1.5">{it.details}</div>
                              {it.location && <div className="text-[12px] text-muted-foreground mt-2 flex items-center gap-1"><MapPin className="h-3 w-3" /> {it.location}</div>}
                            </div>
                            {typeof it.cost === 'number' && it.cost > 0 && (
                              <div className="text-right shrink-0">
                                <div className="text-[11px] uppercase text-muted-foreground tracking-wider">est.</div>
                                <div className="font-display text-[18px] text-ink">${it.cost}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SIDE: map + stays */}
              <div className="space-y-5">
                <div className="rounded-3xl border border-border/60 overflow-hidden bg-mist h-72 relative">
                  <div className="absolute inset-0 gradient-mesh" />
                  <div className="absolute inset-0 flex items-center justify-center text-center">
                    <div>
                      <MapPin className="h-6 w-6 mx-auto text-ink/40 mb-2" />
                      <div className="text-[13px] text-muted-foreground">Interactive map</div>
                      <div className="text-[11px] text-muted-foreground/70 mt-1">Routes for Day {day.day}</div>
                    </div>
                  </div>
                  {/* mock pins */}
                  {day.items?.slice(0,4).map((_, i) => (
                    <div key={i} className="absolute h-7 w-7 rounded-full bg-ink text-bone flex items-center justify-center text-[11px] font-medium shadow-lift" style={{ left: `${20 + i*18}%`, top: `${30 + (i%2)*25}%` }}>{i+1}</div>
                  ))}
                </div>
                <div className="rounded-3xl bg-white border border-border/60 p-5">
                  <div className="flex items-center gap-2 text-[12px] uppercase tracking-wider text-muted-foreground mb-3"><Hotel className="h-3.5 w-3.5" /> Recommended stays</div>
                  <div className="space-y-3">
                    {(trip.stays || []).slice(0,3).map((s, i) => (
                      <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-bone/60 hover:bg-mist/60 transition">
                        <div className="min-w-0">
                          <div className="font-medium text-[14px] text-ink truncate">{s.name}</div>
                          <div className="text-[12px] text-muted-foreground truncate">{s.area} • {s.vibe}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="flex items-center gap-1 text-[12px] text-ink"><Star className="h-3 w-3 fill-ink" /> {s.rating || 4.8}</div>
                          <div className="text-[12px] text-muted-foreground">${s.pricePerNight}/n</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* TIPS + Budget */}
        <section className="px-6 lg:px-12 mt-14 mb-20 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl bg-white border border-border/60 p-6">
            <div className="text-[12px] uppercase tracking-wider text-muted-foreground mb-3">Voya’s notes</div>
            <ul className="space-y-3">
              {(trip.tips || []).map((t, i) => (
                <li key={i} className="flex gap-3 text-[14px] text-ink leading-relaxed">
                  <Sparkles className="h-4 w-4 mt-0.5 shrink-0 text-sage" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-ink text-bone p-6">
            <div className="text-[12px] uppercase tracking-wider text-bone/60 mb-2">Budget breakdown</div>
            <div className="font-display text-[44px] leading-none">${(trip.budget?.total || 0).toLocaleString()}</div>
            <div className="text-[12px] text-bone/60 mt-1">Estimated total • {trip.budget?.currency || 'USD'}</div>
            <div className="mt-6 space-y-3">
              {[['Flights', trip.budget?.flights], ['Stays', trip.budget?.stay], ['Food', trip.budget?.food], ['Activities', trip.budget?.activities]].map(([k, v]) => (
                <div key={k} className="flex justify-between text-[14px]"><span className="text-bone/70">{k}</span><span>${(v || 0).toLocaleString()}</span></div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Widget({ icon: Icon, label, value, sub }) {
  return (
    <div className="glass rounded-2xl p-5 shadow-glass">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground"><Icon className="h-3.5 w-3.5" /> {label}</div>
      <div className="font-display text-[26px] text-ink leading-tight mt-2">{value}</div>
      <div className="text-[12px] text-muted-foreground mt-1 truncate">{sub}</div>
    </div>
  );
}

export default function ItineraryPage() {
  return (<Suspense fallback={null}><ItineraryInner /></Suspense>);
}
