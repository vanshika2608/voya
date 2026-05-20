'use client';
import Link from 'next/link';
import Sidebar from '@/components/voya/Sidebar';
import { Button } from '@/components/ui/button';
import { ArrowUp, Sparkles, Plus, Compass } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import ReactMarkdown from 'react-markdown';
import { createClient } from '@/lib/supabase';


const SUGGESTIONS = [
  '7 days in Japan, slow pace, food-focused',
  'A romantic week in Lisbon under $4k',
  'Solo trip in Morocco, off the beaten path',
  'Long weekend in the Dolomites with hikes',
];

function ChatInner() {
  const params = useSearchParams();
  const router = useRouter();
  const initialQ = params.get('q') || '';
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) router.push('/signin');
    });
    }, []);
  useEffect(() => {
    if (initialQ && messages.length === 0) {
      send(initialQ);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  async function send(text) {
    const content = (text ?? input).trim();
    if (!content || sending) return;
    const newUser = { id: crypto.randomUUID(), role: 'user', content };
    const placeholder = { id: crypto.randomUUID(), role: 'assistant', content: '', streaming: true };
    const next = [...messages, newUser, placeholder];
    setMessages(next);
    setInput('');
    setSending(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.filter(m => !m.streaming).map(({ role, content }) => ({ role, content })) }),
      });
      if (!res.ok || !res.body) throw new Error('chat failed');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages(prev => prev.map(m => m.id === placeholder.id ? { ...m, content: acc } : m));
      }
      setMessages(prev => prev.map(m => m.id === placeholder.id ? { ...m, streaming: false } : m));
    } catch (e) {
      setMessages(prev => prev.map(m => m.id === placeholder.id ? { ...m, content: 'Sorry, something went wrong. Could you try again?', streaming: false } : m));
    } finally {
      setSending(false);
    }
  }

  const empty = messages.length === 0;

  return (
    <div className="flex min-h-screen bg-bone">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <div className="border-b border-border/60 px-6 lg:px-10 py-4 flex items-center justify-between bg-bone/80 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-clay via-sage to-ocean" />
            <div>
              <div className="text-[14px] font-medium text-ink">Voya</div>
              <div className="text-[11px] text-muted-foreground">Travel concierge • always on</div>
            </div>
          </div>
          <Button onClick={() => { setMessages([]); router.replace('/chat'); }} variant="outline" className="rounded-full h-9 border-border/60 gap-2 text-[13px]"><Plus className="h-3.5 w-3.5" /> New chat</Button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 lg:px-10 py-8">
          <div className="max-w-3xl mx-auto">
            {empty ? (
              <div className="py-20 text-center">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-clay via-sage to-ocean mb-6">
                  <Sparkles className="h-5 w-5 text-bone" />
                </div>
                <h2 className="font-display text-[40px] md:text-[52px] leading-[1.05] text-ink text-balance">Where are you <em className="italic gradient-text">dreaming</em> of?</h2>
                <p className="text-muted-foreground mt-3 max-w-md mx-auto">Tell me a sentence about your next trip. I’ll take it from there.</p>
                <div className="mt-10 grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                  {SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => send(s)} className="text-left p-4 rounded-2xl bg-white border border-border/60 hover:border-ink/30 hover:shadow-soft transition group">
                      <div className="text-[14px] text-ink leading-snug">{s}</div>
                      <div className="text-[12px] text-muted-foreground mt-1 flex items-center gap-1">Ask Voya <ArrowUp className="h-3 w-3 rotate-45 transition group-hover:translate-x-0.5" /></div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map(m => <Message key={m.id} m={m} />)}
              </div>
            )}
          </div>
        </div>

        {/* Composer */}
        <div className="border-t border-border/60 px-6 lg:px-10 py-5 bg-bone/80 backdrop-blur-xl">
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2 rounded-2xl bg-white border border-border/60 shadow-soft p-2 focus-within:ring-2 focus-within:ring-ink/10 transition">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                rows={1}
                placeholder="Tell Voya what you’re thinking…"
                className="flex-1 resize-none bg-transparent px-3 py-2.5 text-[15px] outline-none placeholder:text-muted-foreground max-h-40"
              />
              <Button type="submit" disabled={sending || !input.trim()} className="h-10 w-10 rounded-xl bg-ink text-bone hover:bg-ink/90 p-0 shrink-0">
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-[11px] text-muted-foreground mt-2 text-center">Voya may suggest places. Always verify openings and prices before booking.</div>
          </form>
        </div>
      </main>
    </div>
  );
}

function Message({ m }) {
  if (m.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-ink text-bone px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap">{m.content}</div>
      </div>
    );
  }
  return (
    <div className="flex gap-3">
      <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-clay via-sage to-ocean mt-1" />
      <div className="max-w-[85%]">
        <div className="text-[12px] text-muted-foreground mb-1">Voya</div>
        <div className="prose prose-sm max-w-none prose-strong:font-semibold prose-p:my-1">
            <ReactMarkdown>{m.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (<Suspense fallback={null}><ChatInner /></Suspense>);
}
