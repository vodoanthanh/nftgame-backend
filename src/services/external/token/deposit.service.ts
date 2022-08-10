import { EventInstance } from '@/interfaces/model/event';
import Price from '@/utils/price';
import { getTokenType } from '@/utils/tokenType';
import GameServerService from '../gameServer.service';

export default class DepositTokenService extends GameServerService {
  async process(event: EventInstance) {
    const eventParams = event.param as any;
    const txHash = event.transHash;
    const user = eventParams.user;
    const tokenType = eventParams.isNativeToken ? 'NATIVE' : getTokenType(eventParams.tokenAddress);
    const amount = Price.convertToEther(eventParams.amount);

    return await this.sendRequest({
      data: {
        action: 'DepositToken',
        walletId: user,
        txHash,
        tokenType,
        amount
      }
    });
  }
}
