import { PrismaClient } from '@prisma/client';
import { User } from '../../../schemas/UserSchema';
import z from 'zod';
import { bot } from '../../../bot';
const prisma = new PrismaClient();

export async function registerUser(data: any, chatId: number) {
    try {
        const validatedUser = User.parse(data);

        const user = await prisma.user.update(
            {
                where: {
                    chat_id: chatId,
                },
                data: validatedUser,
            }

        );

        return user;
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.log('Validation Error: ', error.errors);
            await bot.sendMessage({
                chat_id: chatId,
                text: `Помилка валідації: ${error.errors[0].message}`
            });
        } else {
            console.log('Database Error: ', error);
            await bot.sendMessage({
                chat_id: chatId,
                text: `Помилка бази даних. Спробуйте пізніше`
            });
        }
    }
}
