import { EventInstance } from '@/interfaces/model/event';
import GameServerService from '../gameServer.service';

export default class DepositNFTService extends GameServerService {
  async process(event: EventInstance) {
    const eventParams = event.param as any;
    const txHash = event.transHash;
    const userAddress = eventParams.user;
    const id = eventParams.id;
    const extraType = eventParams.extraType;
    const tokenId = eventParams.tokenId;

    await this.sendRequest({
      data: {
        action: 'DepositNFT',
        walletId: userAddress,
        nftType: extraType,
        id,
        tokenId,
        txHash
      }
    });
  }
}
