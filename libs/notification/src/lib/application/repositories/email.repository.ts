import { Email } from "@bricks/shared/domain";

export abstract class EmailRepository {

  abstract getEmailContent(emailId: string): Promise<Email>;

  abstract markAsSent(emailId: string): Promise<boolean>;

  abstract markAsFailed(emailId: string, error: string): Promise<boolean>;

  abstract purgeEmails(): void;

}