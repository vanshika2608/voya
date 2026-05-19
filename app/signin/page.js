'use client';
import Link from 'next/link';
import Logo from '@/components/voya/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <div className="min-h-screen bg-bone gradient-mesh flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-block mb-10"><Logo /></Link>
        <div className="glass rounded-3xl shadow-glass p-10">
          <h1 className="font-display text-[36px] leading-tight text-ink">Welcome back.</h1>
          <p className="text-[14px] text-muted-foreground mt-1">Sign in to your travel companion.</p>
          <form className="mt-8 space-y-4" onSubmit={(e) => { e.preventDefault(); setLoading(true); setTimeout(() => router.push('/dashboard'), 600); }}>
            <div className="space-y-2">
              <Label className="text-[13px] text-muted-foreground">Email</Label>
              <Input type="email" required placeholder="hello@voya.com" className="h-11 rounded-xl bg-white/80 border-border/60" />
            </div>
            <div className="space-y-2">
              <Label className="text-[13px] text-muted-foreground">Password</Label>
              <Input type="password" required placeholder="••••••••" className="h-11 rounded-xl bg-white/80 border-border/60" />
            </div>
            <Button disabled={loading} className="w-full h-11 rounded-xl bg-ink text-bone hover:bg-ink/90 mt-2">
              {loading ? 'Signing you in…' : <>Sign in <ArrowRight className="ml-1 h-4 w-4" /></>}
            </Button>
          </form>
          <div className="mt-6 flex items-center gap-3 text-[12px] text-muted-foreground">
            <div className="h-px bg-border flex-1" /> or <div className="h-px bg-border flex-1" />
          </div>
          <Button variant="outline" className="w-full h-11 rounded-xl mt-4 border-border/60 bg-white/60">Continue with Google</Button>
          <p className="text-[13px] text-muted-foreground text-center mt-6">
            New here? <Link href="/signup" className="text-ink underline-offset-4 hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
