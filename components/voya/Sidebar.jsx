'use client';
import Link from 'next/link';
import Logo from './Logo';
import { usePathname } from 'next/navigation';
import { Sparkles, Map, Compass, MessageSquareText, Calendar, Settings, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const items = [
  { href: '/dashboard', icon: Compass, label: 'Overview' },
  { href: '/plan', icon: Sparkles, label: 'Plan a trip' },
  { href: '/chat', icon: MessageSquareText, label: 'AI assistant' },
  { href: '/itinerary', icon: Map, label: 'Itineraries' },
  { href: '/dashboard?tab=upcoming', icon: Calendar, label: 'Upcoming' },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col h-screen sticky top-0 border-r border-border/60 bg-bone/60 backdrop-blur-xl px-4 py-6">
      <Link href="/" className="px-2 mb-8"><Logo /></Link>
      <Link href="/plan" className="mb-6">
        <Button className="w-full rounded-xl h-10 bg-ink text-bone hover:bg-ink/90 justify-start gap-2">
          <Plus className="h-4 w-4" /> New trip
        </Button>
      </Link>
      <nav className="flex flex-col gap-1">
        {items.map((it) => {
          const active = pathname === it.href.split('?')[0];
          const Icon = it.icon;
          return (
            <Link key={it.label} href={it.href} className={`flex items-center gap-3 px-3 py-2 rounded-xl text-[14px] transition ${active ? 'bg-ink/5 text-ink font-medium' : 'text-muted-foreground hover:text-ink hover:bg-ink/5'}`}>
              <Icon className="h-4 w-4" /> {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto">
        <div className="rounded-2xl p-4 bg-gradient-to-br from-mist via-bone to-mist border border-border/60">
          <div className="text-[12px] uppercase tracking-wider text-muted-foreground mb-1">Pro</div>
          <div className="font-display text-[18px] leading-tight text-ink mb-2">Unlock premium concierge</div>
          <Button variant="outline" size="sm" className="rounded-full text-[12px] h-8">Upgrade</Button>
        </div>
        <Link href="/settings" className="flex items-center gap-3 px-3 py-2 mt-4 rounded-xl text-[14px] text-muted-foreground hover:text-ink hover:bg-ink/5 transition">
          <Settings className="h-4 w-4" /> Settings
        </Link>
      </div>
    </aside>
  );
}
