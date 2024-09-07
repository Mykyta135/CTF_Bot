import { CallbackQuery, Message } from "typescript-telegram-bot-api/dist/types";
import { bot, userSessions } from "../../bot";
import { createInlineKeyboard } from "../../utils/keyboards/createInlineKeyboard";
import { adminLayout } from "../../utils/keyboards/adminLayout";
import { handleTeamsScene } from "./handleTeamsScene";
import { sendMessageAll } from "../../utils/database/adminScenes/sendMessageAll";
import { startEventScene } from "./startEventScene";
import {
  handleCallbackQuery,
  removeUnneceseryListeners,
} from "../userScenes/homeScene";
import { handleUsersScene } from "../adminScenes/handleUsersScene";

export let currentAdminListener: (query: any) => void;

export const adminScene = async (chatId: number) => {
  // logOfUser(message, "Entered Admin Scene");

  await createInlineKeyboard(chatId, "BeParadnishe", adminLayout);

  removeUnneceseryListeners(handleCallbackQuery, currentAdminListener);

  currentAdminListener = async (query: CallbackQuery) => {
    if (query.message?.chat.id === chatId) {
      switch (query.data) {
        case "all_teams":
          await handleTeamsScene(chatId);
          break;
        case "start_event":
          await startEventScene(query);
          break;
        case "all_users":
          await handleUsersScene(chatId);
          break;
        case "send_to_all":
          await bot.sendMessage({
            chat_id: chatId,
            text: "Введіть повідомлення яке ви хочете відправити",
          });
          await sendMessageAll();
          break;
        case "clear_cache":
          userSessions.clear();
          await bot.sendMessage({ chat_id: chatId, text: "Кеш очищено" });
          break;
      }
    }
  };

  bot.once("callback_query", currentAdminListener);
};
