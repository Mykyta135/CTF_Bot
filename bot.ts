import { TelegramBot } from 'typescript-telegram-bot-api';
import 'dotenv/config';
import { RegistrationScene } from './scenes/registrationScene';
import { HomeScene } from './scenes/homeScene';
import { adminScene } from './scenes/adminScenes/adminScene';
import { trackSpamFromUser } from './utils/trackSpamFromUser';
import { logOfUser } from './utils/logOfUser';

import { manageCache } from './utils/manageCache';
import { Message } from 'typescript-telegram-bot-api/dist/types';
export const bot = new TelegramBot({ botToken: process.env.TELEGRAM_TOKEN! });

bot.startPolling();
const userStateCache = new Map<number, string>();
const isUserBlocked = new Map<number, boolean>();


export const initialScene = async (message?: Message) => {
    bot.removeAllListeners('message');
    bot.removeAllListeners('callback_query');


    // цей condition треба, щоб активувати початкову сцену при переході з іниших сцен 
    if (message) {
        const { userState, userBlocked } = await manageCache(message, userStateCache, isUserBlocked);
        await trackSpamFromUser(message, 5000, 5, isUserBlocked);

        logOfUser(message, `User state: ${userState}, User blocked: ${userBlocked}`);

        if (!userBlocked) {
            if (userState === 'registration') {
                await RegistrationScene(message, userStateCache);
            } else if (userState === 'home') {
                await HomeScene(message, isUserBlocked, false);
            }
        } else {
            await bot.sendMessage({ chat_id: message.chat.id, text: "Ви заблоковані" });
            await logOfUser(message, "User is blocked");
        }
    }

    else
        bot.on('message', async (message) => {
            const { userState, userBlocked } = await manageCache(message, userStateCache, isUserBlocked);
            await trackSpamFromUser(message, 5000, 5, isUserBlocked);

            logOfUser(message, `User state: ${userState}, User blocked: ${userBlocked}`);

            switch (message.text) {
                case "/ParadaParadnaNaParadniyParadi":
                    await adminScene(message, isUserBlocked, userStateCache);
                    break;
                case '/start':
                    if (!userBlocked) {
                        if (userState === 'registration') {
                            await RegistrationScene(message, userStateCache);
                        } else if (userState === 'home') {
                            await HomeScene(message, isUserBlocked, false);
                        }
                    } else {
                        await bot.sendMessage({ chat_id: message.chat.id, text: "Ви заблоковані" });
                        await logOfUser(message, "User is blocked");
                    }
                    break;

            }
        })
}


initialScene();