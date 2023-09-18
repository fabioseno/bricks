import { BadRequestException } from '@nestjs/common';
import { TypeError } from '../error';
import { MessageType, buildMessage } from '../message';
import { isEmail } from '../validation';

export class Email {

  readonly value: string

  constructor(value: string) {
    if (!value) throw new BadRequestException(buildMessage(MessageType.requiredField, 'email'));
    if (typeof value !== 'string') throw new TypeError('email', value);

    value = value.trim();

    if (!isEmail(value)) throw new BadRequestException(buildMessage(MessageType.invalidEmail, value));

    this.value = value;
  }
}