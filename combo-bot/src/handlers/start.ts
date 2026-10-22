import { sendMessage } from '../telegram';
export async function handleStart(token: string, chatId: number) {
  await sendMessage(token, chatId, '⚡ <b>Combo Bot</b>\n\n⚠️ Ye numbers sirf testing/educational purposes ke liye hain. Spam ya illegal use cyber crime hai.', {
    reply_markup: { inline_keyboard: [[{text:'🚀 Generate Combos',callback_data:'gen'}]] }
  });
}
