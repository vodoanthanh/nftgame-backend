import { EventInstance } from '@/interfaces/model/event';
import Price from '@/utils/price';
import { BigNumber } from 'ethers';
import GameServerService from '../gameServer.service';

export default class OfferMarketplaceService extends GameServerService {
  async process(event: EventInstance) {
    const eventParams = event.param as any;
    const id = eventParams.id;
    const itemType = eventParams.itemType;
    const nftType = eventParams.extraType;
    const walletId = eventParams.owner;
    const price = Price.convertToEther(BigNumber.from(eventParams.price).toString());

    if (itemType == 'box') {
      return await this.sendRequest({
        data: {
          action: 'SetSellBox',
          id,
          state: 'MARKETPLACE',
          price,
          walletId,
          priceTokenType: 'NATIVE'
        }
      });
    }

    return await this.sendRequest({
      data: {
        action: 'SetSellNFT',
        id,
        nftType,
        state: 'MARKETPLACE',
        price,
        walletId,
        priceTokenType: 'NATIVE'
      }
    });
  }
}
