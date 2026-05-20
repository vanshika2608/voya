const BASE = 'https://api.groq.com/openai/v1';
const KEY = process.env.GROQ_API_KEY;
const MODEL = 'llama-3.3-70b-versatile';

async function callLLM({ messages, stream = false, response_format, max_tokens = 4096 }) {
  const body = { model: MODEL, messages, stream, max_tokens, temperature: 0.7 };
  if (response_format) body.response_format = response_format;
  const res = await fetch(`${BASE}/chat/completions`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Groq error ${res.status}: ${txt.slice(0, 400)}`);
  }
  return res;
}

export async function streamChat({ messages }) {
  const res = await callLLM({ messages, stream: true });
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      let buffer = '';
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) continue;
            const data = trimmed.slice(5).trim();
            if (data === '[DONE]') { controller.close(); return; }
            try {
              const json = JSON.parse(data);
              const delta = json.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch {}
          }
        }
      } catch (e) {
        controller.error(e);
      } finally {
        controller.close();
      }
    },
  });
}

export async function chatJSON({ messages }) {
  const res = await callLLM({ messages, stream: false, response_format: { type: 'json_object' } });
  const json = await res.json();
  const content = json.choices?.[0]?.message?.content || '{}';
  try { return JSON.parse(content); } catch { return JSON.parse(content.replace(/```json|```/g, '').trim()); }
}