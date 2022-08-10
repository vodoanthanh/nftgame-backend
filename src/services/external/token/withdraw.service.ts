import { EventInstance } from '@/interfaces/model/event';
import GameServerService from '../gameServer.service';

export default class WithdrawTokenServices extends GameServerService {
  async process(event: EventInstance) {
    const eventParams = event.param as any;
    const txHash = event.transHash;
    const walletId = eventParams.user;
    const nonce = eventParams.nonce;

    return await this.sendRequest({
      data: {
        action: 'WithdrawToken',
        walletId,
        txHash,
        nonce
      }
    });
  }
}
