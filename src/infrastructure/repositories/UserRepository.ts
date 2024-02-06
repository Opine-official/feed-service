import { UserModel } from '../models/UserModel';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { User } from '../../domain/entities/User';

export class UserRepository implements IUserRepository {
  public async save(user: User): Promise<Error | void> {
    try {
      const userDocument = new UserModel({
        userId: user.userId,
        name: user.name,
        email: user.email,
        username: user.username,
        profile: user.profile,
      });

      await userDocument.save();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong');
    }
  }

  public async update(user: User): Promise<Error | void> {
    try {
      await UserModel.updateOne(
        { userId: user.userId },
        {
          name: user.name,
          email: user.email,
          username: user.username,
          profile: user.profile,
        },
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong');
    }
  }

  public async findMongoIdByUserId(userId: string): Promise<string | null> {
    const userDocument = await UserModel.findOne({ userId });
    return userDocument ? userDocument._id.toString() : null;
  }

  public async findTopUsers(): Promise<
    { userId: string; name: string; username: string }[] | Error
  > {
    try {
      const userDocuments = await UserModel.find();
      return userDocuments.map((doc) => ({
        userId: doc.userId,
        name: doc.name,
        username: doc.username,
      }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong');
    }
  }
}
