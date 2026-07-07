interface ServerToClientEvents {
  connect: () => void;
  disconnect: () => void;
  connect_error: (error: Error) => void;
  "chat:history": (messages: ChatMessage[]) => void;
  "chat:message": (message: ChatMessage) => void;
  "chat:typing": (payload: { userId: string; isTyping: boolean }) => void;
  "chat:error": (error: { message: string }) => void;
}

interface ClientToServerEvents {
  "chat:send": (payload: { roomId: string; content: string }) => void;
  "chat:typing": (payload: { roomId: string; isTyping: boolean }) => void;
  "chat:join": (roomId: string) => void;
  "chat:leave": (roomId: string) => void;
}

interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  content: string;
  createdAt: string;
}
