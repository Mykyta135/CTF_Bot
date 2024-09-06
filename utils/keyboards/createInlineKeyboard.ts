import { InlineKeyboardButton, Message } from "typescript-telegram-bot-api/dist/types";
import { bot } from "../../bot";


export const createInlineKeyboard = async (chatId: number, text: string, keyboardSchema: InlineKeyboardButton[][] | undefined,) => {
    if (keyboardSchema !== undefined) {
        const msg = await bot.sendMessage({
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML',
            reply_markup: { inline_keyboard: keyboardSchema }
        });
        return msg.message_id
    }
}
