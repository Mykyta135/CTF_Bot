import { CallbackQuery } from "typescript-telegram-bot-api/dist/types"
import { editInlineKeyboard } from "../../utils/keyboards/editInlineKeyboard"

const testTaskText = `
Готові провести неймовірні декілька годин та вихопити кожен прапорець?

<a href="google.com">Залітай!</a>

`

export const testTaskScene = (query: CallbackQuery) => {
    editInlineKeyboard(query, testTaskText, [[{ text: 'Назад', callback_data: 'back' }]]);
}