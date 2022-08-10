import GameServerService from '../gameServer.service';

export default class CreateBoxService extends GameServerService {
  async create(walletAddress: string, id: string, tokenId: number, txHash: string): Promise<any> {
    return await this.sendRequest({
      data: {
        action: 'CreateBox',
        walletId: walletAddress,
        txHash,
        id,
        tokenId
      }
    });
  }
}
