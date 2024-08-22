import { bot } from "../bot";

export const safeParse = async (chat_id: number, schema: any, data: any): Promise<boolean> => {
    const result = schema.safeParse(data);
    if (!result.success) {
        await bot.sendMessage({ chat_id: chat_id, text: `${result.error.errors[0]?.message}` });
        console.log(result.error.errors);
        return false;
    } else {
        return true;
    }
};



