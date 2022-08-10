import { EventInstance } from '@/interfaces/model/event';
import Price from '@/utils/price';
import { BigNumber } from 'ethers';
import GameServerService from '../gameServer.service';

export default class BuyMarketplaceService extends GameServerService {
  async process(event: EventInstance) {
    const eventParams = event.param as any;
    const fromWalletId = eventParams.owner;
    const toWalletId = eventParams.buyer;
    const id = eventParams.id;
    const price = Price.convertToEther(BigNumber.from(eventParams.price).toString());
    const itemType = eventParams.itemType;
    const extraType = eventParams.extraType;
    const txHash = event.transHash;

    if (itemType == 'box') {
      // Set sell box
      await this.sendRequest({
        data: {
          action: 'SetSellBox',
          id,
          state: 'WALLET',
          price,
          walletId: fromWalletId,
          priceTokenType: 'NATIVE'
        }
      });

      // Change ownership Box
      return await this.sendRequest({
        data: {
          action: 'ChangeOwnershipBox',
          fromWalletId,
          toWalletId,
          id,
          txHash
        }
      });
    }

    // Set sell NFT
    await await this.sendRequest({
      data: {
        action: 'SetSellNFT',
        id,
        nftType: extraType,
        state: 'WALLET',
        price,
        walletId: fromWalletId,
        priceTokenType: 'NATIVE'
      }
    });

    // Change ownership NFT
    return await this.sendRequest({
      data: {
        action: 'ChangeOwnershipNFT',
        fromWalletId,
        toWalletId,
        id,
        nftType: extraType,
        txHash
      }
    });
  }
}
