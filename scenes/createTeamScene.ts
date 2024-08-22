import { Message } from "typescript-telegram-bot-api/dist/types";
import { createTeam } from "../utils/database/createTeam";
import { bot } from "../bot";
import { HomeScene } from "./homeScene";



export const createTeamScene = async (message: Message) => {

    bot.removeAllListeners('message');


    bot.sendMessage({ chat_id: message.chat.id, text: 'Введіть назву команди:' });

    bot.once('message', async (message) => {
        if (message.text && message.chat.id) {
            await createTeam(message.text, message.chat.id);
            await HomeScene(message);
        } 
    })



}