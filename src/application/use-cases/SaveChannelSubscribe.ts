import { ChannelSubscribe } from '../../domain/entities/ChannelSubscribe';
import { IChannelSubscribeRepository } from '../../domain/interfaces/IChannelSubscribeRepository';
import { IUseCase } from '../../shared/interfaces/IUseCase';

interface ISaveChannelSubscribeDTO {
  channelSubscribeId: string;
  userId: string;
  channelId: string;
  channelName: string;
}

interface ISaveChannelSubscribeResult {
  channelSubscribe: ChannelSubscribe;
}

export class SaveChannelSubscribe
  implements IUseCase<ISaveChannelSubscribeDTO, ISaveChannelSubscribeResult>
{
  constructor(private readonly _channelSubRepo: IChannelSubscribeRepository) {}

  public async execute({
    channelSubscribeId,
    userId,
    channelId,
    channelName,
  }: ISaveChannelSubscribeDTO): Promise<ISaveChannelSubscribeResult | Error> {
    const channelSubscribe = new ChannelSubscribe({
      channelSubscribeId,
      userId,
      channelId,
      channelName,
    });

    const result = await this._channelSubRepo.save(channelSubscribe);

    if (result instanceof Error) {
      return result;
    }

    return {
      channelSubscribe,
    };
  }
}
