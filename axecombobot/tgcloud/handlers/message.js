import { api, db } from 'sdk';
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
  await api.sendMessage({ chat_id: chatId, text: 'Unknown command. Try /help.', reply_markup: MENU_KB });
}
