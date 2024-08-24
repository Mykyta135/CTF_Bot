import { PrismaClient } from "@prisma/client"
import { bot } from "../../bot";
import { editInlineKeyboard } from "../../utils/keyboards/inlineKeyboards/editInlineKeyboard";
import { CallbackQuery, Message } from "typescript-telegram-bot-api/dist/types";
import { createInlineKeyboard } from "../../utils/keyboards/inlineKeyboards/createInlineKeyboard";
import { adminScene } from "./adminScene";
import { userState } from "../../validation/UserSchema";

const prisma = new PrismaClient();

export const handleUsersScene = async (message: Message, isUserBlocked: Map<number, boolean>, userStateCache: Map<number, string>) => {
    bot.removeAllListeners('message');
    bot.removeAllListeners('callback_query');



    await prisma.user.findMany().then((users) => {

        users.forEach((user) => {
            createInlineKeyboard(message, `Ім'я: ${user.name} \n ${user.isBlocked ? "Заблокований" : "Незаблокований"} \n Контакти: ${user.contact}`, [
                [
                    { text: 'Заблокувати', callback_data: `block_user_${user.chat_id}` }
                ],
                [
                    { text: 'Розблокувати', callback_data: `unblock_user_${user.chat_id}` }
                ],
                [
                    { text: 'Видалити', callback_data: `delete_user_${user.chat_id}` }
                ],
                [
                    { text: 'Назад', callback_data: `back` }
                ]
            ]);
        });
        bot.on('callback_query', async (query) => {

            if (query.data!.includes('block_user')) {
                const userId = query.data!.split('_')[2];
                await prisma.user.update({
                    where: {
                        chat_id: parseInt(userId)
                    },
                    data: {
                        isBlocked: true
                    }
                }).then(() => {
                    editInlineKeyboard(query, `Користувача заблоковано`, [[
                        { text: 'Назад', callback_data: `back` }
                    ]]);
                    isUserBlocked.set(parseInt(userId), true);
                });
            }

            if (query.data!.includes('unblock_user')) {
                const userId = query.data!.split('_')[2];
                await prisma.user.update({
                    where: {
                        chat_id: parseInt(userId)
                    },
                    data: {
                        isBlocked: false
                    }
                }).then(() => {
                    editInlineKeyboard(query, `Користувача розблоковано`, [[
                        { text: 'Назад', callback_data: `back` }
                    ]]);
                    isUserBlocked.set(parseInt(userId), false);
                });
            }
            if (query.data!.includes('delete_user')) {
                const userId = query.data!.split('_')[2];
                await prisma.user.delete({
                    where: {
                        chat_id: parseInt(userId)
                    }
                }).then((user) => {
                    editInlineKeyboard(query, `Користувача видалено`, [[
                        { text: 'Назад', callback_data: `back` }
                    ]]);
                    isUserBlocked.delete(parseInt(userId));
                    userStateCache.delete(parseInt(userId));
                    user.userState = "registration";
                });
            }
            if (query.data === 'back') {
                await adminScene(message, isUserBlocked);
            }
        });
    });
}