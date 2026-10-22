const API='https://api.telegram.org/bot';
export async function tg(token: string, method: string, body: any) {
  const res=await fetch(`${API}${token}/${method}`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
  return res.json();
}
export const sendMessage=(t:string,c:number,text:string,extra:any={})=>tg(t,'sendMessage',{chat_id:c,text,parse_mode:'HTML',...extra});
export const answerCallbackQuery=(t:string,id:string,text?:string)=>tg(t,'answerCallbackQuery',{callback_query_id:id,text});
export const editMessageText=(t:string,c:number,m:number,text:string,extra:any={})=>tg(t,'editMessageText',{chat_id:c,message_id:m,text,parse_mode:'HTML',...extra});
export async function sendDocument(t:string,c:number,blob:Blob,name:string,caption:string){
  const fd=new FormData(); fd.append('chat_id',String(c)); fd.append('document',blob,name); fd.append('caption',caption);
  const res=await fetch(`${API}${t}/sendDocument`,{method:'POST',body:fd}); return res.json();
}
