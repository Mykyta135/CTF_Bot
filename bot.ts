import { TelegramBot } from 'typescript-telegram-bot-api';
import 'dotenv/config';
import { HomeScene } from './scenes/userScenes/homeScene';
import { adminScene } from './scenes/adminScenes/adminScene';
import { trackSpamFromUser } from './utils/trackTypedMessages';
import { logOfUser } from './utils/logOfUser';

import { handleUserCache } from './utils/handleUserCache';
import { Message } from 'typescript-telegram-bot-api/dist/types';
export const bot = new TelegramBot({ botToken: process.env.TELEGRAM_TOKEN! });

function initializeCache() {
    const userStateCache = new Map<number, string>();
    const isUserBlockedCache = new Map<number, boolean>();
    return { userStateCache, isUserBlockedCache }
}
export function getUserCache(message: Message) {
    const userState = userStateCache.get(message.chat.id);
    const isUserBlock = isUserBlockedCache.get(message.chat.id);
    return { userState, isUserBlock }
}
export function removeAllListeners() {
    bot.removeAllListeners('message');
    bot.removeAllListeners('callback_query');
}

export const { userStateCache, isUserBlockedCache } = initializeCache();

export const sceneController = async (message: Message) => {

    await handleUserCache(message);
    await trackSpamFromUser(message, 5000, 5, isUserBlockedCache);

    const { userState, isUserBlock } = getUserCache(message);

    logOfUser(message, `User state: ${userState}, User blocked: ${isUserBlock}`);

    switch (message.text) {

        case '/start':
            switch (isUserBlock) {
                case true:
                    bot.sendMessage({ chat_id: message.chat.id, text: 'Ви заблоковані, зверніться до адміністратора' });
                    break;
                case false:
                    await HomeScene(message);
                    break;
            }
            break;
        case "/ParadaParadnaNaParadniyParadi":
            await adminScene(message);
            break;

    }
}

bot.on('message', async (message) => {
    console.log(message.text);
    await sceneController(message);
})



bot.startPolling();