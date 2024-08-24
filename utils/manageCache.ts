import { Message } from "typescript-telegram-bot-api/dist/types";
import { getUserInfo } from "./database/getUser";
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
        await logOfUser(message, 'User blocked info not found');
        userBlocked = await getUserInfo(message).then((user) => user?.isBlocked);
        isUserBlocked.set(message.chat.id, userBlocked!);
    }
    // if (userBlocked !== undefined) {
    //     userBlocked = await getUserBlockInfo(message);
    //     await logOfUser(message, 'User block info found');
    //     isUserBlocked.set(message.chat.id, userBlocked!);
    // }
    return { userState, userBlocked };
}
