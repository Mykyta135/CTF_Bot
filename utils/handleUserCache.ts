
import { UserSession, userSessions } from "../bot";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const handleUserCache = async (chatId: number, session: UserSession) => {
    


    if (session.userState === undefined) {
        // logOfUser(message, 'User state not found in cache');
        session.userState = await getUserStateFromDb(chatId);
        if (session.userState === undefined) {
            // logOfUser(message, 'User state not found in db');
            session.userState = 'unregistered';
        } else {
            // logOfUser(message, `User state loaded from db: ${session.userState}`);
        }
    }

    if (session.isUserBlocked === undefined) {
        // logOfUser(message, 'User blocked info not found');
        session.isUserBlocked = await getUserBlockedStatus(chatId);
        if (session.isUserBlocked === undefined) {
            // logOfUser(message, 'User blocked info not found in db');
            session.isUserBlocked = false;
        } else {
            // logOfUser(message, `User blocked status loaded from db: ${session.isUserBlocked}`);
        }
    }

    userSessions.set(chatId, session);
    console.log('userSessions anu tuta', userSessions);
}

const getUserBlockedStatus = async (chatId: number): Promise<boolean | undefined> => {
    const user = await prisma.user.findUnique({
        where: { chat_id: chatId },
    });
    if (user) {
        return user.isBlocked;
    } else {
        return undefined
    }
}


export const getUserStateFromDb = async (chatId: number): Promise<string | undefined> => {
    const user = await prisma.user.findUnique({
        where: { chat_id: chatId },
    });
    return user?.userState;
}