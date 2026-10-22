import { api } from 'sdk';
import { OPERATORS } from './message.js';

export default async function (cb, ctx) {
  const chatId = cb.message?.chat?.id;
  const msgId = cb.message?.message_id;
  const data = cb.data || '';
  console.log(JSON.stringify(ctx?.update ?? cb, null, 2));
  await api.answerCallbackQuery({ callback_query_id: cb.id }).catch(()=>{});

  if (data === 'menu:ops') {
    const kb = Object.keys(OPERATORS).map(k=>[{text: OPERATORS[k].name, callback_data: `op:${k}`}]);
    try { await api.editMessageText({ chat_id: chatId, message_id: msgId, text: 'Operator select karo:', reply_markup: { inline_keyboard: kb } }); }
    catch(e){ if(!String(e).includes('not modified')) throw e; }
    return;
  }
  if (data.startsWith('op:')) {
    const key = data.slice(3);
    const op = OPERATORS[key];
    const kb = [];
    for (let i=0;i<op.prefixes.length;i+=2) kb.push(op.prefixes.slice(i,i+2).map(p=>({text:p, callback_data:`se:${key}:${p}`})));
    kb.push([{text:'🎲 Any series', callback_data:`se:${key}:ANY`}]);
    kb.push([{text:'⬅️ Back', callback_data:'menu:ops'}]);
    try { await api.editMessageText({ chat_id: chatId, message_id: msgId, text: `${op.name} series select karo:`, reply_markup: { inline_keyboard: kb } }); }
    catch(e){ if(!String(e).includes('not modified')) throw e; }
    return;
  }
  if (data.startsWith('se:')) {
    const parts = data.split(':');
    const prefix = parts[2];
    try { await api.editMessageText({ chat_id: chatId, message_id: msgId, text: `Aapne series ${prefix} select ki hai. Kitne combos generate karne hain? (1 se 10,000 ke beech number type karke bhejein)` }); }
    catch(e){ if(!String(e).includes('not modified')) throw e; }
    await api.answerCallbackQuery({ callback_query_id: cb.id, text: `Selected: ${prefix}. Quantity input coming next.` }).catch(()=>{});
    return;
  }
}
