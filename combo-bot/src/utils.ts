export function escape(s: string){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
export async function rateLimit(kv: KVNamespace, userId: number): Promise<boolean> {
  const key=`rl:${userId}`; const v=await kv.get(key); const n=v?parseInt(v):0;
  if(n>=3) return false;
  await kv.put(key, String(n+1), { expirationTtl: 60 }); return true;
}
export async function isDuplicate(kv: KVNamespace, updateId: number): Promise<boolean> {
  const key=`upd:${updateId}`; const v=await kv.get(key); if(v) return true;
  await kv.put(key,'1',{expirationTtl:300}); return false;
}
