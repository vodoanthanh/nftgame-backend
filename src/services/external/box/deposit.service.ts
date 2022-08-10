import { EventInstance } from '@/interfaces/model/event';
import GameServerService from '../gameServer.service';

export default class DepositBoxService extends GameServerService {
  async process(event: EventInstance) {
    const eventParams = event.param as any;
    const txHash = event.transHash;
    const userAddress = eventParams.user;
    const id = eventParams.id;

    await this.sendRequest({
      data: {
        walletId: userAddress,
        action: 'DepositBox',
        txHash,
        id
      }
    });
  }
}
