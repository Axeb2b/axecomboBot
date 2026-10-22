import { api, db, InputFile } from 'sdk';
import { eq } from 'sdk/db';
import { users, jobs } from '../schema.js';
import { allLabels } from '../lib/operators.js';

const ADMIN_IDS = [];

const MENU_KB = {
  inline_keyboard: [
    [{ text: '🎲 Generate Dataset', callback_data: 'gen' }],
    [{ text: '📡 Operator Directory', callback_data: 'ops' }],
    [{ text: '📂 File Tools', callback_data: 'files' }],
    [{ text: '📊 My Activity', callback_data: 'activity' }],
    [{ text: '❓ Help', callback_data: 'help' }],
  ],
};

async function ensureUser(tgId) {
  const row = await db.select().from(users).where(eq(users.tgId, tgId)).get();
  if (!row) await db.insert(users).values({ tgId }).run();
}

export default async function (message, ctx) {
  const chatId = message.chat.id;
  const userId = message.from?.id;
  const text = (message.text || '').trim();
  if (!text) return;
  await ensureUser(userId);

  if (text === '/start') {
    await api.sendMessage({ chat_id: chatId, text: '⚡ AXE COMBO\n\nWelcome to your dataset workspace.\n\nGenerate synthetic test datasets, manage files, explore operator metadata, and review your activity.\n\nGenerated identifiers are synthetic test data.', reply_markup: MENU_KB });
    return;
  }
  if (text === '/help' || text === '/files' || text === '/generate' || text === '/status' || text === '/cancel') {
    await api.sendMessage({ chat_id: chatId, text: 'Command acknowledged. Use the menu for full workflow.', reply_markup: MENU_KB });
    return;
  }
  if (text === '/operators') {
    const labels = allLabels();
    const sample = [...labels.entries()].slice(0, 20).map(([k,v]) => `${k} — ${v}`).join('\n');
    await api.sendMessage({ chat_id: chatId, text: '📡 Operator Directory (sample)\n' + sample + '\n\nTotal: ' + labels.size });
    return;
  }
  if (text === '/id') {
    await api.sendMessage({ chat_id: chatId, text: 'Your chat ID: ' + chatId });
    return;
  }
  if (text === '/history') {
    const rows = await db.select().from(jobs).where(eq(jobs.userId, userId)).all();
    const lines = rows.slice(-10).map(j => `#${j.id} ${j.type} ${j.status} ${j.completed}/${j.requested}`).join('\n') || 'No jobs yet.';
    await api.sendMessage({ chat_id: chatId, text: '📊 Recent jobs:\n' + lines });
    return;
  }
  if (text.startsWith('/generate')) {
    const parts = text.split(/\s+/);
    const qty = parseInt(parts[1] || '0', 10);
    const op = (parts[2] || 'ALL').toUpperCase();
    if (!qty || qty < 1 || qty > 500000) {
      await api.sendMessage({ chat_id: chatId, text: 'Usage: /generate <qty 1-500000> [operator|ALL]' });
      return;
    }
    const labels = allLabels();
    const ops = op === 'ALL' ? [...labels.keys()] : [op];
    if (op !== 'ALL' && !labels.has(op)) {
      await api.sendMessage({ chat_id: chatId, text: 'Unknown operator label.' });
      return;
    }
    let buf = '';
    let n = 0;
    const chunkSize = 10000;
    for (let i = 0; i < qty; i++) {
      const id = 'TEST-' + String(i + 1).padStart(8, '0');
      const lbl = op === 'ALL' ? labels.get(ops[i % ops.length]) : labels.get(op);
      buf += `${id},synthetic,${lbl},${id}\n`;
      n++;
      if (buf.length > 100000 || i === qty - 1) {
        const bytes = new TextEncoder().encode(buf);
        await api.sendDocument({ chat_id: chatId, document: new InputFile(bytes, `axe_${n}.csv`, { type: 'text/csv' }) });
        buf = '';
      }
    }
    await api.sendMessage({ chat_id: chatId, text: `Generated ${n} synthetic records.` });
    return;
  }
  await api.sendMessage({ chat_id: chatId, text: 'Unknown command. Try /help.', reply_markup: MENU_KB });
}
