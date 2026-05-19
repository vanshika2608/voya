'use client';
import Link from 'next/link';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'pt-2' : 'pt-4'}`}>
      <div className={`container max-w-6xl transition-all duration-500`}>
        <div className={`flex items-center justify-between px-5 py-3 rounded-full transition-all duration-500 ${scrolled ? 'glass shadow-soft' : ''}`}>
          <Link href="/"><Logo /></Link>
          <nav className="hidden md:flex items-center gap-8 text-[14px] text-muted-foreground">
            <Link href="/#features" className="hover:text-ink transition">Features</Link>
            <Link href="/#demo" className="hover:text-ink transition">Demo</Link>
            <Link href="/#testimonials" className="hover:text-ink transition">Stories</Link>
            <Link href="/dashboard" className="hover:text-ink transition">Dashboard</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/signin" className="hidden sm:block text-[14px] text-muted-foreground hover:text-ink transition px-3">Sign in</Link>
            <Link href="/plan">
              <Button className="rounded-full h-9 px-4 text-[13px] bg-ink text-bone hover:bg-ink/90">Start planning</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
