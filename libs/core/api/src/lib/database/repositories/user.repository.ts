import { UserId } from '@libs/shared';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import {
  FindOneOptions,
  IsNull,
  Not,
  QueryFailedError,
  Repository,
  UpdateResult,
} from 'typeorm';
import { UserEntity } from '../collections';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async createOne(dto: {
    username: string;
    email: string;
    password: string;
  }): Promise<UserEntity> {
    const user = new UserEntity();
    const salt = await bcrypt.genSalt();

    user.username = dto.username;
    user.email = dto.email;
    user.hashedPassword = await bcrypt.hash(dto.password, salt);

    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.message.toLowerCase().includes('unique'))
          throw new ConflictException(error.message);
      }
      throw new BadRequestException(error);
    }
  }

  async findOne({
    where,
    isLoggedIn,
  }: {
    where: {
      id?: UserId;
      username?: string;
      email?: string;
    };
    isLoggedIn?: boolean;
  }): Promise<UserEntity | null> {
    if (!where.id && !where.username && !where.email) return null;

    return this.usersRepository.findOne({
      where: isLoggedIn
        ? {
            ...where,
            hashedRefreshToken: Not(IsNull()),
          }
        : where,
    } as FindOneOptions<UserEntity>);
  }

  async findOneByCredentials(dto: {
    email: string;
    password: string;
  }): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({
      where: { email: dto.email },
    });
    if (!user) throw new NotFoundException();

    const isAuthorized = await bcrypt.compare(
      dto.password,
      user.hashedPassword,
    );
    if (!isAuthorized) throw new UnauthorizedException();

    return user;
  }

  findMany(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  updateOne(id: UserId, dto: Partial<UserEntity>): Promise<UpdateResult> {
    return this.usersRepository.update(id, dto);
  }
}
