export type Style = 'random'|'sequential'|'pattern'|'round'|'mixed';

function randDigit(){ return Math.floor(Math.random()*10).toString(); }

export function randomSuffix(len=4){ let s=''; for(let i=0;i<len;i++) s+=randDigit(); return s; }

export function genRandom(prefix: string, qty: number): string[] {
  const set=new Set<string>();
  while(set.size<qty){ set.add(prefix + String(Math.floor(Math.random()*10000)).padStart(4,'0')); }
  return [...set];
}
export function genSequential(prefix: string, qty: number): string[] {
  const out=[]; for(let i=0;i<qty;i++) out.push(prefix + String(i).padStart(4,'0')); return out;
}
export function genPattern(prefix: string, qty: number): string[] {
  const out=[]; for(let i=0;i<qty;i++){ const d=(i%9)+1; out.push(prefix + String(d).repeat(4)); } return out;
}
export function genRound(prefix: string, qty: number): string[] {
  const out=[]; for(let i=0;i<qty;i++) out.push(prefix + String((i+1)*1000 % 10000).padStart(4,'0')); return out;
}
export function genMixed(prefix: string, qty: number): string[] {
  const r=Math.floor(qty*0.4), s=Math.floor(qty*0.2), p=Math.floor(qty*0.2), ro=qty-r-s-p;
  const all=[...genRandom(prefix,r),...genSequential(prefix,s),...genPattern(prefix,p),...genRound(prefix,ro)];
  const set=new Set(all); 
  while(set.size<qty) set.add(prefix + String(Math.floor(Math.random()*10000)).padStart(4,'0'));
  const arr=[...set]; for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];} 
  return arr.slice(0,qty);
}
export function generate(prefix: string, qty: number, style: Style): string[] {
  switch(style){ case 'random': return genRandom(prefix,qty); case 'sequential': return genSequential(prefix,qty); case 'pattern': return genPattern(prefix,qty); case 'round': return genRound(prefix,qty); default: return genMixed(prefix,qty); }
}
