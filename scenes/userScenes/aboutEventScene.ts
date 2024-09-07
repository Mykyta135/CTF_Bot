import { CallbackQuery } from "typescript-telegram-bot-api/dist/types";
import { editInlineKeyboard } from "../../utils/keyboards/editInlineKeyboard";
import { bot } from "../../bot";
import { startMessage } from "./homeScene";
const aboutEventText = `
<u><i>Щоб знати як захищати, треба знати як атакувати!</i></u>

<b>BEST CTF</b> — це командні змагання з інформаційної безпеки, які проводяться у форматі "захоплення прапора", де команди намагаються знайти більше вразливостей в системі, і використовуючи їх отримати секретні дані.

<b>Змагання будуть відбуватися 16-17 листопада.</b>

Наш сайт: <a href="google.com">(посилання)</a>
`;

export const aboutEvent = async (
  chatId: number,
  query: CallbackQuery,
  keyboardLayout: any,
) => {
  await editInlineKeyboard(query, aboutEventText, [
    [{ text: "Назад", callback_data: "back" }],
  ]);

  bot.once("callback_query", async (q: CallbackQuery) => {
    if (q.data === "back" && q.message?.chat.id === chatId) {
      await editInlineKeyboard(query, startMessage, keyboardLayout);
    }
  });
};
