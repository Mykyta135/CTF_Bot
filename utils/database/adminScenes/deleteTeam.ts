import { PrismaClient } from "@prisma/client"
import { CallbackQuery, InlineKeyboardButton, KeyboardButton, Message } from "typescript-telegram-bot-api/dist/types"
import {  editInlineKeyboard } from "../../keyboards/editInlineKeyboard"
import { sendMessageByTeamId } from "./sendMessageById"
import { userSessions } from "../../../bot"


const prisma = new PrismaClient()



export const deleteTeam = async (query: CallbackQuery, teamId: string, layout: InlineKeyboardButton[][]) => {


    await sendMessageByTeamId(teamId, 'Ваша команда була видалена. Ви можете створити нову команду або приєднатися до іншої');



    const teamMembers = await prisma.user.findMany({
        where: {
            teamCode: teamId
        }
    })
    teamMembers.forEach(async (member) => {
        userSessions.set(member.chat_id, { userState: "registered", chatId: member.chat_id, lastActivity: 0 });
    })

    await prisma.user.updateMany({
        where: { teamCode: teamId },

        data: {
            teamCode: "",
            userState: "registered",
            stateCount: 1
        },
    });

    await prisma.team.delete({
        where: { tid: teamId },
    });


    await editInlineKeyboard(query, "Команда видалена", layout);



}

