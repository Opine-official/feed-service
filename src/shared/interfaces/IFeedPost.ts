import { User } from '../../domain/entities/User';

export interface IFeedPost {
  postId: string;
  title: string;
  description: string;
  user: User;
  tags: string[];
  slug: string;
}
