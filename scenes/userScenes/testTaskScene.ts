import { CallbackQuery } from "typescript-telegram-bot-api/dist/types";
import { editInlineKeyboard } from "../../utils/keyboards/editInlineKeyboard";
import { bot } from "../../bot";
import { startMessage } from "./homeScene";

const testTaskText = `
Готові провести неймовірні декілька годин та вихопити кожен прапорець?

<a href="google.com">Залітай!</a>

`;

export const testTaskScene = async (
  chatId: number,
  query: CallbackQuery,
  keyboardLayout: any,
) => {
  await editInlineKeyboard(query, testTaskText, [
    [{ text: "Назад", callback_data: "back" }],
  ]);

  bot.once("callback_query", async (q: CallbackQuery) => {
    if (q.data === "back" && q.message?.chat.id === chatId) {
      await editInlineKeyboard(query, startMessage, keyboardLayout);
    }
  });
};
