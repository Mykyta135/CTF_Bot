import { UserSession, userSessions } from "../bot";

// 30 minutes in ms
const SESSION_EXPIRY_TIME = 30 * 60 * 1000;

export function getUserSession(chatId: number): UserSession {
  cleanupExpiredSessions();

  if (!userSessions.has(chatId)) {
    const newSession: UserSession = {
      userState: undefined,
      isUserBlocked: undefined,
      chatId: chatId,
      lastActivity: Date.now(),
    };
    userSessions.set(chatId, newSession);
    return newSession;
  }

  // Update last activity timestamp
  const session = userSessions.get(chatId)!;
  session.lastActivity = Date.now();
  return session;
}

export function setUserSession(chatId: number, session: UserSession) {
  session.lastActivity = Date.now(); // Update last activity timestamp
  userSessions.set(chatId, session);
}

// Clean up expired sessions
function cleanupExpiredSessions() {
  const now = Date.now();
  userSessions.forEach((session, chatId) => {
    if (now - session.lastActivity > SESSION_EXPIRY_TIME) {
      userSessions.delete(chatId);
    }
  });
}
