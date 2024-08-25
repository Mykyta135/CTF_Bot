import { CallbackQuery } from "typescript-telegram-bot-api/dist/types";
import { editInlineKeyboard } from "../../keyboards/editInlineKeyboard";
import { PrismaClient } from "@prisma/client";
import { deletedTeams } from "./deleteTeam";

interface DeletedTeam {
    users: string[];
    teamName: string;
    isTestValid: boolean;
    isTestSent: boolean;
}

const prisma = new PrismaClient();
export const undoDeleteTeam = async (query: CallbackQuery, teamId: string, deletedTeam: DeletedTeam) => {
    const userIds = deletedTeam.users;
    const teamName = deletedTeam.teamName;
    const isTestValid = deletedTeam.isTestValid;
    const isTestSent = deletedTeam.isTestSent;

    if (!userIds) {
        return editInlineKeyboard(query, "Не вдалося повернути команду.", []);
    }
    userIds.forEach(async (userId) => {
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                teamCode: teamId
            },
        });
    });

    await prisma.team.create({
        data: {
            name: teamName,
            tid: teamId,
            isTestValid: isTestValid,
            isTestSent: isTestSent
        },
    });

    delete deletedTeams[teamId];

    editInlineKeyboard(query, "Команда повернена.", [[{ text: 'Назад', callback_data: `back` }]]);
};
