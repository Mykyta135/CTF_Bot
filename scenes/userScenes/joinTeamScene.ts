import { Message } from "typescript-telegram-bot-api/dist/types";
import { joinTeam } from "../../utils/database/userScenes/joinTeam";
import { bot, sceneController } from "../../bot";
import { HomeScene } from "./homeScene";



export const joinTeamScene = (message: Message) => {
    bot.removeAllListeners('message');

    bot.sendMessage({ chat_id: message.chat.id, text: 'Введіть ID команди:' });

    joinTeam(message);
    // await sceneController();



}