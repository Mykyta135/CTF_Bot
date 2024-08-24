import { Message } from "typescript-telegram-bot-api/dist/types";
import { bot } from "../bot";
import { PrismaClient } from "@prisma/client";

interface UserActivity {
    lastMessageTime: number[];
}

const userMessageCounts: Record<number, UserActivity> = {};
const prisma = new PrismaClient();

export const trackSpamFromUser = async (message: Message, TIME_FRAME: number, MAX_MESSAGES: number, isUserBlocked: Map<number, boolean>) => {
    const userId = message.chat.id
    const now = Date.now();

    if (!userMessageCounts[userId]) {
        userMessageCounts[userId] = { lastMessageTime: [] };
    }
    const userActivity = userMessageCounts[userId];

    userActivity.lastMessageTime = userActivity.lastMessageTime.filter(time => now - time <= TIME_FRAME);

    userActivity.lastMessageTime.push(now);

    if (userActivity.lastMessageTime.length > MAX_MESSAGES) {
        await prisma.user.update({
            where: {
                chat_id: userId,
            },
            data: {
                isBlocked: true,
            },
        }).then((b) => {
            isUserBlocked!.set(message.chat.id, b.isBlocked);
        })


    } else {
        return false
    }


}

