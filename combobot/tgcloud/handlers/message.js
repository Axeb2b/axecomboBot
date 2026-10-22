import { api } from 'sdk';
export default async function (message, ctx) {
  const chatId = message.chat.id;
  await api.sendMessage({ chat_id: chatId, text: '⚡ Combo Bot ready. Send /start' });
}
