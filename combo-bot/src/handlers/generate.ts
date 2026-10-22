import { sendMessage, sendDocument } from '../telegram';
import { getSession, clearSession } from '../session';
import { generate } from '../generators/strategies';
import { findOperator } from '../data/operators';

export async function handleGenerate(token: string, kv: KVNamespace, chatId: number) {
  const s = await getSession(kv, chatId);
  if (!s.operator || !s.prefix || !s.qty || !s.format) { await sendMessage(token, chatId, 'Incomplete session.'); return; }
  const prefix = s.prefix === 'ANY' ? (Math.random()<0.5?'60090':'70020') : s.prefix;
  const op = s.operator;
  const nums = generate(prefix, s.qty, s.format==='mixed'?'mixed':'random').map(n => s.format==='+91' ? '+91'+n : n);
  const ts = new Date().toISOString();
  let content = '';
  if (s.format === 'csv') {
    content = 'number,operator,prefix,style,generated_at\n' + nums.map(n=>`${n},${op},${prefix},${s.format},${ts}`).join('\n');
  } else {
    content = nums.join('\n');
  }
  const blob = new Blob([content], { type: 'text/plain' });
  const name = `combos_${op}_${prefix}_${s.qty}_${Date.now()}.txt`.replace(/\s/g,'_');
  await sendDocument(token, chatId, blob, name, `Operator: ${op}\nPrefix: ${prefix}\nQty: ${s.qty}\nStyle: ${s.format}\n${ts}\n⚠️ Ye numbers sirf testing/educational purposes ke liye hain.`);
  await clearSession(kv, chatId);
  await sendMessage(token, chatId, '🔁 Generate Again | 🏠 Main Menu', { reply_markup: { inline_keyboard: [[{text:'🔁 Generate Again',callback_data:'gen'},{text:'🏠 Main Menu',callback_data:'main'}]] } });
}
