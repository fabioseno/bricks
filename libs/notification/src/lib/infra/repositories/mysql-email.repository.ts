import { Email } from "@bricks/shared/domain";
import { EmailRepository } from "../../application/repositories/email.repository";

export class MySQLsEmailRepository extends EmailRepository {
  constructor(private readonly connection: any) {
    super();
  }

  override getEmailContent(emailId: string): Promise<Email> {
    throw new Error("Method not implemented.");
  }
  override markAsSent(emailId: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  override markAsFailed(emailId: string, error: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  override purgeEmails(): void {

  }

}