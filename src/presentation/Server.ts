import express from 'express';
import cors from 'cors';
import { VerifyUserController } from './controllers/VerifyUserController';
import cookieParser from 'cookie-parser';
import { GetFeedPostsController } from './controllers/GetFeedPostsController';
import { GetTopUsersController } from './controllers/GetTopUsersController';

interface ServerControllers {
  verifyUserController: VerifyUserController;
  getFeedPostsController: GetFeedPostsController;
  getTopUsersController: GetTopUsersController;
}

const corsOptions = {
  origin: 'https://localhost:3000',
  optionsSuccessStatus: 200,
  credentials: true,
};

export class Server {
  public static async run(
    port: number,
    controllers: ServerControllers,
  ): Promise<void> {
    const app = express();
    app.use(cookieParser());
    app.use(cors(corsOptions));
    app.options('*', cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get('/test', (req, res) => res.send('Feed service is running'));

    app.get('/', (req, res) => {
      controllers.getFeedPostsController.handle(req, res);
    });

    app.get('/verifyUser', (req, res) => {
      controllers.verifyUserController.handle(req, res);
    });

    app.get('/topUsers', (req, res) => {
      controllers.getTopUsersController.handle(req, res);
    });

    app.listen(port, () => {
      console.log(`Server is running in ${port}`);
    });
  }
}
