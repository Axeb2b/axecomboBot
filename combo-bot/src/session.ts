export interface Session { operator?: string; prefix?: string; qty?: number; format?: string; }
export async function getSession(kv: KVNamespace, chatId: number): Promise<Session> {
  const raw = await kv.get(`session:${chatId}`);
  return raw ? JSON.parse(raw) : {};
}
export async function setSession(kv: KVNamespace, chatId: number, s: Session) {
  await kv.put(`session:${chatId}`, JSON.stringify(s), { expirationTtl: 3600 });
}
export async function clearSession(kv: KVNamespace, chatId: number) {
  await kv.delete(`session:${chatId}`);
}
