import { InlineKeyboardButton, Message } from "typescript-telegram-bot-api/dist/types";
import { bot } from "../../bot";


export const createInlineKeyboard = (message: Message, text: string, keyboardSchema: InlineKeyboardButton[][] | undefined,) => {
    if (keyboardSchema !== undefined) {
        bot.sendMessage({
            chat_id: message.chat.id,
            text: text,
            parse_mode: 'HTML',
            reply_markup: { inline_keyboard: keyboardSchema }
        });

    }
}
