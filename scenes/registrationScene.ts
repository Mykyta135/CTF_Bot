import { Message } from 'typescript-telegram-bot-api/dist/types';
import { bot, initialScene } from '../bot';
import { handleUserInput } from '../utils/handleUserInput';
import { createUser } from '../utils/database/createUser';
import { handleUserContact } from '../utils/handleUserContact';

import {
    name,
    surname,
    age,
    university,
    group,
    course,
    source,
    contact,

} from '../validation/UserSchema';
import { HomeScene } from './homeScene';
import { logOfUser } from '../utils/logOfUser';

export const RegistrationScene = async (message: Message, userStateCache: Map<number, string>) => {
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


    await createUser({
        name: userName,
        surname: userSurname,
        age: userAge,
        university: userUniversity,
        group: userGroup,
        course: userCourse,
        source: userSource,
        contact: userContact,
        userState: 'home',
        chat_id: message.chat.id,
        teamCode: '',
        isTestPassed: false,
    }, message.chat.id);
    userStateCache.set(message.chat.id, 'home');
    await initialScene(message);
};

