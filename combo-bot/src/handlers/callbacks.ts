import { OPERATORS } from '../data/operators';
import { sendMessage, answerCallbackQuery, editMessageText } from '../telegram';
import { getSession, setSession } from '../session';

export async function handleCallback(token: string, kv: KVNamespace, cb: any) {
  const chatId = cb.message.chat.id;
  const data = cb.data || '';
  await answerCallbackQuery(token, cb.id);
  if (data === 'gen') {
    const kb = Object.keys(OPERATORS).map(o=>[{text:o,callback_data:`op:${o}`}]);
    await sendMessage(token, chatId, 'Operator select karo:', { reply_markup: { inline_keyboard: kb } });
    return;
  }
  if (data.startsWith('op:')) {
    const op = data.slice(3);
    const prefs = OPERATORS[op];
    const kb = prefs.map(p=>[{text:p,callback_data:`series:${op}:${p}`}]);
    kb.push([{text:'🎲 Any series',callback_data:`series:${op}:ANY`}]);
    await sendMessage(token, chatId, `${op} series select karo:`, { reply_markup: { inline_keyboard: kb } });
    return;
  }
  if (data.startsWith('series:')) {
    const [,op,prefix] = data.split(':');
    await setSession(kv, chatId, { operator: op, prefix });
    await sendMessage(token, chatId, 'Kitne combos chahiye? (1 – 10,000) — number type karke bhejo.');
    return;
  }
  if (data.startsWith('fmt:')) {
    const fmt = data.slice(4);
    const s = await getSession(kv, chatId);
    await setSession(kv, chatId, { ...s, format: fmt });
    // trigger generation via message handler flag
    await sendMessage(token, chatId, 'Generating... (send /go to start)');
    return;
  }
}
