import { PrismaClient } from "@prisma/client"
import { editInlineKeyboard } from "../../keyboards/editInlineKeyboard"
import { sendMessageByTeamId } from "./sendMessageById"

const prisma = new PrismaClient()

export const declineTeam = async (query: any, teamId: string) => {

    await prisma.team.update({
        where: {
            tid: teamId
        },
        data: {
            isTestValid: false,
        }
    })
    editInlineKeyboard(query, "Команда не затверджена", [[{ text: 'neparada', callback_data: 'neparada' }]])
    const users = await prisma.user.findMany({
        where: {
            teamCode: teamId
        },
       
    })
    
    await sendMessageByTeamId(teamId, 'Ви не пройшли тестове завання =( Не засмучуйтесь та обов\'яво рухайтесь далі!');



}