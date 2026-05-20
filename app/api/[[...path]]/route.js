import { NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { streamChat, chatJSON } from '@/lib/llm';
import { createServerSupabaseClient } from '@/lib/supabase-server';

const SYSTEM_ASSISTANT = `You are Voya — a warm, brilliant, deeply experienced AI travel concierge.
You write like a thoughtful editor at a luxury travel magazine: concise, evocative, never generic.
Ask one clarifying question at a time when info is missing. Suggest specific neighborhoods, restaurants, and hidden gems.
Keep replies under 180 words unless the user asks for depth. Use markdown sparingly (no headings, occasional **bold**).
If the user is ready to commit, offer to generate a full itinerary.`;

const SYSTEM_ITINERARY = `You are an expert travel planner. Output ONLY valid JSON matching this exact schema:
{
  "destination": string,
  "summary": string (2-3 evocative sentences),
  "vibe": string (one phrase),
  "bestTimeNote": string,
  "weather": { "avgHigh": number, "avgLow": number, "condition": string },
  "budget": { "currency": "USD", "flights": number, "stay": number, "food": number, "activities": number, "total": number },
  "days": [
    {
      "day": number, "date": string, "title": string, "hero": string,
      "items": [ { "time": string, "title": string, "type": "stay|eat|see|move|rest", "details": string, "location": string, "cost": number } ]
    }
  ],
  "stays": [ { "name": string, "area": string, "vibe": string, "pricePerNight": number, "rating": number } ],
  "tips": [ string ]
}
Make it specific (real neighborhoods, real-sounding venues), elegant, and feasible. No code fences.`;

async function handle(request, { params }) {
  const resolvedParams = await params;
  const path = (resolvedParams?.path || []).join('/');
  const method = request.method;

  try {
    if (path === 'chat' && method === 'POST') {
      const { messages, sessionId } = await request.json();
      const fullMessages = [{ role: 'system', content: SYSTEM_ASSISTANT }, ...messages];
      const stream = await streamChat({ messages: fullMessages, model: 'gpt-4o-mini' });
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          'X-Session-Id': sessionId || uuid(),
        },
      });
    }

    if (path === 'itinerary' && method === 'POST') {
      const body = await request.json();
      const { destination, dates, budget, travelers, interests, style } = body;
      const userPrompt = `Plan a trip with these specs:
Destination: ${destination}
Dates: ${dates}
Budget (USD total): ${budget}
Travelers: ${travelers}
Interests: ${(interests || []).join(', ')}
Travel style: ${style}
Return the JSON itinerary.`;
      const data = await chatJSON({
        messages: [
          { role: 'system', content: SYSTEM_ITINERARY },
          { role: 'user', content: userPrompt },
        ],
        model: 'gpt-4o-mini',
      });
      const id = uuid();

      const supabase = await createServerSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();

      const doc = {
        id,
        user_id: user?.id || null,
        destination: data.destination,
        summary: data.summary,
        vibe: data.vibe,
        best_time_note: data.bestTimeNote,
        weather: data.weather,
        budget: data.budget,
        days: data.days,
        stays: data.stays,
        tips: data.tips,
        input: body,
        created_at: new Date().toISOString(),
      };

      try {
        const { error } = await supabase.from('trips').insert(doc);
        if (error) console.warn('supabase save failed', error.message);
      } catch (e) { console.warn('save failed', e?.message); }

      return NextResponse.json({ ...data, id });
    }

    if (path === 'trips' && method === 'GET') {
      try {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json([]);
        const { data: trips } = await supabase
          .from('trips')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);
        return NextResponse.json(trips || []);
      } catch {
        return NextResponse.json([]);
      }
    }

    if (path.startsWith('trips/') && method === 'GET') {
      const id = path.split('/')[1];
      try {
        const supabase = await createServerSupabaseClient();
        const { data: trip, error } = await supabase
          .from('trips')
          .select('*')
          .eq('id', id)
          .single();
        if (!trip || error) return NextResponse.json({ error: 'not found' }, { status: 404 });
        return NextResponse.json(trip);
      } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
      }
    }

    if (path === 'health' && method === 'GET') {
      return NextResponse.json({ ok: true, time: new Date().toISOString() });
    }

    return NextResponse.json({ error: 'not found', path }, { status: 404 });
  } catch (e) {
    console.error('API error', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const DELETE = handle;