export const SOCKET_EVENTS = {
  // ── Connection ──────────────────────────────────────────
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",

  // ── Chat: Server → Client ───────────────────────────────
  CHAT_HISTORY: "chat:history",
  CHAT_MESSAGE: "chat:message",
  CHAT_TYPING: "chat:typing",
  CHAT_ERROR: "chat:error",

  // ── Chat: Client → Server ───────────────────────────────
  CHAT_SEND: "chat:send",
  CHAT_TYPING_EMIT: "chat:typing",
  CHAT_JOIN: "chat:join",
  CHAT_LEAVE: "chat:leave",

  // ── Add new feature events below, grouped by feature ────
} as const;
