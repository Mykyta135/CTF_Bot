import { CallbackQuery, Message } from "typescript-telegram-bot-api/dist/types";
import { editInlineKeyboard } from "../../utils/keyboards/editInlineKeyboard";
const aboutBestText = `
Все ще шукаєш команду?
Долучайся до нашого чату, де збираються такі ж, як і ти! Тут ти зможеш знайти або створити свою незабутню команду. Не зволікай – <a href='google.com'>приєднуйся зараз!</a> 


`


export const chatScene = (query: CallbackQuery) =>{
    editInlineKeyboard(query, aboutBestText, [[{ text: 'Назад', callback_data: 'back' }]]);
}


