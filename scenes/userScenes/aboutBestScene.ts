import { CallbackQuery, Message } from "typescript-telegram-bot-api/dist/types";
import { editInlineKeyboard } from "../../utils/keyboards/editInlineKeyboard";
import { bot } from "../../bot";
import { startMessage } from "./homeScene";
const aboutBestText = `
<a href="google.com">BEST Lviv</a>  — європейська студентська волонтерська організація з 85 осередками в 30 країнах.

Організація спрямована на розвиток студентів у сф'ері технологій, інженерії та менеджменту.

Наша місія — розвиток студентів, а візія — сила у різноманітті

Щороку, ми організовуємо близько 4 - х масштабних івентів, серед яких:
HACKath0n, BEC(Best Engineering Competition), BTW(BEST Training Week) та BCI(Best Company Insight) 

Детальніше про ці івенти ви можете дізнатися в нашому інстаграмі:
<a href='https://www.instagram.com/best_lviv/ '>https://www.instagram.com/best_lviv/ </a>

`


export const aboutBest = async (chatId: number, query: CallbackQuery, keyboardLayout: any) => {
    await editInlineKeyboard(query, aboutBestText, [[{ text: 'Назад', callback_data: 'back' }]]);

    bot.once('callback_query', async (q: CallbackQuery) => {
        if (q.data === 'back' && q.message?.chat.id === chatId) {
            console.log('back')
            await editInlineKeyboard(query, startMessage, keyboardLayout);
        }
    });
}


