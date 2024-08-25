import { Message } from "typescript-telegram-bot-api/dist/types";
import { getUserFromDb } from "./database/userScenes/getUserFromDb";

import { logOfUser } from "./logOfUser";
import { isUserBlockedCache, userStateCache } from "../bot";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const handleUserCache = async (message: Message) => {

    let userStateInfo = userStateCache.get(message.chat.id);
    let userBlockedInfo = isUserBlockedCache.get(message.chat.id);

    if (userStateInfo === undefined) {
        logOfUser(message, 'User state not found in cache');
        userStateInfo = await getUserState(message.chat.id);
        if (userStateInfo === undefined) {
            logOfUser(message, 'User state not found in db');
        } else {
            userStateCache.set(message.chat.id, userStateInfo);
        }

    }
    if (userBlockedInfo === undefined) {
        logOfUser(message, 'User blocked info not found');
        userBlockedInfo = await getUserFromDb(message).then((user) => user?.isBlocked);
        console.log('userBlockedInfo', userBlockedInfo);
        if (userBlockedInfo === undefined) {
            logOfUser(message, 'User blocked info not found in db');
            isUserBlockedCache.set(message.chat.id, false);
        } else {
            isUserBlockedCache.set(message.chat.id, userBlockedInfo);
        }

    }

}

export const getUserState = async (chatId: number): Promise<any> => {

    const user = await prisma.user.findUnique({
        where: {
            chat_id: chatId,
        },
    });
    if (user) {
        return user.userState;
    } else {
        return undefined;
    }
}
