'use client';
import Link from 'next/link';
import Sidebar from '@/components/voya/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { toast } from 'sonner';
import { User, LogOut, Moon, Sun } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/signin');
    });
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setName(user?.user_metadata?.full_name || '');
    });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name }
    });
    if (error) toast.error('Could not save changes.');
    else toast.success('Profile updated!');
    setLoading(false);
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="flex min-h-screen bg-bone">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <div className="sticky top-0 z-20 bg-bone/80 backdrop-blur-xl border-b border-border/60 px-6 lg:px-10 py-4">
          <div className="text-[12px] uppercase tracking-[0.2em] text-muted-foreground">Account</div>
          <h1 className="font-display text-[28px] text-ink leading-tight">Settings</h1>
        </div>

        <div className="p-6 lg:p-10 max-w-2xl space-y-8">

          {/* Profile */}
          <div className="rounded-3xl bg-white border border-border/60 p-8">
            <div className="flex items-center gap-3 mb-6">
              <User className="h-5 w-5 text-ink" />
              <h2 className="font-display text-[24px] text-ink">Profile</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[13px] text-muted-foreground">Full name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} className="h-11 rounded-xl bg-bone border-border/60" />
              </div>
              <div className="space-y-2">
                <Label className="text-[13px] text-muted-foreground">Email</Label>
                <Input value={user?.email || ''} disabled className="h-11 rounded-xl bg-mist border-border/60 text-muted-foreground" />
              </div>
              <Button onClick={handleSave} disabled={loading} className="rounded-full bg-ink text-bone hover:bg-ink/90">
                {loading ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          </div>

          {/* Appearance */}
          <div className="rounded-3xl bg-white border border-border/60 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Sun className="h-5 w-5 text-ink" />
              <h2 className="font-display text-[24px] text-ink">Appearance</h2>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[15px] text-ink font-medium">Dark mode</div>
                <div className="text-[13px] text-muted-foreground mt-0.5">Switch to a darker interface</div>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative h-7 w-12 rounded-full transition-colors ${darkMode ? 'bg-ink' : 'bg-mist'}`}
              >
                <div className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          {/* Sign out */}
          <div className="rounded-3xl bg-white border border-border/60 p-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[15px] text-ink font-medium">Sign out</div>
                <div className="text-[13px] text-muted-foreground mt-0.5">{user?.email}</div>
              </div>
              <Button onClick={handleSignOut} variant="outline" className="rounded-full border-destructive/30 text-destructive hover:bg-destructive/5 gap-2">
                <LogOut className="h-4 w-4" /> Sign out
              </Button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}