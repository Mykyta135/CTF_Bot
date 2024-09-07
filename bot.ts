import { TelegramBot } from 'typescript-telegram-bot-api';
import 'dotenv/config';
import { HomeScene } from './scenes/userScenes/homeScene';
import { adminScene } from './scenes/adminScenes/adminScene';
import { trackSpamFromUser } from './utils/trackTypedMessages';
import { handleUserCache } from './utils/handleUserCache';
import { Message } from 'typescript-telegram-bot-api/dist/types';

export type UserSession = {
    userState?: string;
    isUserBlocked?: boolean;
    chatId: number;
    lastActivity: number; 
};

export const lastInlineMessageId = new Map<number, number>();
export const userSessions = new Map<number, UserSession>();

export const bot = new TelegramBot({ botToken: process.env.TELEGRAM_TOKEN! });

// 30 minutes in ms
const SESSION_EXPIRY_TIME = 30 * 60 * 1000;

export function getUserSession(chatId: number): UserSession {
    cleanupExpiredSessions();

    if (!userSessions.has(chatId)) {
        const newSession: UserSession = {
            userState: undefined,
            isUserBlocked: undefined,
            chatId: chatId,
            lastActivity: Date.now()
        };
        userSessions.set(chatId, newSession);
        return newSession;
    }

    // Update last activity timestamp
    const session = userSessions.get(chatId)!;
    session.lastActivity = Date.now();
    return session;
}

export function setUserSession(chatId: number, session: UserSession) {
    session.lastActivity = Date.now(); // Update last activity timestamp
    userSessions.set(chatId, session);
}

// Clean up expired sessions
function cleanupExpiredSessions() {
    const now = Date.now();
    userSessions.forEach((session, chatId) => {
        if (now - session.lastActivity > SESSION_EXPIRY_TIME) {
            userSessions.delete(chatId);
        }
    });
}

bot.on('message', async (message: Message) => {
    try {
        const chatId = message.chat.id;

        const session = getUserSession(chatId);
        
        await handleUserCache(chatId, session);
        await trackSpamFromUser(chatId, 10000, 5, session);

        switch (message.text) {
            case '/start':
                if (session.isUserBlocked) {
                   await bot.sendMessage({ chat_id: chatId, text: 'Вас було заблоковано через порушення правил використання ботом. Якщо у вас виникли питання, звертайтеся до @polter01' });
                } else {
                    await HomeScene(chatId);
                }
                break;
            case "/ParadaParadnaNaParadniyParadi":
                await adminScene(chatId);
                break;
           
        }
    } catch (error) {
        console.error('Error handling message:', error);
        await bot.sendMessage({ chat_id: message.chat.id, text: 'Сталася помилка. Будь ласка, спробуйте ще раз пізніше.' });
    }
});

bot.startPolling();
