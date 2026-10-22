import { api, InputFile } from 'sdk';
import { getSession, clearSession } from '../lib/session.js';

const OPERATORS = {
  JIO:      { name: "Jio",      prefixes: ["60090","60091","60092","70050","70051","70052","70060","70061","70070","70080","70090"] },
  AIRTEL:   { name: "Airtel",   prefixes: ["70020","70021","70050","70850","70860","70870","70880","70930","70950","70960","9872","9876","8427","9501","9878","8968","9779","9815","9915","8146"] },
  VI:       { name: "Vi",       prefixes: ["90890","90891","98620","98621","70050","70060","8591","9780","9988","8054","7508","7837","9646","9888"] },
  BSNL:     { name: "BSNL",     prefixes: ["69090","69091","94020","94360","94361","94362","94363","94364","94365","9464","9417","9463","9465","9478","7380","7589","8992"] },
  TATA:     { name: "Tata",     prefixes: ["9217","9256","9216","9257","8699","7696"] },
  RELIANCE: { name: "Reliance", prefixes: ["7814","9569","9357","9316","9356","9317","7307"] },
  OTHERS:   { name: "Others",   prefixes: ["8528","9653","9877","9803","7355","9517"] },
};

function genMixed(prefix, qty) {
  const suffixLength = 10 - prefix.length;
  const set = new Set();
  let i = 0;
  while (set.size < qty && i < qty * 10) {
    let suffix = "";
    for (let d = 0; d < suffixLength; d++) suffix += Math.floor(Math.random() * 10);
    const num = prefix + suffix;
    if (num.length === 10) set.add(num);
    i++;
  }
  const seq = [];
  for (let j = 0; j < Math.floor(qty * 0.2); j++) seq.push(prefix + String(j).padStart(suffixLength, "0").slice(-suffixLength));
  const pat = [];
  for (let j = 0; j < Math.floor(qty * 0.2); j++) pat.push(prefix + String((j % 9) + 1).repeat(suffixLength).slice(0, suffixLength));
  const all = [...set, ...seq, ...pat];
  const uniq = [...new Set(all)].slice(0, qty);
  while (uniq.length < qty) {
    let suffix = "";
    for (let d = 0; d < suffixLength; d++) suffix += Math.floor(Math.random() * 10);
    const num = prefix + suffix;
    if (num.length === 10 && !uniq.includes(num)) uniq.push(num);
  }
  for (let k = uniq.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [uniq[k], uniq[j]] = [uniq[j], uniq[k]]; }
  return uniq;
}

export default async function (message, ctx) {
  const chatId = message.chat.id;
  const text = (message.text || '').trim();
  if (text === '/start') {
    await api.sendMessage({ chat_id: chatId, text: '⚡ Combo Bot', reply_markup: { inline_keyboard: [[{ text: '🚀 Generate Combos', callback_data: 'menu:ops' }]] } });
    return;
  }
  const sess = await getSession(chatId);
  const n = parseInt(text, 10);
  if (sess && !isNaN(n) && n >= 1 && n <= 1000000) {
    const prefix = sess.prefix === 'ANY' ? sess.operator.slice(0, 2).toUpperCase() + '000' : sess.prefix;
    const nums = genMixed(prefix, n);
    const content = nums.join('\n');
    const bytes = new TextEncoder().encode(content);
    const name = `combos_${sess.operator}_${prefix}_${n}.txt`;
    await api.sendDocument({ chat_id: chatId, document: new InputFile(bytes, name, { type: 'text/plain' }), caption: `Operator: ${sess.operator}\nPrefix: ${prefix}\nQty: ${n}\n⚠️ Ye numbers sirf testing/educational purposes ke liye hain.` });
    await clearSession(chatId);
    await api.sendMessage({ chat_id: chatId, text: 'Done.', reply_markup: { inline_keyboard: [[{ text: '🔁 Generate Again', callback_data: 'menu:ops' }]] } });
    return;
  }
  await api.sendMessage({ chat_id: chatId, text: '⚡ Combo Bot ready. Send /start' });
}
