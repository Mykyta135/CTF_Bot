import { Message } from 'typescript-telegram-bot-api/dist/types';
import { bot, setUserSession, UserSession } from '../../bot';
import { registerUser } from '../../utils/database/userScenes/registerUser';

import {
    name,
    surname,
    age,
    university,
    group,
    course,
    source,
    contact,


} from '../../schemas/UserSchema';
import { HomeScene } from './homeScene';

export const RegistrationScene = async (chatId: number, session: UserSession) => {
    session.userState = 'registrating';
    // logOfUser(message, `entered registration scene ${session.userState}`);
    await bot.sendMessage({ chat_id: chatId, text: 'Ласкаво просимо до CТF боту' });


    const userName = await handleUserInput(session, chatId, 'Введіть ім\'я', name);
    console.log(`Name: ${userName}`);

    const userSurname = await handleUserInput(session, chatId, 'Введіть прізвище', surname);
    console.log(`Surname: ${userSurname}`);

    const userAge = await handleUserInput(session, chatId, 'Введіть вік', age, true);
    console.log(`Age: ${userAge}`);

    const userUniversity = await handleUserInput(session, chatId, 'Введіть університет', university);
    console.log(`University: ${userUniversity}`);

    const userGroup = await handleUserInput(session, chatId, 'Введіть групу', group);
    console.log(`Group: ${userGroup}`);

    const userCourse = await handleUserInput(session, chatId, 'Введіть курс', course, true);
    console.log(`Course: ${userCourse}`);

    const userSource = await handleUserInput(session, chatId, 'Як дізналися про проєкт?', source);
    console.log(`Source: ${userSource}`);

    const userContact = await handleUserContact(session, chatId, 'Введіть контакт', contact);
    console.log(`Contact: ${userContact}`);


    await registerUser({
        name: userName,
        surname: userSurname,
        age: userAge,
        university: userUniversity,
        group: userGroup,
        course: userCourse,
        source: userSource,
        contact: userContact,
        userState: 'registered',
        chat_id: chatId,
        teamCode: '',
        isTestPassed: false,
        stateCount: 1,
    }, chatId);


    session.userState = 'registered';
    await HomeScene(chatId);


};



const safeParse = async (chatId: number, schema: any, data: any): Promise<boolean> => {
    const result = schema.safeParse(data);
    if (!result.success) {
        await bot.sendMessage({ chat_id: chatId, text: `${result.error.errors[0]?.message}` });
        console.log(result.error.errors);
        return false;
    }
    return true;
};




async function handleUserInput(session: UserSession, chatId: number, promptText: string, schema: any, isNumber = false): Promise<string | number> {

    return new Promise((resolve) => {
        bot.sendMessage({ chat_id: chatId, text: promptText });

        const messageHandler = async (message: Message) => {
            if (message.text === '/start' && chatId === message.chat.id && message.text) {
                session.userState = 'unregistered';
                bot.removeListener('message', messageHandler);
            } else
                if (chatId === message.chat.id && message.text) {
                    bot.removeListener('message', messageHandler);

                    let input = message.text;

                    if (isNumber) {
                        const parsedNumber = parseInt(input);

                        if (await safeParse(chatId, schema, parsedNumber)) {
                            resolve(parsedNumber);
                        } else {
                            resolve(await handleUserInput(session, chatId, promptText, schema, isNumber));
                        }

                    } else {
                        if (await safeParse(chatId, schema, input)) {
                            resolve(input);
                        } else {
                            resolve(await handleUserInput(session, chatId, promptText, schema, isNumber));
                        }
                    }
                }
        };

        bot.once('message', messageHandler);
    });
}

const handleUserContact = (session: UserSession, chatId: number, promptText: string, schema: any): Promise<number> => {

    return new Promise((resolve, reject) => {

        bot.sendMessage({
            chat_id: chatId,
            text: promptText,
            reply_markup: {
                keyboard: [
                    [{ text: 'Поділитися контактом', request_contact: true }]
                ],
                one_time_keyboard: true,
                resize_keyboard: true
            }
        });

        const contactHandler = async (message: Message) => {
            if (message.text === '/start' && chatId === message.chat.id && message.text) {
                session.userState = 'unregistered';
                bot.removeListener('message', contactHandler);
            } else
                if (chatId === message.chat.id && message.contact) {

                    const input = Number(message.contact.phone_number.replace('+', ''));
                    if (await safeParse(chatId, schema, input)) {
                        bot.sendMessage({ chat_id: chatId, text: 'Дякуємо!', reply_markup: { remove_keyboard: true } });
                        resolve(input);
                    } else {
                        bot.removeListener('message', contactHandler);
                        resolve(await handleUserContact(session, chatId, promptText, schema));
                    }
                } else {
                    bot.sendMessage({
                        chat_id: chatId,
                        text: 'Будь ласка, поділіться своїм контактом',
                        reply_markup: {
                            keyboard: [
                                [{ text: 'Поділитися контактом', request_contact: true }]
                            ],
                            one_time_keyboard: true,
                            resize_keyboard: true
                        }
                    });
                    bot.removeListener('message', contactHandler);
                    resolve(await handleUserContact(session, chatId, promptText, schema));
                }
        };


        bot.once('message', contactHandler);
    });
};
