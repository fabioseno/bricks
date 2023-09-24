import { Injectable } from "@nestjs/common";
import { EmailNotificationProvider, EmailProvider } from "./email.provider";
import { SlackNotificationProvider, SlackProvider } from "./slack.provider";

@Injectable()
export class NotificationProviderFactory {
  public createEmailProvider(): EmailProvider {
    return new EmailNotificationProvider();
  }

  public createSlackProvider(): SlackProvider {
    return new SlackNotificationProvider();
  }
}