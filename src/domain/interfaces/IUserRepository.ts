import { User } from '../../domain/entities/User';

export interface IUserRepository {
  save(user: User): Promise<void | Error>;
  update(user: User): Promise<void | Error>;
  findMongoIdByUserId(userId: string): Promise<string | null>;
  findTopUsers(): Promise<
    { userId: string; name: string; username: string }[] | Error
  >;
  compareTokenVersion(userId: string, tokenVersion: number): Promise<boolean>;
  updateTokenVersion(
    userId: string,
    tokenVersion: number,
  ): Promise<number | Error>;
}
