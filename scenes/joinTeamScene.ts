import { Message } from "typescript-telegram-bot-api/dist/types";
import { joinTeam } from "../utils/database/joinTeam";
import { bot, initialScene } from "../bot";
import { HomeScene } from "./homeScene";



export const joinTeamScene = async (message: Message) => {
    bot.removeAllListeners('message');

    await bot.sendMessage({ chat_id: message.chat.id, text: 'Введіть ID команди:' });
    if (message.text && message.chat.id) {
        bot.once('message', async (message) => {
            await joinTeam(message);
            await initialScene();
        });

    }
}