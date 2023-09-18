import { EmailMessage } from "../domain/email-message";

export interface SlackProvider {
  postMessage(message: EmailMessage): Promise<boolean>;
}

export class SlackNotificationProvider implements SlackProvider {
  async postMessage(message: EmailMessage): Promise<boolean> {
    return true;
  }

}