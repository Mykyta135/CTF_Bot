/**
 * Admin access is an allowlist of Telegram chat ids (ADMIN_CHAT_IDS,
 * comma-separated), not a "secret" command: anything in a public repo is not
 * a secret.
 */
export const parseAdminChatIds = (raw: string | undefined): Set<number> =>
  new Set(
    (raw ?? "")
      .split(",")
      .map((id) => Number(id.trim()))
      .filter((id) => Number.isSafeInteger(id) && id !== 0),
  );

const adminChatIds = parseAdminChatIds(process.env.ADMIN_CHAT_IDS);

export const isAdminChat = (chatId: number): boolean => adminChatIds.has(chatId);
