import { InlineKeyboardButton, Message } from "typescript-telegram-bot-api/dist/types";
import { bot } from "../../../bot";


export const createInlineKeyboard = async (message: Message, text: string, keyboardSchema: InlineKeyboardButton[][],) => {

    await bot.sendMessage({
        chat_id: message.chat.id,
        text: text,
        reply_markup: { inline_keyboard: keyboardSchema }
    });


}
