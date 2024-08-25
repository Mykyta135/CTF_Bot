import { CallbackQuery } from "typescript-telegram-bot-api/dist/types";
import { bot, sceneController } from "../../bot";
import { startEvent } from "../../utils/database/adminScenes/startEvent"
import { adminScene } from "./adminScene";

export const startEventScene = async (query: CallbackQuery) => {
    bot.removeAllListeners('message');
    bot.removeAllListeners('callback_query');

    await startEvent(query.message!);

}