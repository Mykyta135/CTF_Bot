import { Message } from "typescript-telegram-bot-api/dist/types";

import { bot, sceneController } from "../../bot";
import { HomeScene } from "./homeScene";
import { createTeam } from "../../utils/database/userScenes/createTeam";



export const createTeamScene =  (msg: Message) => {




    bot.sendMessage({ chat_id: msg.chat.id, text: 'Введіть назву команди:' });
    
    bot.once('message', (message) => {
         createTeam(message.text, msg);
    });



}