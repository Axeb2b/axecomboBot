import { api, db, InputFile } from 'sdk';
import { allLabels, JIO, AIRTEL, VI, BSNL } from '../lib/operators.js';

const CATS = {
  Jio: JIO, Airtel: AIRTEL, Vi: VI, BSNL: BSNL,
};

function enc(s){ return encodeURIComponent(s); }

export default async function (cb, ctx) {
  const data = cb.data || '';
  const chatId = cb.message?.chat?.id;
  await api.answerCallbackQuery({ callback_query_id: cb.id }).catch(()=>{});

  if (data === 'gen') {
    await api.sendMessage({ chat_id: chatId, text: 'Select a category:', reply_markup: { inline_keyboard: [
      [{text:'📱 Jio',callback_data:'gencat:Jio'},{text:'📱 Airtel',callback_data:'gencat:Airtel'}],
      [{text:'📱 Vi',callback_data:'gencat:Vi'},{text:'📱 BSNL',callback_data:'gencat:BSNL'}],
      [{text:'📡 Legacy',callback_data:'gencat:Legacy'},{text:'🔀 All',callback_data:'gencat:All'}],
      [{text:'🔙 Back',callback_data:'back'}],
    ]}});
    return;
  }
  if (data.startsWith('gencat:')) {
    const cat = data.split(':')[1];
    await api.sendMessage({ chat_id: chatId, text: `Category: ${cat}\nHow many records?`, reply_markup: { inline_keyboard: [
      [{text:'100',callback_data:`genqty:${cat}:100`},{text:'500',callback_data:`genqty:${cat}:500`}],
      [{text:'1000',callback_data:`genqty:${cat}:1000`},{text:'Cancel',callback_data:'cancel'}],
    ]}});
    return;
  }
  if (data.startsWith('genqty:')) {
    const [,cat,qty] = data.split(':');
    await api.sendMessage({ chat_id: chatId, text: `Category ${cat}, qty ${qty}. Mode?`, reply_markup: { inline_keyboard: [
      [{text:'🎲 Random',callback_data:`genmode:${cat}:${qty}:random`}],
      [{text:'🔢 Fixed',callback_data:`genmode:${cat}:${qty}:fixed`}],
      [{text:'🔀 Mixed',callback_data:`genmode:${cat}:${qty}:mixed`}],
    ]}});
    return;
  }
  if (data.startsWith('genmode:')) {
    const [,cat,qty,mode] = data.split(':');
    await api.sendMessage({ chat_id: chatId, text: `Category ${cat}, qty ${qty}, mode ${mode}. Format?`, reply_markup: { inline_keyboard: [
      [{text:'TXT',callback_data:`genfmt:${cat}:${qty}:${mode}:txt`}],
      [{text:'CSV',callback_data:`genfmt:${cat}:${qty}:${mode}:csv`}],
    ]}});
    return;
  }
  if (data.startsWith('genfmt:')) {
    const [,cat,qty,mode,fmt] = data.split(':');
    const q = Math.min(parseInt(qty,10),500000);
    const labels = allLabels();
    const series = cat === 'All' ? [...labels.keys()] : (cat === 'Legacy' ? [...labels.keys()] : (CATS[cat]||[]));
    let buf=''; let n=0;
    for (let i=0;i<q;i++){
      const id = `${cat.toUpperCase()}-TEST-${String(i+1).padStart(8,'0')}`;
      const lbl = series.length? labels.get(series[i%series.length])||cat : cat;
      if (fmt==='csv') buf += `${id},${cat},${lbl},${mode}\n`;
      else buf += `${id}\n`;
      n++;
      if (buf.length>80000 || i===q-1){
        const bytes=new TextEncoder().encode(buf);
        await api.sendDocument({ chat_id: chatId, document: new InputFile(bytes, `axe_${cat}_${n}.${fmt}`, {type: fmt==='csv'?'text/csv':'text/plain'})});
        buf='';
      }
    }
    await api.sendMessage({ chat_id: chatId, text: `Generated ${n} synthetic records (${cat}, ${mode}, ${fmt}).`});
    return;
  }
  if (data === 'ops') {
    await api.sendMessage({ chat_id: chatId, text: '📡 Operator Directory (use /operators)' });
    return;
  }
  if (data === 'back') {
    await api.sendMessage({ chat_id: chatId, text: '⚡ AXE COMBO', reply_markup: { inline_keyboard: [
      [{text:'🎲 Generate Dataset',callback_data:'gen'}],
      [{text:'📡 Operator Directory',callback_data:'ops'}],
    ]}});
    return;
  }
  await api.sendMessage({ chat_id: chatId, text: '⚡ AXE COMBO — feature in progress.' });
}
