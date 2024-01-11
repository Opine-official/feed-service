import { IPostRepository } from '../../domain/interfaces/IPostRepository';
import { IFeedPost } from '../../shared/interfaces/IFeedPost';
import { IUseCase } from '../../shared/interfaces/IUseCase';

interface IGetFeedPostDTO {
  userId: string | undefined;
  // Allowing undefined for now as personalization is not implemented yet
  // Also make sure to update IPostRepository.ts once implemented
}

interface IGetFeedPostResult {
  posts: IFeedPost[];
}

export class GetFeedPosts
  implements IUseCase<IGetFeedPostDTO, IGetFeedPostResult>
{
  constructor(private readonly _postRepo: IPostRepository) {}

  async execute(input: IGetFeedPostDTO): Promise<IGetFeedPostResult | Error> {
    const posts = await this._postRepo.getFeedPosts(input.userId);

    if (posts instanceof Error) {
      return posts;
    }

    return {
      posts: posts,
    };
  }
}
