import { MessageType } from "../message";

export class RequiredError extends Error {
  constructor(field: string) {
    super(`${MessageType.requiredField}`);
  }
}