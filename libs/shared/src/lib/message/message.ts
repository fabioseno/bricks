import { MessageType } from "./message.enum";

export const buildMessage = (messageType: MessageType, ...params: string[]) => {
  // TODO substituir params
  return messageType.toString();
}