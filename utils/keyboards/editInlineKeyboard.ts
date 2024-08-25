import { CallbackQuery, InlineKeyboardButton } from "typescript-telegram-bot-api/dist/types";
import { bot } from "../../bot";
export const editInlineKeyboard = (query: CallbackQuery, text: string, buttons: InlineKeyboardButton[][] | undefined) => {
    if (buttons !== undefined) {
        bot.editMessageText({
            chat_id: query.message!.chat.id,
            parse_mode: "HTML",
            message_id: query.message!.message_id,
            text: text,
            reply_markup: { inline_keyboard: buttons }
        });
    }
}