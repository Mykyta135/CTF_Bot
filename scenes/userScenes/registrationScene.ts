import { Message } from 'typescript-telegram-bot-api/dist/types';
import { bot, removeAllListeners, sceneController, userStateCache } from '../../bot';
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
import { logOfUser } from '../../utils/logOfUser';

export const RegistrationScene = async (message: Message) => {


    logOfUser(message, "entered registration scene");
    await bot.sendMessage({ chat_id: message.chat.id, text: 'Ласкаво просимо до CТF боту' });


    const userName = await handleUserInput(message.chat.id, 'Введіть ім\'я', name);
    console.log(`Name: ${userName}`);

    const userSurname = await handleUserInput(message.chat.id, 'Введіть прізвище', surname);
    console.log(`Surname: ${userSurname}`);

    const userAge = await handleUserInput(message.chat.id, 'Введіть вік', age, true);
    console.log(`Age: ${userAge}`);

    const userUniversity = await handleUserInput(message.chat.id, 'Введіть університет', university);
    console.log(`University: ${userUniversity}`);

    const userGroup = await handleUserInput(message.chat.id, 'Введіть групу', group);
    console.log(`Group: ${userGroup}`);

    const userCourse = await handleUserInput(message.chat.id, 'Введіть курс', course, true);
    console.log(`Course: ${userCourse}`);

    const userSource = await handleUserInput(message.chat.id, 'Як дізналися про проєкт?', source);
    console.log(`Source: ${userSource}`);

    const userContact = await handleUserContact(message.chat.id, 'Введіть контакт', contact);
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
        chat_id: message.chat.id,
        teamCode: '',
        isTestPassed: false,
        stateCount: 1,
    }, message.chat.id);

    userStateCache.set(message.chat.id, 'registered');


    await sceneController(message);


};



const handleUserInput = (chatId: number, promptText: string, schema: any, isNumber = false): Promise<string | number> => {
    return new Promise((resolve) => {
        bot.sendMessage({ chat_id: chatId, text: promptText });

        const messageHandler = async (message: Message) => {
            if (message.chat.id === chatId && message.text) {
                bot.removeListener('message', messageHandler);

                let input = message.text;

                if (isNumber) {
                    const parsedNumber = parseInt(input);

                    if (await safeParse(message.chat.id, schema, parsedNumber)) {
                        resolve(parsedNumber);
                    } else {
                        resolve(handleUserInput(chatId, promptText, schema, isNumber));
                    }

                } else {
                    if (await safeParse(message.chat.id, schema, input)) {
                        resolve(input);
                    } else {
                        resolve(handleUserInput(chatId, promptText, schema, isNumber));
                    }
                }


            }
        };

        bot.on('message', messageHandler);
    });
};

const safeParse = async (chat_id: number, schema: any, data: any): Promise<boolean> => {
    const result = schema.safeParse(data);
    if (!result.success) {
        await bot.sendMessage({ chat_id: chat_id, text: `${result.error.errors[0]?.message}` });
        console.log(result.error.errors);
        return false;
    } else {
        return true;
    }
};

const handleUserContact = (chatId: number, promptText: string, schema: any) => {
    return new Promise((resolve) => {
        bot.sendMessage({
            chat_id: chatId,
            text: promptText,
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: 'Поділитися контактом',
                            request_contact: true,
                        }
                    ]
                ],
                one_time_keyboard: true,
                resize_keyboard: true
            }
        });

        const contactHandler = async (message: any) => {
            if (message.chat.id === chatId && message.contact) {
                bot.removeListener('message', contactHandler);
                const input = Number(message.contact.phone_number.replace('+', ''));

                if (await safeParse(message.chat.id, schema, input)) {
                    resolve(input);
                    bot.sendMessage({ chat_id: chatId, text: 'Дякуємо!', reply_markup: { remove_keyboard: true } });
                } else {
                    resolve(handleUserContact(chatId, promptText, schema));
                }
            } else {
                bot.sendMessage({
                    chat_id: chatId, text: 'Будь ласка, поділіться своїм контактом', reply_markup: {
                        keyboard: [
                            [
                                {
                                    text: 'Поділитися контактом',
                                    request_contact: true,
                                }
                            ]
                        ],
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                });
            }
        };

        bot.on('message', contactHandler);
    });
}