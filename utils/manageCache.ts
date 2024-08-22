import { Message } from "typescript-telegram-bot-api/dist/types";
import { getUserBlockInfo } from "./database/getUser";
import { getUserState } from "./handleUserState";
import { logOfUser } from "./logOfUser";

export const manageCache = async (message: Message, userStateCache: Map<number, string>, isUserBlocked: Map<number, boolean>) => {

    let userState = userStateCache.get(message.chat.id);
    let userBlocked = isUserBlocked.get(message.chat.id);

    if (userState === undefined) {
        await logOfUser(message, 'User state not found');
        userState = await getUserState(message.chat.id);
        userStateCache.set(message.chat.id, userState);
    }
    if (userBlocked === undefined) {
        await logOfUser(message, 'User blocked not found');
        userBlocked = await getUserBlockInfo(message);
        isUserBlocked.set(message.chat.id, userBlocked!);
    }
    if (userBlocked !== undefined) {
        userBlocked = await getUserBlockInfo(message);
        isUserBlocked.set(message.chat.id, userBlocked!);
    }
    return { userState, userBlocked };
}
