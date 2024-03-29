import { IFeedPost } from '../../shared/interfaces/IFeedPost';
import { Post } from '../entities/Post';

export interface IPostRepository {
  save(post: Post): Promise<void | Error>;
  delete(slug: string): Promise<void | Error>;
  getFeedPosts(
    userId: string,
    subscribedChannelNames: string[],
  ): Promise<Error | IFeedPost[]>; // Allowing undefined for now as personalization is not implemented yet
}
