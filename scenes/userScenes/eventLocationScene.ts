import { CallbackQuery } from "typescript-telegram-bot-api/dist/types";
import { editInlineKeyboard } from "../../utils/keyboards/editInlineKeyboard";
import { bot, sceneController } from "../../bot";
import { HomeScene } from "./homeScene";

export const eventLocationScene = (query: CallbackQuery) => {

    bot.removeAllListeners('callback_query');
    editInlineKeyboard(query, "Змагання у твоєї мамаши вдома", [[{ text: 'Назад', callback_data: 'back' }]]);



}





