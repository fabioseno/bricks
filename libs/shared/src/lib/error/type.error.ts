import { MessageType } from "../message";

export class TypeError extends Error {
  constructor(field: string, value: any) {
    super(`${MessageType.invalidType}`);
  }
}