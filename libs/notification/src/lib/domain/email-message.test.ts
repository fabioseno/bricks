import { EmailMessage } from './email-message';

describe('EmailMessage', () => {
  const validFrom = 'from@domain.com';
  const validTo = 'to@domain.com';

  describe('create', () => {
    describe('from', () => {
      it('should throw on empty field `from`', () => {
        expect(() => EmailMessage.create(null as unknown as string, validTo, 'subject', 'text', 'html')).toThrow();
      });

      it('should throw on invalid data type for field `from`', () => {
        expect(() => EmailMessage.create(['from@domain.com'] as unknown as string, validTo, 'subject', 'text', 'html')).toThrow();
        expect(() => EmailMessage.create(12345 as unknown as string, validTo, 'subject', 'text', 'html')).toThrow();
      });

      it('should throw on invalid value for field `from`', () => {
        const invalidFromValue = ['from##@@@domain.com'];
        expect(() => EmailMessage.create(invalidFromValue as unknown as string, validTo, 'subject', 'text', 'html')).toThrow();
      });

    });

    describe('to', () => {
      it('should throw on empty value for field `to`', () => {
        expect(() => EmailMessage.create(undefined as unknown as string, validTo as unknown as string[], 'subject', 'text', 'html')).toThrow();
      });

      it('should throw on invalid data type for field `to`', () => {
        const invalidToValue = [12345];
        expect(() => EmailMessage.create(validFrom, invalidToValue as unknown as string[], 'subject', 'text', 'html')).toThrow();
      });

      it('should throw on invalid value for field `to`', () => {
        const invalidToValue = ['to##@@@domain.com'];
        expect(() => EmailMessage.create(validFrom, invalidToValue, 'subject', 'text', 'html')).toThrow();
      });

      it('should allow string or string[] for field `to`', () => {
        expect(() => EmailMessage.create(validFrom, validTo, 'subject', 'text', 'html')).not.toThrow();
        expect(() => EmailMessage.create(validFrom, [validTo], 'subject', 'text', 'html')).not.toThrow();
      });
    });

    describe('cc', () => {
      let message: EmailMessage;

      beforeEach(() => {
        message = EmailMessage.create(validFrom, validTo, 'subject', 'text', 'html');
      });

      it('should not throw on empty value for field `cc`', () => {
        expect(() => message.setCc(undefined as unknown as string)).toThrow();
      });

      it('should throw on invalid data type for field `cc`', () => {
        const invalidCcValue = [12345];
        expect(() => message.setCc(invalidCcValue as unknown as string[])).toThrow();
      });

      it('should throw on invalid value for field `cc`', () => {
        const invalidCcValue = ['to##@@@domain.com'];
        expect(() => message.setCc(invalidCcValue)).toThrow();
      });

      it('should allow string or string[] for field `cc`', () => {
        const ccEmail = 'cc1@domain.com';
        message.setCc(ccEmail)
        expect(message.cc).toStrictEqual(ccEmail);
      });
    });

    describe('bcc', () => {
      let message: EmailMessage;

      beforeEach(() => {
        message = EmailMessage.create(validFrom, validTo, 'subject', 'text', 'html');
      });

      it('should not throw on empty value for field `bcc`', () => {
        expect(() => message.addBcc(undefined as unknown as string)).toThrow();
      });

      it('should throw on invalid data type for field `bcc`', () => {
        const invalidBccValue = [12345];
        expect(() => message.addBcc(invalidBccValue as unknown as string[])).toThrow();
      });

      it('should throw on invalid value for field `bcc`', () => {
        const invalidBccValue = ['to##@@@domain.com'];
        expect(() => message.addBcc(invalidBccValue)).toThrow();
      });

      it('should allow string or string[] for field `bcc`', () => {
        const bccEmail = 'bcc1@domain.com';
        message.addBcc(bccEmail)
        expect(message.bcc).toStrictEqual(bccEmail);
      });
    });

    describe('attachment', () => {
      let message: EmailMessage;

      beforeEach(() => {
        message = EmailMessage.create(validFrom, validTo, 'subject', 'text', 'html');
      });

      it('should not throw on empty value for field `attachment`', () => {
        expect(() => message.addAttachments(undefined as unknown as Buffer)).toThrow();
      });

      it('should throw on invalid data type for field `attachment`', () => {
        const invalidBccValue = [12345];
        expect(() => message.addAttachments(invalidBccValue as unknown as Buffer[])).toThrow();
      });

      it('should allow Buffer or Buffer[] for field `attachment`', () => {
        const attachment = Buffer.from('content 1');
        const message = EmailMessage.create(validFrom, validTo, 'subject', 'text', 'html')
        message.addAttachments(attachment)
        expect((message.attachments as Buffer)).toBe(attachment);
      });
    });

    describe('subject', () => {
      it('should throw on empty value for field `subject`', () => {
        expect(() => EmailMessage.create(validFrom, validTo, undefined as unknown as string, 'text', 'html')).toThrow();
      });
    });

    describe('text', () => {
      it('should throw on empty value for field `text`', () => {
        expect(() => EmailMessage.create(validFrom, validTo, 'subject', undefined as unknown as string, 'html')).toThrow();
      });
    });

    describe('html', () => {
      it('should throw on empty value for field `html`', () => {
        expect(() => EmailMessage.create(validFrom, validTo, 'subject', 'text', undefined as unknown as string)).toThrow();
      });
    });
  });
});

