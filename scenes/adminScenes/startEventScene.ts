import { CallbackQuery } from "typescript-telegram-bot-api/dist/types";
import { bot } from "../../bot";
import { startEvent } from "../../utils/database/adminsDatabase/startEvent"
import { adminScene } from "./adminScene";

export const startEventScene = async (query: CallbackQuery) => {
    bot.removeAllListeners('message');
    bot.removeAllListeners('callback_query');

    await startEvent(query.message!);

    if (query.data === 'back') {
        await adminScene(query.message!)
    }
}