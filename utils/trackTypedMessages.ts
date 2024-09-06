import { Message } from "typescript-telegram-bot-api/dist/types";
import {UserSession, userSessions } from "../bot";
import { PrismaClient } from "@prisma/client";
import { sendMessageToUser } from "../scenes/adminScenes/handleUsersScene";

const userMessageCounts = new Map<number, { lastMessageTime: number[] }>();

const prisma = new PrismaClient();

export const trackSpamFromUser = async (userId: number, TIME_FRAME: number, MAX_MESSAGES: number, session: UserSession) => {
    
 
    const now = Date.now();

    if (!userMessageCounts.has(userId)) {
        userMessageCounts.set(userId, { lastMessageTime: [] });
    }

    const userActivity = userMessageCounts.get(userId)!;
    userActivity.lastMessageTime = userActivity.lastMessageTime.filter(time => now - time <= TIME_FRAME);
    userActivity.lastMessageTime.push(now);

    if (userActivity.lastMessageTime.length > MAX_MESSAGES) {
        await prisma.user.update({
            where: { chat_id: userId },
            data: { isBlocked: true },
        }).then(() => {
            session.isUserBlocked = true;
        });

        userSessions.set(userId, session);
        await sendMessageToUser(userId, 'Ви були автоматично заблоковані за спам повідомленнями. Якщо у вас виникли питання, звертайтеся до @polter01'); 
    }
}


