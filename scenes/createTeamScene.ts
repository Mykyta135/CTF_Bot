import { Message } from "typescript-telegram-bot-api/dist/types";
import { createTeam } from "../utils/database/createTeam";
import { bot, initialScene } from "../bot";
import { HomeScene } from "./homeScene";



export const createTeamScene = async (message: Message) => {

    bot.removeAllListeners('message');


    await bot.sendMessage({ chat_id: message.chat.id, text: 'Введіть назву команди:' });

    bot.on('message', async (message) => {
        if (message.text && message.chat.id) {
            const isTeamCreated = await createTeam(message.text, message.chat.id);
            if (isTeamCreated) await initialScene(message);
        }
    })



}