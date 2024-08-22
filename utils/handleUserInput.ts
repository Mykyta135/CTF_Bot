import { Message } from 'typescript-telegram-bot-api/dist/types';
import { bot } from '../bot';
import { safeParse } from './safeParse';

export const handleUserInput = (chatId: number, promptText: string, schema: any, isNumber = false): Promise<string | number> => {
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
