import { PrismaClient } from "@prisma/client"
import { editInlineKeyboard } from "../../keyboards/inlineKeyboards/editInlineKeyboard"
import { sendMessageById } from "./sendMessageById"

const prisma = new PrismaClient()

export const declineTeam = async (query: any, teamId: string) => {

    prisma.team.update({
        where: {
            tid: teamId
        },
        data: {
            isTestValid: false
        }
    }).then(async () => {
        editInlineKeyboard(query, "Команда не затверджена", [[{ text: 'neparada', callback_data: 'neparada' }]])
        await sendMessageById(teamId, 'Ви не пройшли тест =(');
    })
}