import { api } from 'sdk';

const OPERATORS = {
  JIO:      { name: "Jio",      prefixes: ["60090","60091","60092","70050","70051","70052","70060","70061","70070","70080","70090"] },
  AIRTEL:   { name: "Airtel",   prefixes: ["70020","70021","70050","70850","70860","70870","70880","70930","70950","70960","9872","9876","8427","9501","9878","8968","9779","9815","9915","8146"] },
  VI:       { name: "Vi",       prefixes: ["90890","90891","98620","98621","70050","70060","8591","9780","9988","8054","7508","7837","9646","9888"] },
  BSNL:     { name: "BSNL",     prefixes: ["69090","69091","94020","94360","94361","94362","94363","94364","94365","9464","9417","9463","9465","9478","7380","7589","8992"] },
  TATA:     { name: "Tata",     prefixes: ["9217","9256","9216","9257","8699","7696"] },
  RELIANCE: { name: "Reliance", prefixes: ["7814","9569","9357","9316","9356","9317","7307"] },
  OTHERS:   { name: "Others",   prefixes: ["8528","9653","9877","9803","7355","9517"] },
};

export { OPERATORS };

export default async function (message, ctx) {
  const chatId = message.chat.id;
  if (message.text === '/start') {
    await api.sendMessage({ chat_id: chatId, text: '⚡ Combo Bot\n\n⚠️ Ye numbers sirf testing/educational purposes ke liye hain.', reply_markup: { inline_keyboard: [[{ text: '🚀 Generate Combos', callback_data: 'menu:ops' }]] } });
    return;
  }
  await api.sendMessage({ chat_id: chatId, text: '⚡ Combo Bot ready. Send /start' });
}
