import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { IUseCase } from '../../shared/interfaces/IUseCase';
import { User } from '../../domain/entities/User';

interface IUpdateUserDTO {
  userId: string;
  name: string;
  email: string;
  profile: string | null;
  username: string;
}

interface IUpdateUserResult {
  userId: string;
}

export class UpdateUser implements IUseCase<IUpdateUserDTO, IUpdateUserResult> {
  constructor(private readonly _userRepo: IUserRepository) {}

  async execute(input: IUpdateUserDTO): Promise<IUpdateUserResult | Error> {
    const user = new User(
      input.userId,
      input.name,
      input.email,
      input.profile,
      input.username,
    );
    const updateUserResult = await this._userRepo.update(user);

    if (updateUserResult instanceof Error) {
      return updateUserResult;
    }

    return {
      userId: user.userId,
    };
  }
}
