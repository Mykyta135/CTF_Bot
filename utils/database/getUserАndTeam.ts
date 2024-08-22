import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const getUserAndTeam = async (chatId: number) => {
    const user = await prisma.user.findUnique({ where: { chat_id: chatId } });
    if (!user) return { user: null, team: null };

    const team = user.teamCode ? await prisma.team.findUnique({ where: { tid: user.teamCode } }) : null;
    return { user, team };
};
