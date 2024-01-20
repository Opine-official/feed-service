import { IPostRepository } from '../../domain/interfaces/IPostRepository';
import { Post } from '../../domain/entities/Post';
import PostModel from '../models/PostModel';
import { IFeedPost } from '../../shared/interfaces/IFeedPost';

export class PostRepository implements IPostRepository {
  public async save(post: Post): Promise<Error | void> {
    try {
      const postDocument = new PostModel({
        postId: post.postId,
        title: post.title,
        description: post.description,
        user: post.user,
        tags: post.tags,
        slug: post.slug,
      });

      await postDocument.save();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong while creating a new post');
    }
  }

  public async delete(slug: string): Promise<void | Error> {
    try {
      await PostModel.deleteOne({
        slug: slug,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }

      return new Error('Something went wrong while deleting');
    }
  }
  public async getFeedPosts(userId: string): Promise<IFeedPost[] | Error> {
    try {
      console.log(userId); // To be used later to personalize fetching posts for each user
      const posts = await PostModel.find().populate('user');
      return posts.map((post) => ({
        postId: post.postId,
        title: post.title,
        description: post.description,
        user: post.user as unknown as {
          userId: string;
          name: string;
          email: string;
          username: string;
          profile: string;
        },
        tags: post.tags,
        slug: post.slug,
        postedOn: post.postedOn,
      }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new Error(error.message);
      }
      return new Error('Something went wrong while fetching posts');
    }
  }
}