// export class EmailMessage {

//   private _cc: string[] = [];

//   public get cc() { return this._cc; }

//   public set cc(value: string[]) {
//     this._cc = EmailMessage.getEmailList(value, 'cc');
//   }

//   private _bcc: string[] = [];

//   public get bcc() { return this._bcc; }

//   public set bcc(value: string[]) {
//     this._bcc = EmailMessage.getEmailList(value, 'bcc');
//   }

//   private _attachments: Buffer[] = [];

//   public get attachments() { return this._attachments; }

//   public set attachments(value: Buffer[]) {
//     this._attachments = value;
//   }

//   private status: EmailMessageStatus;

//   private constructor(public readonly from: string,
//     public readonly to: string | string[],
//     public readonly subject: string,
//     public readonly textBody: string,
//     public readonly htmlBody: string
//   ) {
//     this.status = EmailMessageStatus.Queued;
//   }

//   static create(from: string,
//     to: string | string[],
//     subject: string,
//     textBody: string,
//     htmlBody: string
//   ) {
//     const validTo = (typeof to === 'string') ? to : this.getEmailList(to, 'to');
//     EmailMessage.validateRequired(subject, 'assunto');
//     EmailMessage.validateRequired(textBody, 'conteúdo texto');
//     EmailMessage.validateRequired(htmlBody, 'conteúdo html');

//     return new EmailMessage(from, validTo, subject, textBody, htmlBody);
//   }

//   private static getEmailList(value: string[], field: string): string[] {
//     this.validateRequired(value, field);
//     if (!Array.isArray(value)) throw new BadRequestException(buildMessage(MessageType.invalidFormat, field, value));

//     return value.map(cc => new Email(cc).value);
//   }

//   private static validateRequired(value: string | string[], field: string) {
//     if (!value) throw new BadRequestException(buildMessage(MessageType.requiredField, field));
//   }

//   // creationDate: {
//   //   required: true,
//   //   type: Date
//   // },
//   // status: {
//   //   required: true,
//   //   type: String,
//   //   'enum': ['queued', 'sending', 'sent', 'error']
//   // },
//   // sentDate: {
//   //   type: Date
//   // },
//   // lastRetryDate: {
//   //   type: Date
//   // },
//   // sendAttempts: {
//   //   type: Number
//   // },
//   // errorDescription: {
//   //   type: String,
//   // }
// }