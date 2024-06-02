import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

export abstract class SqlErrorUtils {
  static handleSaveError(error: unknown): never {
    if (error instanceof QueryFailedError) {
      if (error.message.toLowerCase().includes('unique')) {
        throw new ConflictException(error.message);
      } else if (error.message.toLowerCase().includes('constraint failed')) {
        throw new NotFoundException(error.message);
      }
    }
    throw new BadRequestException(error);
  }
}
