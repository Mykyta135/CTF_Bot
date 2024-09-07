import { CallbackQuery } from "typescript-telegram-bot-api/dist/types";

import { startEvent } from "../../utils/database/adminScenes/startEvent";

export const startEventScene = async (query: CallbackQuery) => {
  await startEvent(query.message!);
};
