import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const getUserState = async (chatId: number): Promise<string> => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                chat_id: chatId,
            },
        });
        if (user) {
            return user.userState;
        } else {
            return "registration";
        }
    }
    catch (e) {
        console.log(e);
        return "registration";
    }
}



export const setUserState = async (chatId: number, state: string) => {
    try{
        await prisma.user.update({
            where: {
                chat_id: chatId,
            },
            data: {
                userState: state,
            },
        });
    }catch(e){
        console.log(e);
    }
}
