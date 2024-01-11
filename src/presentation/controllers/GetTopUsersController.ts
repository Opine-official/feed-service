import { Request, Response } from 'express';
import GetTopUsers from '../../application/use-cases/GetTopUsers';
import { IController } from '../../shared/interfaces/IController';

export class GetTopUsersController implements IController {
  public constructor(private readonly _useCase: GetTopUsers) {}

  public async handle(req: Request, res: Response): Promise<void> {
    const result = await this._useCase.execute();

    if (result instanceof Error) {
      res.status(400).json({ error: result.message });
      return;
    }

    res.status(200).json(result);
  }
}
