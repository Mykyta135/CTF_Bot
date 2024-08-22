import { PrismaClient } from "@prisma/client"
import { CallbackQuery, Message } from "typescript-telegram-bot-api/dist/types"
import { editInlineKeyboard } from "../../keyboards/inlineKeyboards/editInlineKeyboard"
import { bot } from "../../../bot";
import { undoDeleteTeam } from "./undoDeletedTeam";

const prisma = new PrismaClient()

export const deletedTeams: {
    [key: string]: {
        users: string[],
        teamName: string,
        isTestValid: boolean,
        isTestSent: boolean
    }
} = {};

export const deleteTeam = async (query: CallbackQuery, teamId: string) => {
    const users = await prisma.user.findMany({
        where: { teamCode: teamId },
        select: { id: true },
    });
    const team = await prisma.team.findUnique({
        where: { tid: teamId }
    })
    deletedTeams[teamId] = {
        users: users.map(user => user.id),
        teamName: team?.name ?? "",
        isTestValid: team?.isTestValid ?? false,
        isTestSent: team?.isTestSent ?? false
    },


        await prisma.user.updateMany({
            where: { teamCode: teamId },
            data: { teamCode: "" },
        });

    await prisma.team.delete({
        where: { tid: teamId },
    });

    editInlineKeyboard(query, "Команда видалена", [
        [{ text: 'Undo', callback_data: `undo_${teamId}` }]
    ]);
    bot.on('callback_query', async (query) => {
        if (team)
            if (query.data!.includes('undo')) {
                await undoDeleteTeam(query, teamId, deletedTeams[teamId]);
            }
    });
}

