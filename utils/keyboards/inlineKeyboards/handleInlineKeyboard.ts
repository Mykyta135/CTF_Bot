import { homeEventLayout } from "../keyboardLayouts/homeEventLayout";
import { homeLayout } from "../keyboardLayouts/homeSceneLayout";
import { homeValidLayout } from "../keyboardLayouts/homeValidLayout";
import { createInlineKeyboard } from "./createInlineKeyboard";
import { editInlineKeyboard } from "./editInlineKeyboard";

export const handleInlineKeyboard = (messageOrQuery: any, user: any, team: any, isEdit: boolean) => {
    const layout = team && team.isTestValid ? (team.isEvent ? homeEventLayout : homeValidLayout) : homeLayout;
    const greetingMessage = `Ласкаво просимо,  ${user?.name} !`;

    if (isEdit) {
        editInlineKeyboard(messageOrQuery, greetingMessage, layout);
    } else {
        createInlineKeyboard(messageOrQuery, greetingMessage, layout);
    }
};