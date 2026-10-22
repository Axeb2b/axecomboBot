import { api, InputFile } from 'sdk';
import { JIO, AIRTEL, VI, BSNL } from '../lib/operators.js';

const CATSERIES = {
  Jio: JIO, Airtel: AIRTEL, Vi: VI, BSNL: BSNL,
  Legacy: [], All: [],
};

function rndSuffix(){ const c='ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let s=''; for(let i=0;i<6;i++) s+=c[Math.floor(Math.random()*c.length)]; return s; }

export default async function (cb, ctx) {
  const data = cb.data || '';
  const chatId = cb.message?.chat?.id;
  await api.answerCallbackQuery({ callback_query_id: cb.id }).catch(()=>{});

  if (data === 'gen') {
    await api.sendMessage({ chat_id: chatId, text: 'Select a category:', reply_markup: { inline_keyboard: [
      [{text:'📱 Jio',callback_data:'gencat:Jio'},{text:'📱 Airtel',callback_data:'gencat:Airtel'}],
      [{text:'📱 Vi',callback_data:'gencat:Vi'},{text:'📱 BSNL',callback_data:'gencat:BSNL'}],
      [{text:'📡 Legacy',callback_data:'gencat:Legacy'},{text:'🔀 All Series',callback_data:'gencat:All'}],
      [{text:'🔙 Back',callback_data:'back'}],
    ]}});
    return;
  }
  if (data.startsWith('gencat:')) {
    const cat = data.split(':')[1];
    const series = cat==='All' ? ['ALL'] : (cat==='Legacy' ? ['LEGACY'] : CATSERIES[cat]);
    const rows = series.map(s=>[{text:s,callback_data:`genseries:${cat}:${s}`}]);
    rows.push([{text:'Select All',callback_data:`genseries:${cat}:ALL`}]);
    rows.push([{text:'🔙 Back',callback_data:'gen'}]);
    await api.sendMessage({ chat_id: chatId, text: `Category: ${cat}\nSelect a series:`, reply_markup: { inline_keyboard: rows }});
    return;
  }
  if (data.startsWith('genseries:')) {
    const [,cat,series] = data.split(':');
    await api.sendMessage({ chat_id: chatId, text: `Category ${cat}, series ${series}. Quantity?`, reply_markup: { inline_keyboard: [
      [{text:'100',callback_data:`genqty:${cat}:${series}:100`},{text:'500',callback_data:`genqty:${cat}:${series}:500`}],
      [{text:'1,000',callback_data:`genqty:${cat}:${series}:1000`},{text:'Cancel',callback_data:'cancel'}],
    ]}});
    return;
  }
  if (data.startsWith('genqty:')) {
    const [,cat,series,qty] = data.split(':');
    await api.sendMessage({ chat_id: chatId, text: `Category ${cat}, series ${series}, qty ${qty}. Mode?`, reply_markup: { inline_keyboard: [
      [{text:'🎲 Random',callback_data:`genmode:${cat}:${series}:${qty}:random`}],
      [{text:'🔢 Fixed',callback_data:`genmode:${cat}:${series}:${qty}:fixed`}],
      [{text:'🔀 Mixed',callback_data:`genmode:${cat}:${series}:${qty}:mixed`}],
    ]}});
    return;
  }
  if (data.startsWith('genmode:')) {
    const [,cat,series,qty,mode] = data.split(':');
    await api.sendMessage({ chat_id: chatId, text: `Category ${cat}, series ${series}, qty ${qty}, mode ${mode}. Format?`, reply_markup: { inline_keyboard: [
      [{text:'TXT',callback_data:`genfmt:${cat}:${series}:${qty}:${mode}:txt`}],
      [{text:'CSV',callback_data:`genfmt:${cat}:${series}:${qty}:${mode}:csv`}],
    ]}});
    return;
  }
  if (data.startsWith('genfmt:')) {
    const [,cat,series,qty,mode,fmt] = data.split(':');
    const q = Math.min(parseInt(qty,10), 500000);
    const outSeries = series === 'ALL' ? (CATSERIES[cat]||['ALL']) : [series];
    let buf=''; let n=0;
    const seen=new Set();
    for (let i=0;i<q;i++){
      const s = outSeries[i % outSeries.length];
      let id;
      if (mode==='fixed') id = `${cat.toUpperCase()}-${s}-FIX-${String(i+1).padStart(6,'0')}`;
      else if (mode==='random') id = `${cat.toUpperCase()}-${s}-R${rndSuffix()}`;
      else id = `${cat.toUpperCase()}-${s}-M${String(i+1).padStart(6,'0')}-${rndSuffix().slice(0,4)}`;
      if (seen.has(id)){ i--; continue; }
      seen.add(id);
      if (fmt==='csv') buf += `${id},${cat},${s},${mode}\n`;
      else buf += `${id}\n`;
      n++;
      if (buf.length>80000 || i===q-1){
        const bytes=new TextEncoder().encode(buf);
        await api.sendDocument({ chat_id: chatId, document: new InputFile(bytes, `axe_${cat}_${s}_${n}.${fmt}`, {type: fmt==='csv'?'text/csv':'text/plain'})});
        buf='';
      }
    }
    await api.sendMessage({ chat_id: chatId, text: `Generated ${n} synthetic records (${cat}, ${series}, ${mode}, ${fmt}).`});
    return;
  }
  if (data === 'ops') { await api.sendMessage({ chat_id: chatId, text: 'Use /operators' }); return; }
  if (data === 'back') { await api.sendMessage({ chat_id: chatId, text: '⚡ AXE COMBO' }); return; }
  await api.sendMessage({ chat_id: chatId, text: '⚡ AXE COMBO — feature in progress.' });
}
