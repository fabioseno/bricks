import { Email } from '@bricks/shared/domain';
import { RequiredError, TypeError } from '@bricks/shared/error';
import { MessageType, buildMessage } from '@bricks/shared/message';
import { BadRequestException } from '@nestjs/common';
import { EmailMessageStatus } from './email-status.enum';

export class EmailMessage {

  private _cc: string | string[] | undefined;

  public get cc() { return this._cc; }

  public setCc(value: string | string[]) {
    this._cc = EmailMessage.validateRecipients(value);
  }

  private _bcc: string | string[] | undefined;

  public get bcc() { return this._bcc; }

  public addBcc(value: string | string[]) {
    this._bcc = EmailMessage.validateRecipients(value);
  }

  private _attachments: Buffer | Buffer[] | undefined;

  public get attachments() { return this._attachments; }

  public addAttachments(value: Buffer | Buffer[]) {
    this._attachments = EmailMessage.validateAttachments(value);
  }

  private _status: EmailMessageStatus;

  public get status() {
    return this._status;
  };

  private constructor(private readonly from: string,
    public readonly to: string | string[],
    public readonly subject: string,
    public readonly textBody: string,
    public readonly htmlBody: string
  ) {
    this._status = EmailMessageStatus.Queued;
  }

  static create(from: string, to: string | string[], subject: string, textBody: string, htmlBody: string) {
    EmailMessage.validateRequired(subject, 'assunto');
    EmailMessage.validateRequired(textBody, 'conteúdo texto');
    EmailMessage.validateRequired(htmlBody, 'conteúdo html');

    return new EmailMessage(new Email(from).value, this.validateRecipients(to), subject, textBody, htmlBody);
  }

  private static validateRecipients(value: string | string[]): string | string[] {
    if (!this.isRecipientInputValid(value)) {
      throw new RequiredError(JSON.stringify(value));
    }

    if (typeof value === 'string') {
      return new Email(value).value;
    } else {
      const validValues = value.map(recipient => new Email(recipient).value);
      const uniqueValues = [...new Set(validValues)];
      return uniqueValues;
    }
  }

  private static validateAttachments(value: Buffer | Buffer[]): Buffer | Buffer[] {
    if (!this.isAttachmentInputValid(value)) {
      throw new TypeError('anexo', JSON.stringify(value));
    }

    return value;
  }

  private static isRecipientInputValid(recipients: string | string[]) {
    const isSingleValue = typeof recipients === 'string';
    const isMultipleValue = Array.isArray(recipients)
      && recipients.every(recipient => typeof recipient === 'string');
    return isSingleValue || isMultipleValue;
  }

  private static isAttachmentInputValid(attachments: Buffer | Buffer[]) {
    const isSingleValue = Buffer.isBuffer(attachments)
    const isMultipleValue = Array.isArray(attachments)
      && attachments.every(attachment => Buffer.isBuffer(attachment));
    return isSingleValue || isMultipleValue;
  }

  private static validateRequired(value: string | string[], field: string) {
    if (!value) throw new BadRequestException(buildMessage(MessageType.requiredField, field));
  }

  // creationDate: {
  //   required: true,
  //   type: Date
  // },
  // status: {
  //   required: true,
  //   type: String,
  //   'enum': ['queued', 'sending', 'sent', 'error']
  // },
  // sentDate: {
  //   type: Date
  // },
  // lastRetryDate: {
  //   type: Date
  // },
  // sendAttempts: {
  //   type: Number
  // },
  // errorDescription: {
  //   type: String,
  // }
}