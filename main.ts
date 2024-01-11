import { GetFeedPosts } from './src/application/use-cases/GetFeedPosts';
import GetTopUsers from './src/application/use-cases/GetTopUsers';
import { VerifyUser } from './src/application/use-cases/VerifyUser';
import { DatabaseConnection } from './src/infrastructure/database/Connection';
import { PostRepository } from './src/infrastructure/repositories/PostRepository';
import { UserRepository } from './src/infrastructure/repositories/UserRepository';
import { Server } from './src/presentation/Server';
import run from './src/presentation/consumers/FeedConsumer';
import { GetFeedPostsController } from './src/presentation/controllers/GetFeedPostsController';
import { GetTopUsersController } from './src/presentation/controllers/GetTopUsersController';
import { VerifyUserController } from './src/presentation/controllers/VerifyUserController';

export async function main(): Promise<void> {
  await DatabaseConnection.connect();
  const postRepo = new PostRepository();
  const userRepo = new UserRepository();

  const verifyUser = new VerifyUser();
  const getFeedPosts = new GetFeedPosts(postRepo);
  const getTopUsers = new GetTopUsers(userRepo);

  const verifyUserController = new VerifyUserController(verifyUser);
  const getFeedPostsController = new GetFeedPostsController(getFeedPosts);
  const getTopUsersController = new GetTopUsersController(getTopUsers);

  run();

  await Server.run(4003, {
    verifyUserController,
    getFeedPostsController,
    getTopUsersController,
  });
}

main();
