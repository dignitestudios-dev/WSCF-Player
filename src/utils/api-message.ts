export function extractApiMessage(data: unknown, fallback: string): string {
  if (!data) return fallback;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data instanceof Error && data.message.trim()) {
    return data.message;
  }

  if (typeof data === "object" && data !== null) {
    const record = data as Record<string, unknown>;

    if (typeof record.message === "string" && record.message.trim()) {
      return record.message;
    }

    if (Array.isArray(record.message) && record.message.length > 0) {
      return record.message.map(String).join(", ");
    }

    if (typeof record.apiMessage === "string" && record.apiMessage.trim()) {
      return record.apiMessage;
    }
  }

  return fallback;
}
