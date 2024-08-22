import { bot } from "../bot";
import { safeParse } from "./safeParse";

export const handleUserContact = (chatId: number, promptText: string, schema: any) => {
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