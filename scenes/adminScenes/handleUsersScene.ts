import { PrismaClient } from "@prisma/client"
import { bot, setUserSession, userSessions } from "../../bot";
import { editInlineKeyboard } from "../../utils/keyboards/editInlineKeyboard";
import { CallbackQuery, Message } from "typescript-telegram-bot-api/dist/types";
import { createInlineKeyboard } from "../../utils/keyboards/createInlineKeyboard";
import { adminScene } from "./adminScene";

const prisma = new PrismaClient();

let currentUsersListener: (query: any) => void;

export const handleUsersScene = async (chatId: number) => {

    const users = await prisma.user.findMany();


    for (const user of users) {
        createInlineKeyboard(
            chatId,
            `Ім'я: ${user.name}\n${user.isBlocked ? "Заблокований" : "Незаблокований"}\nКонтакти: ${user.contact}`,
            [
                [{ text: 'Заблокувати', callback_data: `block_user_${user.chat_id}` }],
                [{ text: 'Розблокувати', callback_data: `unblock_user_${user.chat_id}` }],
                [{ text: 'Видалити', callback_data: `delete_user_${user.chat_id}` }],

            ]
        );
    }


    if (currentUsersListener) {
        bot.removeListener('callback_query', currentUsersListener);
    }

    currentUsersListener = async (query: CallbackQuery) => {
        if (query.message?.chat.id === chatId) {
            const [action, , userId] = query.data!.split('_');

            if (action === 'block') {
                await prisma.user.update({
                    where: { chat_id: parseInt(userId) },
                    data: { isBlocked: true }
                });
                userSessions.set(parseInt(userId), { userState: "unregistered", isUserBlocked: true, chatId: parseInt(userId), lastActivity: 0 });
                await editInlineKeyboard(query, `Користувача заблоковано`, [
                ]);
                await sendMessageToUser(parseInt(userId), "Ви були заблоковані адміністратором. Щоб продовжити роботу з ботом, зверніться до адміністратора. @polter01")

            } else if (action === 'unblock') {
                await prisma.user.update({
                    where: { chat_id: parseInt(userId) },
                    data: { isBlocked: false }
                });
                userSessions.set(parseInt(userId), { userState: "unregistered", isUserBlocked: false, chatId: parseInt(userId), lastActivity: 0 });
                await editInlineKeyboard(query, `Користувача розблоковано`, [
                ]);
                await sendMessageToUser(parseInt(userId), "Ви були розблоковані адміністратором.")
            } else if (action === 'delete') {
                await deleteUser(parseInt(userId));

                await editInlineKeyboard(query, `Користувача видалено`, [

                ]);
            } else if (query.data === 'admin-back') {
                await adminScene(chatId);
            }

            await bot.answerCallbackQuery({ callback_query_id: query.id! });
        }
    };

    bot.once('callback_query', currentUsersListener);
};

async function deleteUser(userId: number) {

    await prisma.user.update({
        where: { chat_id: userId },
        data: { teamCode: "" }
    });

    userSessions.set(userId, { userState: "unregistered", isUserBlocked: false, chatId: userId, lastActivity: 0 });

    await prisma.user.delete({
        where: { chat_id: userId }
    });

    await sendMessageToUser(userId, "Ваш акаунт було видалено адміністратором. Щоб продовжити роботу з ботом, використайте команду /start.");
}
export async function sendMessageToUser(userId: number, text: string) {
    await bot.sendMessage({ chat_id: userId, text: text });
}