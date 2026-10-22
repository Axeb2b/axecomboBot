import { sendMessage } from '../telegram';
import { getSession, setSession } from '../session';

export async function handleMessage(token: string, kv: KVNamespace, msg: any) {
  const chatId = msg.chat.id;
  const text = (msg.text||'').trim();
  const s = await getSession(kv, chatId);
  if (!s.operator) { await sendMessage(token, chatId, 'Pehle /start karke Generate Combos dabao.'); return; }
  if (!s.qty) {
    const n = parseInt(text,10);
    if (isNaN(n) || n<1 || n>10000) { await sendMessage(token, chatId, 'Invalid quantity. 1-10000 number bhejo.'); return; }
    await setSession(kv, chatId, { ...s, qty: n });
    await sendMessage(token, chatId, 'Format select karo:', { reply_markup: { inline_keyboard: [
      [{text:'📄 Plain',callback_data:'fmt:plain'},{text:'📱 +91',callback_data:'fmt:+91'}],
      [{text:'📊 CSV',callback_data:'fmt:csv'},{text:'🎲 Mixed',callback_data:'fmt:mixed'}],
    ]}});
    return;
  }
  await sendMessage(token, chatId, 'Format select karo pehle.');
}
