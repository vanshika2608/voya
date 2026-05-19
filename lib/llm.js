// Server-only LLM client for Emergent Universal LLM Key
// Supports streaming chat + non-streaming JSON for itinerary generation.
import 'server-only';

const BASE = 'https://integrations.emergentagent.com/llm/v1';
const KEY = process.env.EMERGENT_LLM_KEY;

async function callLLM({ model, messages, stream = false, temperature = 0.7, max_tokens = 2048, response_format }) {
  const body = { model, messages, temperature, max_tokens, stream };
  if (response_format) body.response_format = response_format;
  const res = await fetch(`${BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`LLM error ${res.status}: ${txt.slice(0, 400)}`);
  }
  return res;
}

// Returns a ReadableStream of plain text deltas
export async function streamChat({ messages, model = 'gpt-4o-mini' }) {
  const res = await callLLM({ model, messages, stream: true });
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
            if (!trimmed || !trimmed.startsWith('data:')) continue;
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

export async function chatJSON({ messages, model = 'gpt-4o-mini' }) {
  const res = await callLLM({ model, messages, stream: false, response_format: { type: 'json_object' }, max_tokens: 4096 });
  const json = await res.json();
  const content = json.choices?.[0]?.message?.content || '{}';
  try { return JSON.parse(content); } catch { return JSON.parse(content.replace(/```json|```/g, '').trim()); }
}
