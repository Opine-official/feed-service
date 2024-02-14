import { IChannelSubscribeRepository } from '../../domain/interfaces/IChannelSubscribeRepository';
import { IPostRepository } from '../../domain/interfaces/IPostRepository';
import { IFeedPost } from '../../shared/interfaces/IFeedPost';
import { IUseCase } from '../../shared/interfaces/IUseCase';

interface IGetFeedPostDTO {
  userId: string;
  // Allowing undefined for now as personalization is not implemented yet
  // Also make sure to update IPostRepository.ts once implemented
}

interface IGetFeedPostResult {
  posts: IFeedPost[];
}

export class GetFeedPosts
  implements IUseCase<IGetFeedPostDTO, IGetFeedPostResult>
{
  constructor(
    private readonly _postRepo: IPostRepository,
    private readonly _channelSubRepo: IChannelSubscribeRepository,
  ) {}

  async execute(input: IGetFeedPostDTO): Promise<IGetFeedPostResult | Error> {
    const subscribedChannels = await this._channelSubRepo.getSubscribedChannels(
      input.userId,
    );

    if (subscribedChannels instanceof Error) {
      return subscribedChannels;
    }

    const subscribedChannelNames = subscribedChannels.map(
      (channel) => channel.channelName,
    );

    const posts = await this._postRepo.getFeedPosts(
      input.userId,
      subscribedChannelNames,
    );

    if (posts instanceof Error) {
      return posts;
    }

    return {
      posts: posts,
    };
  }
}
