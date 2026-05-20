'use client';
import Link from 'next/link';
import Logo from '@/components/voya/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowLeft, MapPin, Wallet, Heart, Compass, Calendar, Sparkles, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase';

const INTERESTS = ['Food', 'Art & Museums', 'Nature', 'Beaches', 'Nightlife', 'History', 'Hiking', 'Shopping', 'Wellness', 'Architecture', 'Wine', 'Coffee'];
const STYLES = [
  { id: 'slow', label: 'Slow & restorative', sub: 'Long mornings, fewer stops' },
  { id: 'classic', label: 'Classic explorer', sub: 'Balanced pace, must-sees' },
  { id: 'adventurous', label: 'Adventurous', sub: 'Active, off the path' },
  { id: 'luxury', label: 'Indulgent', sub: 'Comfort first, no compromises' },
];

export default function PlanPage() {
  const router = useRouter();
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) router.push('/signin');
    });
    }, []);
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    destination: '',
    dates: '',
    budget: 3500,
    travelers: 2,
    interests: [],
    style: 'classic',
  });
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState('');

  const toggleInterest = (i) => setData(d => ({ ...d, interests: d.interests.includes(i) ? d.interests.filter(x => x !== i) : [...d.interests, i] }));

  const next = () => setStep(s => Math.min(s + 1, 4));
  const back = () => setStep(s => Math.max(s - 1, 0));

  const generate = async () => {
    setLoading(true);
    const stages = ['Listening to your vibe…', 'Scanning the perfect neighborhoods…', 'Composing day-by-day rhythm…', 'Hand-picking stays and meals…', 'Polishing details…'];
    let i = 0;
    setStage(stages[0]);
    const iv = setInterval(() => { i = (i + 1) % stages.length; setStage(stages[i]); }, 1800);
    try {
      const res = await fetch('/api/itinerary', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error('Generation failed');
      const trip = await res.json();
      clearInterval(iv);
      router.push(`/itinerary?id=${trip.id}`);
    } catch (e) {
      clearInterval(iv);
      setLoading(false);
      toast.error('Could not generate. Please try again.');
    }
  };

  const steps = [
    { title: 'Where to?', sub: 'A city, country or vibe — Voya will figure it out.' },
    { title: 'When?', sub: 'Dates or rough timing both work.' },
    { title: 'Budget & company', sub: 'How much, how many.' },
    { title: 'What do you love?', sub: 'Pick a few. We’ll bias the plan accordingly.' },
    { title: 'Travel style', sub: 'Last detail — then we compose.' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-bone gradient-mesh flex flex-col items-center justify-center px-6">
        <div className="glass rounded-3xl p-12 max-w-lg w-full text-center shadow-glass">
          <div className="relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-clay via-sage to-ocean mb-6">
            <div className="absolute inset-1 rounded-full bg-bone" />
            <Sparkles className="relative h-6 w-6 text-ink animate-pulse-soft" />
          </div>
          <h2 className="font-display text-[36px] leading-tight text-ink">Composing your trip…</h2>
          <p className="text-muted-foreground text-[14px] mt-2 streaming-cursor">{stage}</p>
          <div className="mt-8 h-1 w-full bg-mist rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-ink animate-shimmer" style={{ backgroundImage: 'linear-gradient(90deg, transparent, #0A0A0A, transparent)', backgroundSize: '1000px 100%' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bone gradient-mesh">
      <div className="container max-w-3xl py-10">
        <div className="flex items-center justify-between mb-10">
          <Link href="/"><Logo /></Link>
          <div className="text-[12px] text-muted-foreground">Step {step + 1} of 5</div>
        </div>
        <div className="h-1 w-full bg-mist rounded-full mb-12 overflow-hidden">
          <div className="h-full bg-ink transition-all duration-500" style={{ width: `${((step + 1) / 5) * 100}%` }} />
        </div>

        <div key={step} className="animate-fade-up">
          <h1 className="font-display text-[44px] md:text-[56px] leading-[1.02] text-ink text-balance">{steps[step].title}</h1>
          <p className="text-muted-foreground mt-3 text-[16px]">{steps[step].sub}</p>

          <div className="mt-10">
            {step === 0 && (
              <div className="space-y-4">
                <Input autoFocus value={data.destination} onChange={(e) => setData({ ...data, destination: e.target.value })} placeholder="Lisbon, the Dolomites, Japan in spring…" className="h-14 text-[18px] rounded-2xl bg-white border-border/60 px-5" />
                <div className="flex flex-wrap gap-2">
                  {['Kyoto', 'Lisbon', 'Marrakech', 'Amalfi Coast', 'Banff', 'Mexico City'].map(p => (
                    <button key={p} onClick={() => setData({ ...data, destination: p })} className="text-[13px] px-3 py-1.5 rounded-full border border-border/60 hover:bg-ink hover:text-bone transition">{p}</button>
                  ))}
                </div>
              </div>
            )}
            {step === 1 && (
              <div className="space-y-4">
                <Input autoFocus value={data.dates} onChange={(e) => setData({ ...data, dates: e.target.value })} placeholder="e.g. Mid-October, 6 nights" className="h-14 text-[18px] rounded-2xl bg-white border-border/60 px-5" />
                <div className="flex flex-wrap gap-2">
                  {['Next weekend', 'In 2 weeks', 'October', 'Spring 2026', 'Flexible'].map(p => (
                    <button key={p} onClick={() => setData({ ...data, dates: p })} className="text-[13px] px-3 py-1.5 rounded-full border border-border/60 hover:bg-ink hover:text-bone transition">{p}</button>
                  ))}
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-8">
                <div>
                  <div className="flex items-baseline justify-between mb-3">
                    <div className="text-[13px] uppercase tracking-wider text-muted-foreground">Total budget</div>
                    <div className="font-display text-[40px] text-ink">${data.budget.toLocaleString()}</div>
                  </div>
                  <Slider value={[data.budget]} onValueChange={([v]) => setData({ ...data, budget: v })} min={500} max={20000} step={100} />
                  <div className="flex justify-between text-[11px] text-muted-foreground mt-2"><span>$500</span><span>$20k+</span></div>
                </div>
                <div>
                  <div className="text-[13px] uppercase tracking-wider text-muted-foreground mb-3">Travelers</div>
                  <div className="flex gap-2">
                    {[1,2,3,4,5,'6+'].map(n => (
                      <button key={n} onClick={() => setData({ ...data, travelers: typeof n === 'number' ? n : 6 })} className={`flex-1 h-12 rounded-xl border transition ${data.travelers === (typeof n === 'number' ? n : 6) ? 'bg-ink text-bone border-ink' : 'border-border/60 hover:border-ink/40'}`}>{n}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map(i => (
                  <button key={i} onClick={() => toggleInterest(i)} className={`px-4 py-2.5 rounded-full text-[14px] border transition ${data.interests.includes(i) ? 'bg-ink text-bone border-ink' : 'border-border/60 hover:border-ink/40'}`}>
                    {data.interests.includes(i) && '✓ '}{i}
                  </button>
                ))}
              </div>
            )}
            {step === 4 && (
              <div className="grid sm:grid-cols-2 gap-3">
                {STYLES.map(s => (
                  <button key={s.id} onClick={() => setData({ ...data, style: s.id })} className={`text-left p-5 rounded-2xl border transition ${data.style === s.id ? 'bg-ink text-bone border-ink' : 'bg-white border-border/60 hover:border-ink/40'}`}>
                    <div className="font-display text-[22px] leading-tight">{s.label}</div>
                    <div className={`text-[13px] mt-1 ${data.style === s.id ? 'text-bone/70' : 'text-muted-foreground'}`}>{s.sub}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-12 flex items-center justify-between">
            <Button variant="ghost" onClick={back} disabled={step === 0} className="rounded-full text-muted-foreground hover:text-ink">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            {step < 4 ? (
              <Button onClick={next} disabled={(step === 0 && !data.destination) || (step === 1 && !data.dates)} className="rounded-full h-11 px-6 bg-ink text-bone hover:bg-ink/90">
                Continue <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={generate} className="rounded-full h-11 px-6 bg-ink text-bone hover:bg-ink/90">
                <Sparkles className="mr-1 h-4 w-4" /> Compose itinerary
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
