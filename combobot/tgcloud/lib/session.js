import { db } from 'sdk';
import { sessions } from '../schema.js';
import { eq } from 'sdk/db';

export async function setSession(chatId, operator, prefix) {
  await db.insert(sessions).values({ chatId, operator, prefix }).onConflictDoUpdate({ target: sessions.chatId, set: { operator, prefix } }).run();
}
export async function getSession(chatId) {
  return await db.select().from(sessions).where(eq(sessions.chatId, chatId)).get();
}
export async function clearSession(chatId) {
  await db.delete(sessions).where(eq(sessions.chatId, chatId)).run();
}
