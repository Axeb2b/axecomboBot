import { api } from 'sdk';
import { allLabels } from '../lib/operators.js';

export default async function (cb, ctx) {
  const data = cb.data || '';
  const chatId = cb.message?.chat?.id;
  const msgId = cb.message?.message_id;
  await api.answerCallbackQuery({ callback_query_id: cb.id });
  if (data === 'help') {
    await api.sendMessage({ chat_id: chatId, text: 'Commands: /start /generate /operators /files /history /status /cancel /help' });
    return;
  }
  if (data === 'ops') {
    const labels = allLabels();
    const sample = [...labels.entries()].slice(0, 20).map(([k,v]) => `${k} — ${v}`).join('\n');
    await api.sendMessage({ chat_id: chatId, text: '📡 Operator Directory\n' + sample + '\nTotal: ' + labels.size });
    return;
  }
  await api.sendMessage({ chat_id: chatId, text: '⚡ AXE COMBO — feature in progress.' });
}
