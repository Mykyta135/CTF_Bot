import { TelegramBot } from 'typescript-telegram-bot-api';
import 'dotenv/config';
import { HomeScene } from './scenes/userScenes/homeScene';
import { adminScene } from './scenes/adminScenes/adminScene';
import { trackSpamFromUser } from './utils/trackTypedMessages';


import { handleUserCache } from './utils/handleUserCache';


export type UserSession = {
    userState?: string;
    isUserBlocked?: boolean;
    chatId: number;
};

export const lastInlineMessageId = new Map<number, number>();

export const userSessions = new Map<number, UserSession>();

export const bot = new TelegramBot({ botToken: process.env.TELEGRAM_TOKEN! });

export function getUserSession(chatId: number): UserSession {
    if (!userSessions.has(chatId)) {
        return { userState: undefined, isUserBlocked: undefined, chatId: chatId };
    }

    return userSessions.get(chatId)!;
}

export function setUserSession(chatId: number, session: UserSession) {
    userSessions.set(chatId, session);
}



bot.on('message', async (message) => {

    const session = getUserSession(message.chat.id);
    const chatId = message.chat.id;
    
    await handleUserCache(session.chatId, session);
    await trackSpamFromUser(session.chatId, 5000, 5, session);


    switch (message.text) {
        case '/start':
            switch (userSessions.get(chatId)!.isUserBlocked) {
                case true:
                    bot.sendMessage({ chat_id: chatId, text: 'Вас було заблоковано через порушення правил використання ботом. Якщо у вас виникли питання, звертайтеся до @polter01' });
                    break;
                case false:
                    await HomeScene(chatId);
                    break;
            }
            break;
        case "/ParadaParadnaNaParadniyParadi":
            await adminScene(chatId);
            break;
    }

}
)



bot.startPolling();