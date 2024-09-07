import { CallbackQuery, Message } from "typescript-telegram-bot-api/dist/types";
import { bot, getUserSession, lastInlineMessageId, UserSession } from "../../bot";
import { teamInfoScene } from "./teamInfoScene";

import { eventLocationScene } from "./eventLocationScene";
import { createInlineKeyboard } from "../../utils/keyboards/createInlineKeyboard";
import { unregisteredHomeLayout, registeredHomeLayout, onEventHomeLayout } from "../../utils/keyboards/homeSceneLayout";
import { RegistrationScene } from "./registrationScene";

import { getUserFromDb } from "../../utils/database/userScenes/getUserFromDb";
import { aboutEvent } from "./aboutEventScene";
import { aboutBest } from "./aboutBestScene";
import {editInlineKeyboard } from "../../utils/keyboards/editInlineKeyboard";
import { chatScene } from "./chatScene";
import { testTaskScene } from "./testTaskScene";
import { rulesScene } from "./rulesScene";
import { currentAdminListener } from "../adminScenes/adminScene";
export const startMessage = `
Привіт, студенте!
<b>Цей бот допоможе тобі:</b>
- Зареєструватися на BEST CTF
- Розпочати тестове завдання
- Знайти необхідну інформацію про CTF, такі як розклад, правила
- Отримувати сповіщення від організаторів у реальному часі 
- Створювати та приєднувати людей до своєї команди
- Визначити чи ти 0 чи 1
`

export let handleCallbackQuery: (query: any) => void;

export const HomeScene = async (chatId: number) => {


    removeUnneceseryListeners(handleCallbackQuery, currentAdminListener);
    // logOfUser(message, "entered home scene");

    const keyboardLayout = await handleKeyboardLayout(chatId);
    const currentMessage = await createInlineKeyboard(chatId, startMessage, keyboardLayout);

    

    handleCallbackQuery = async (query: CallbackQuery) => {
        lastInlineMessageId.set(chatId, currentMessage!);

        if (query.message?.chat.id === chatId && query.message.message_id === lastInlineMessageId.get(chatId)) {

            console.log('query message id', query.message.message_id);
            console.log('curent message id', lastInlineMessageId.get(chatId));
            switch (query.data) {
                case 'my_team':
                    await teamInfoScene(chatId, query);
                    break;
                case 'event_location':
                    await eventLocationScene(chatId, query, keyboardLayout);
                    break;
                case 'registration':
                    await handleRegistrationScene(chatId, query);
                    break;
                case 'about_event':
                    await aboutEvent(chatId, query, keyboardLayout);
                    break;
                case 'about_best':
                    await aboutBest(chatId, query, keyboardLayout);
                    break;
                case 'about_chat':
                    await chatScene(chatId, query, keyboardLayout);
                    break;
                case 'test_task':
                    await testTaskScene(chatId, query, keyboardLayout);
                    break;
                case 'rules':
                    await rulesScene(chatId, query, keyboardLayout);
                    break;
            }
        }
    };

    bot.on('callback_query', handleCallbackQuery); // не once, бо потрібно стежити за всіма інлайн кнопками. Дублікації нема, бо вище видаляються всі попередні слухачі


};

export const handleKeyboardLayout = async (chatId: number) => {
    const user = await getUserFromDb(chatId);

    if (user !== undefined)
        switch (user!.stateCount) {
            case 0: {
                return unregisteredHomeLayout;
            }
            case 1: {
                return registeredHomeLayout;
            }
            case 2: {
                return onEventHomeLayout;
            }
        }
}


const handleRegistrationScene = async (chatId: number, query: any) => {
    const session = getUserSession(chatId);

    if (session.userState === 'unregistered') {
        await RegistrationScene(chatId, session);
    } else if (session.userState === 'registrating') {
        await editInlineKeyboard(query, "Ви вже знаходитесь на етапі реєстрації. Якщо хочете вийти, або почати спочатку, використайте команду /start", []);
    }
    else {
        await editInlineKeyboard(query, "ви вже зареєстровані", []);
    }
}

export const removeUnneceseryListeners = (handleCallbackQuery: any, currentAdminListener: any) => {

    if (handleCallbackQuery) {
        bot.removeListener('callback_query', handleCallbackQuery);

    }
    if (currentAdminListener) {
        bot.removeListener('callback_query', currentAdminListener);
    }

}