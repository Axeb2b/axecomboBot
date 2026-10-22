import { api } from 'sdk';
import { setSession } from '../lib/session.js';

const OPERATORS = {
  JIO:      { name: "Jio",      prefixes: ["60090","60091","60092","70050","70051","70052","70060","70061","70070","70080","70090"] },
  AIRTEL:   { name: "Airtel",   prefixes: ["70020","70021","70050","70850","70860","70870","70880","70930","70950","70960","9872","9876","8427","9501","9878","8968","9779","9815","9915","8146"] },
  VI:       { name: "Vi",       prefixes: ["90890","90891","98620","98621","70050","70060","8591","9780","9988","8054","7508","7837","9646","9888"] },
  BSNL:     { name: "BSNL",     prefixes: ["69090","69091","94020","94360","94361","94362","94363","94364","94365","9464","9417","9463","9465","9478","7380","7589","8992"] },
  TATA:     { name: "Tata",     prefixes: ["9217","9256","9216","9257","8699","7696"] },
  RELIANCE: { name: "Reliance", prefixes: ["7814","9569","9357","9316","9356","9317","7307"] },
  OTHERS:   { name: "Others",   prefixes: ["8528","9653","9877","9803","7355","9517"] },
};

export default async function (cb, ctx) {
  const chatId = cb.message?.chat?.id;
  const msgId = cb.message?.message_id;
  const data = cb.data || '';
  await api.answerCallbackQuery({ callback_query_id: cb.id }).catch(()=>{});

  if (data === "profile") { await api.sendMessage({ chat_id: chatId, text: "👤 Profile\nTotal Combos: 0" }); return; }
  if (data === "help") { await api.sendMessage({ chat_id: chatId, text: "Help: use menu" }); return; }
  if (data === "menu:ops") {
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
    const key = parts[1]; const prefix = parts[2];
    await setSession(chatId, OPERATORS[key].name, prefix);
    try { await api.editMessageText({ chat_id: chatId, message_id: msgId, text: `Aapne series ${prefix} select ki hai. Kitne combos generate karne hain? (1 se 1,000,000 ke beech number type karke bhejein)` }); }
    catch(e){ if(!String(e).includes('not modified')) throw e; }
    await api.answerCallbackQuery({ callback_query_id: cb.id, text: `Selected: ${prefix}. Quantity input coming next.` }).catch(()=>{});
    return;
  }
}
