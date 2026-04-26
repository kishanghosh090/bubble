export enum IO {
  IO = "io",
}
export enum RedisKeysSocket {
  USER = "user",
  CONVERSATION = "conversation",
  NOTIFICATION = "notification",
}

export const getSocketKey = (key: RedisKeysSocket, identifier: string) => {
  return `${key}:${identifier}`;
};
