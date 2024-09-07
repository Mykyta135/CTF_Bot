import { CallbackQuery } from "typescript-telegram-bot-api/dist/types";
import { editInlineKeyboard } from "../../utils/keyboards/editInlineKeyboard";
import { bot } from "../../bot";
import { startMessage } from "./homeScene";
const aboutBestText = `
Все ще шукаєш команду?
Долучайся до нашого чату, де збираються такі ж, як і ти! Тут ти зможеш знайти або створити свою незабутню команду. Не зволікай – <a href='google.com'>приєднуйся зараз!</a>


`;

export const chatScene = async (
  chatId: number,
  query: CallbackQuery,
  keyboardLayout: any,
) => {
  await editInlineKeyboard(query, aboutBestText, [
    [{ text: "Назад", callback_data: "back" }],
  ]);

  bot.once("callback_query", async (q: CallbackQuery) => {
    if (q.data === "back" && q.message?.chat.id === chatId) {
      await editInlineKeyboard(query, startMessage, keyboardLayout);
    }
  });
};
