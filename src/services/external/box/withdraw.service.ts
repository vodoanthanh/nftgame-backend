import { EventInstance } from '@/interfaces/model/event';
import GameServerService from '../gameServer.service';

export default class WithdrawBoxService extends GameServerService {
  async process(event: EventInstance) {
    const eventParams = event.param as any;
    const txHash = event.transHash;
    const userAddress = eventParams.user;
    const tokenId = eventParams.tokenId;
    const id = eventParams.id;

    return await this.sendRequest({
      data: {
        action: 'WithdrawBox',
        walletId: userAddress,
        txHash,
        tokenId,
        id
      }
    });
  }
}
