import { handleStart } from './handlers/start';
import { handleCallback } from './handlers/callbacks';
import { handleMessage } from './handlers/message';
import { handleGenerate } from './handlers/generate';
import { isDuplicate, rateLimit } from './utils';

export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);
    if (request.method !== 'POST') return new Response('ok');
    const secret = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
    if (secret !== env.WEBHOOK_SECRET) return new Response('unauthorized', { status: 401 });
    const update: any = await request.json();
    if (await isDuplicate(env.SESSIONS, update.update_id)) return new Response('ok');
    const msg = update.message;
    const cb = update.callback_query;
    try {
      if (msg) {
        if (msg.text === '/start') await handleStart(env.BOT_TOKEN, msg.chat.id);
        else if (msg.text === '/go') await handleGenerate(env.BOT_TOKEN, env.SESSIONS, msg.chat.id);
        else await handleMessage(env.BOT_TOKEN, env.SESSIONS, msg);
      } else if (cb) {
        if (cb.data === 'main') await handleStart(env.BOT_TOKEN, cb.message.chat.id);
        else if (cb.data?.startsWith('fmt:')) {
          await handleCallback(env.BOT_TOKEN, env.SESSIONS, cb);
          await handleGenerate(env.BOT_TOKEN, env.SESSIONS, cb.message.chat.id);
        } else await handleCallback(env.BOT_TOKEN, env.SESSIONS, cb);
      }
    } catch (e) {
      await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ chat_id: env.ADMIN_CHAT_ID, text: String(e) }) });
    }
    return new Response('ok');
  }
};
