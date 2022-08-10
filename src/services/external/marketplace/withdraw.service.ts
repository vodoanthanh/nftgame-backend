import { EventInstance } from '@/interfaces/model/event';
import GameServerService from '../gameServer.service';

export default class WithdrawMarketplaceService extends GameServerService {
  async process(event: EventInstance) {
    const eventParams = event.param as any;
    const id = eventParams.id;
    const itemType = eventParams.itemType;
    const extraType = eventParams.extraType;
    const walletId = eventParams.owner;

    if (itemType == 'box') {
      return await this.sendRequest({
        data: {
          action: 'SetSellBox',
          id,
          price: 0,
          state: 'WALLET',
          walletId,
          priceTokenType: 'NATIVE'
        }
      });
    }

    return await this.sendRequest({
      data: {
        action: 'SetSellNFT',
        id,
        nftType: extraType,
        state: 'WALLET',
        price: 0,
        walletId,
        priceTokenType: 'NATIVE'
      }
    });
  }
}
