import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { IUseCase } from '../../shared/interfaces/IUseCase';

interface IGetTopUsersResult {
  userId: string;
  name: string;
  username: string;
}

class GetTopUsers implements IUseCase<void, IGetTopUsersResult[]> {
  constructor(private readonly _userRepo: IUserRepository) {}

  async execute(): Promise<IGetTopUsersResult[] | Error> {
    const topUsersResult = await this._userRepo.findTopUsers();

    if (topUsersResult instanceof Error) {
      return topUsersResult;
    }

    return topUsersResult;
  }
}

export default GetTopUsers;
