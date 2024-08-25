import { PrismaClient } from "@prisma/client"
import { editInlineKeyboard } from "../../keyboards/editInlineKeyboard"
import { sendMessageById } from "./sendMessageById"
import { updateStateCounter } from "./updateStateCounter"

const prisma = new PrismaClient()

export const aprooveTeam = async (query: any, teamId: string) => {

    prisma.team.update({
        where: {
            tid: teamId
        },
        data: {
            isTestValid: true,

        }
    }).then(async () => {
        prisma.user.findMany({
            where: {
                teamCode: teamId
            }
        }).then(async (users) => {
            for (const user of users) {
                await updateStateCounter(user.chat_id, 2)
            }
        })

        editInlineKeyboard(query, "Команда затверджена", [[{ text: 'parada', callback_data: 'parada' }]])
        await sendMessageById(teamId, 'Ви пройшли тест');

    })
}
