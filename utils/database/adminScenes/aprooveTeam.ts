import { PrismaClient } from "@prisma/client"
import {  editInlineKeyboard } from "../../keyboards/editInlineKeyboard"
import { sendMessageByTeamId } from "./sendMessageById"
import { updateStateCounter } from "./updateStateCounter"

const prisma = new PrismaClient()

export const aprooveTeam = async (query: any, teamId: string) => {

    await prisma.team.update({
        where: {
            tid: teamId
        },
        data: {
            isTestValid: true,

        }
    })

    const users = await prisma.user.findMany({
        where: {
            teamCode: teamId
        }
    })

    for (const user of users) {
        await updateStateCounter(user.chat_id, 2)
    }


    await editInlineKeyboard(query, "Команда затверджена", [[{ text: 'parada', callback_data: 'parada' }]])
    await sendMessageByTeamId(teamId, 'Вітаю! Ви прийшли тестове завдання! Перезапустіть бота командою /start, щоб дізнатися деталі проведення змагань');

}

