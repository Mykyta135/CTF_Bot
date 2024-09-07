import { CallbackQuery } from "typescript-telegram-bot-api/dist/types";
import { editInlineKeyboard } from "../../utils/keyboards/editInlineKeyboard";
import { bot } from "../../bot";
import { startMessage } from "./homeScene";

export const eventLocationScene = async (
  chatId: number,
  query: CallbackQuery,
  keyboardLayout: any,
) => {
  await editInlineKeyboard(query, "Змагання у твоєї мамаши вдома", [
    [{ text: "", callback_data: "back" }],
  ]);

  bot.once("callback_query", async (q: CallbackQuery) => {
    if (q.data === "back" && q.message?.chat.id === chatId) {
      await editInlineKeyboard(query, startMessage, keyboardLayout);
    }
  });
};
