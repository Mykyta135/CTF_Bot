import { PrismaClient } from '@prisma/client';
import { User } from '../../validation/UserSchema';
import z from 'zod';
import { bot } from '../../bot';
const prisma = new PrismaClient();

export async function createUser(data: any, chatId: number) {
    try {
        const validatedUser = User.parse(data);

        const newUser = await prisma.user.create(
            {
                data: validatedUser,
            }
        );

        return newUser;
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.log('Validation Error: ', error.errors);
            bot.sendMessage({
                chat_id: chatId,
                text: `Помилка валідації: ${error.errors[0].message}`
            });
        } else {
            console.log('Database Error: ', error);
            bot.sendMessage({
                chat_id: chatId,
                text: `Помилка бази даних. Спробуйте пізніше`
            });
        }
    }
}
