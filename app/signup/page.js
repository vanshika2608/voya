'use client';
import Link from 'next/link';
import Logo from '@/components/voya/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <div className="min-h-screen bg-bone gradient-mesh flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-block mb-10"><Logo /></Link>
        <div className="glass rounded-3xl shadow-glass p-10">
          <h1 className="font-display text-[36px] leading-tight text-ink">Begin your <em className="italic gradient-text">journey</em>.</h1>
          <p className="text-[14px] text-muted-foreground mt-1">Create your Voya account in seconds.</p>
          <form className="mt-8 space-y-4" onSubmit={(e) => { e.preventDefault(); setLoading(true); setTimeout(() => router.push('/dashboard'), 700); }}>
            <div className="space-y-2">
              <Label className="text-[13px] text-muted-foreground">Full name</Label>
              <Input required placeholder="Marcus Dane" className="h-11 rounded-xl bg-white/80 border-border/60" />
            </div>
            <div className="space-y-2">
              <Label className="text-[13px] text-muted-foreground">Email</Label>
              <Input type="email" required placeholder="hello@voya.com" className="h-11 rounded-xl bg-white/80 border-border/60" />
            </div>
            <div className="space-y-2">
              <Label className="text-[13px] text-muted-foreground">Password</Label>
              <Input type="password" required placeholder="At least 8 characters" className="h-11 rounded-xl bg-white/80 border-border/60" />
            </div>
            <Button disabled={loading} className="w-full h-11 rounded-xl bg-ink text-bone hover:bg-ink/90 mt-2">
              {loading ? 'Creating your space…' : <>Create account <ArrowRight className="ml-1 h-4 w-4" /></>}
            </Button>
          </form>
          <p className="text-[13px] text-muted-foreground text-center mt-6">
            Already have an account? <Link href="/signin" className="text-ink underline-offset-4 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
