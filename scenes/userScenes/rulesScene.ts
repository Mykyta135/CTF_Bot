import { CallbackQuery } from "typescript-telegram-bot-api/dist/types";
import { editInlineKeyboard } from "../../utils/keyboards/editInlineKeyboard";
import { startMessage } from "./homeScene";
import { bot } from "../../bot";

const rulesText = `
<u>
    <b>Правила поведінки під час змагань:</b>
</u>
1) Забороняється заважати роботі інших учасників, а також зневажливо, агресивно поводитись відносно інших учасників, організаторів та людей, які залучені до івенту.

2) Під час івенту недопустимо перебувати в стані алкогольного спʼяніння.

3) Забороняється псувати майно компанії або використовувати його не за призначенням.

4) Організатори BEST CTF залишають за собою право визначати чи буде учасник продовжувати брати участь в івенті.

5) Під час реєстрації для участі в BEST CTF, учасник погоджується з умовами цих правил та зобов'язується виконувати їх. Невиконання умов цих правил є підставою для дискваліфікації учасника.

6) Організатори BEST CTF не несуть відповідальності за будь-які збитки, пов'язані з івентом, його учасниками, інтелектуальною власністю та пов'язаними з ними івентами.

6) Погоджуючись з правилами, учасники дають згоду на обробку їх персональних даних.

`;

export const rulesScene = async (
  chatId: number,
  query: CallbackQuery,
  keyboardLayout: any,
) => {
  await editInlineKeyboard(query, rulesText, [
    [{ text: "Назад", callback_data: "back" }],
  ]);

  bot.once("callback_query", async (q: CallbackQuery) => {
    if (q.data === "back" && q.message?.chat.id === chatId) {
      await editInlineKeyboard(query, startMessage, keyboardLayout);
    }
  });
};
