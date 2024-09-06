import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();
export const getUserFromDb = async (chatId: number) => {

    const user = await prisma.user.findUnique({
        where: {
            chat_id: chatId,
        }
    });
    if (!user) {
        const newUser = await createNewUser(chatId);
        return newUser;
    }
    else {
        return user
    }


}

async function createNewUser(chatId: number) {
    // logOfUser(message, "There is no user");
    const newUser = await prisma.user.create({
        data: {
            chat_id: chatId,
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
    return newUser;
}

