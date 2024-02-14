import { Request, Response } from 'express';
import { GetFeedPosts } from '../../application/use-cases/GetFeedPosts';
import { IController } from '../../shared/interfaces/IController';

export class GetFeedPostsController implements IController {
  public constructor(private readonly _useCase: GetFeedPosts) {}

  public async handle(req: Request, res: Response): Promise<void> {
    const userId = req.query.userId?.toString();

    if (!userId || typeof userId !== 'string') {
      res.status(400).json({ error: 'Invalid userId' });
      return;
    }

    const result = await this._useCase.execute({ userId: userId });

    if (result instanceof Error) {
      res.status(400).json({ error: result.message });
      return;
    }

    res.status(200).json(result);
  }
}
