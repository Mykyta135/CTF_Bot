import { CallbackQuery } from "typescript-telegram-bot-api/dist/types";
import { editInlineKeyboard } from "../../utils/keyboards/editInlineKeyboard";
import { bot } from "../../bot";
import { HomeScene, startMessage } from "./homeScene";

export const eventLocationScene = (chatId: number, query: CallbackQuery, keyboardLayout: any) => {


    editInlineKeyboard(query, "Змагання у твоєї мамаши вдома", [[{ text: '', callback_data: 'back' }]]);

    bot.once('callback_query', (q) => {
        if (q.data === 'back' && q.message?.chat.id === chatId) {
            editInlineKeyboard(query, startMessage, keyboardLayout);
        }
    });

}





