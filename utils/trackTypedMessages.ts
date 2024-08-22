import { Message } from "typescript-telegram-bot-api/dist/types";
import { bot } from "../bot";
import { PrismaClient } from "@prisma/client";

interface UserActivity {
    lastMessageTime: number[];
}

const userMessageCounts: Record<number, UserActivity> = {};
const prisma = new PrismaClient();

export const trackTypedMessages = async (message: Message, TIME_FRAME: number, MAX_MESSAGES: number) => {
    const userId = message.chat.id
    const now = Date.now();

    if (!userMessageCounts[userId]) {
        userMessageCounts[userId] = { lastMessageTime: [] };
    }
    const userActivity = userMessageCounts[userId];

    userActivity.lastMessageTime = userActivity.lastMessageTime.filter(time => now - time <= TIME_FRAME);

    userActivity.lastMessageTime.push(now);

    if (userActivity.lastMessageTime.length > MAX_MESSAGES) {
        const b = await prisma.user.update({
            where: {
                chat_id: userId,
            },
            data: {
                isBlocked: true,
            },
        });

        return b.isBlocked
    }


}

