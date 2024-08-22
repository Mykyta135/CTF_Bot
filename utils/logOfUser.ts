import { Message } from "typescript-telegram-bot-api/dist/types";

export const logOfUser = async (message: Message, text: string) => {
    console.log(
        "user: " + message.from?.username + "\n" +
        "info: " + text + "\n"
    );
};