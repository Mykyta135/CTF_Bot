import { Message } from "typescript-telegram-bot-api/dist/types";
import { bot } from "../../bot";
import { teamInfoScene } from "./teamInfoScene";


import { PrismaClient, User } from "@prisma/client";
import { eventLocationScene } from "./eventLocationScene";
import { logOfUser } from "../../utils/logOfUser";
import { createInlineKeyboard } from "../../utils/keyboards/createInlineKeyboard";
import { unregisteredHomeLayout, registeredHomeLayout, onEventHomeLayout } from "../../utils/keyboards/homeSceneLayout";
import { RegistrationScene } from "./registrationScene";
import { getUserCache } from "../../bot";
import { getUserFromDb } from "../../utils/database/userScenes/getUserFromDb";
import { aboutEvent } from "./aboutEventScene";
import { aboutBest } from "./aboutBestScene";
import { editInlineKeyboard } from "../../utils/keyboards/editInlineKeyboard";
import { chatScene } from "./chatScene";
import { testTaskScene } from "./testTaskScene";
import { rulesScene } from "./rulesScene";
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
const prisma = new PrismaClient();


export const HomeScene = async (message: Message) => {

    bot.removeAllListeners('callback_query');
    const { userState, isUserBlock } = getUserCache(message);



    await handleUser(message, isUserBlock, userState);

    const keyboardLayout = await handleKeyboardLayout(message);

    logOfUser(message, "entered home scene");
    logOfUser(message, `User state: ${userState}, User blocked: ${isUserBlock}`);

    createInlineKeyboard(message, startMessage, keyboardLayout);

    bot.on('callback_query', (query) => {
        if (query.data === 'my_team') {
            teamInfoScene(message, query);
        }
        if (query.data === 'event_location') {
            eventLocationScene(query);
        }

        if (query.data === 'registration') {
            if (userState === 'unregistered') {
                RegistrationScene(message);
            }
            else {
                editInlineKeyboard(query, "Ви вже зареєстровані", []);
            }
        }

        if (query.data === 'about_event') {
            aboutEvent(query);
        }
        if (query.data === 'about_best') {
            aboutBest(query);
        }
        if (query.data === 'about_chat') {
            chatScene(query);
        }
        if (query.data === 'test_task') {
            testTaskScene(query);
        }
        if (query.data === 'rules') {
            rulesScene(query);
        }
        if (query.data === 'back') {
            editInlineKeyboard(query, startMessage, keyboardLayout);
        }
    });


}


async function handleUser(message: Message, isUserBlock: boolean | undefined, userState: string | undefined) {
    if (isUserBlock === undefined || userState === undefined) {
        logOfUser(message, "There is no user");
        await prisma.user.create({
            data: {
                chat_id: message.chat.id,
                name: '',
                surname: '',
                age: 0,
                university: '',
                group: '',
                course: 0,
                source: '',
                contact: 0,
                userState: 'unregistered',
            }
        })
    }
    else {
        logOfUser(message, "User loaded from DB");
        await getUserFromDb(message);
    }
}

export async function handleKeyboardLayout(message: Message) {
    const user = await getUserFromDb(message);
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