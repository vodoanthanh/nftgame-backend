import { EventInstance } from '@/interfaces/model/event';
import GameServerService from '../gameServer.service';

export default class WithdrawNFTService extends GameServerService {
  async process(event: EventInstance) {
    const eventParams = event.param as any;
    const txHash = event.transHash;
    const userAddress = eventParams.user;
    const id = eventParams.id;
    const extraType = eventParams.extraType;

    return await this.sendRequest({
      data: {
        action: 'WithdrawNFT',
        walletId: userAddress,
        nftType: extraType,
        id,
        txHash
      }
    });
  }
}
