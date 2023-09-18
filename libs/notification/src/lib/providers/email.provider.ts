import { EmailMessage } from "../domain/email-message";

export interface EmailProvider {
  sendEmail(message: EmailMessage): Promise<boolean>;
}

export class EmailNotificationProvider implements EmailProvider {
  async sendEmail(message: EmailMessage): Promise<boolean> {
    return true;
  }

}