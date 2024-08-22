import { TelegramBot } from 'typescript-telegram-bot-api';
import 'dotenv/config';
import { RegistrationScene } from './scenes/registrationScene';
import { HomeScene } from './scenes/homeScene';
import { adminScene } from './scenes/adminScenes/adminScene';
import { trackTypedMessages } from './utils/trackTypedMessages';
import { logOfUser } from './utils/logOfUser';

import { manageCache } from './utils/manageCache';
export const bot = new TelegramBot({ botToken: process.env.TELEGRAM_TOKEN! });

bot.startPolling();
const userStateCache = new Map<number, string>();
const isUserBlocked = new Map<number, boolean>();

bot.on('message', async (message) => {
    await trackTypedMessages(message, 5000, 5);

    const { userState, userBlocked } = await manageCache(message, userStateCache, isUserBlocked);

    if (userBlocked) {
        await bot.sendMessage({ chat_id: message.chat.id, text: 'Вас заблоковано на 5 хвилин' });
    } else {
        switch (message.text) {
            case '/start':

                if (userState === 'registration') {
                    logOfUser(message, "entered registration scene");
                    await RegistrationScene(message);
                } else if (userState === 'home') {
                    logOfUser(message, "entered home scene");
                    await HomeScene(message, false);
                }


                break;
            case 'ParadaParadnaNaParadniyParadi':
                await adminScene(message);
                break;
        }

    }




});