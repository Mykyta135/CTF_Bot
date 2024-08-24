import { PrismaClient } from "@prisma/client"
import { editInlineKeyboard } from "../../keyboards/inlineKeyboards/editInlineKeyboard"
import { sendMessageById } from "./sendMessageById"
import { HomeScene } from "../../../scenes/homeScene"
import { initialScene } from "../../../bot"

const prisma = new PrismaClient()

export const aprooveTeam = async (query: any, teamId: string) => {

    prisma.team.update({
        where: {
            tid: teamId
        },
        data: {
            isTestValid: true
        }
    }).then(async () => {
        editInlineKeyboard(query, "Команда затверджена", [[{ text: 'parada', callback_data: 'parada' }]])
        await sendMessageById(teamId, 'Ви пройшли тест');
        await initialScene(query.message)
    })
}
