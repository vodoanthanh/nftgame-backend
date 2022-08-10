import GameServerService from '../gameServer.service';

export default class OpenBoxService extends GameServerService {
  async open(walletAddress: string, id: string, tokenIds: number[]): Promise<any> {
    return await this.sendRequest({
      data: {
        action: 'OpenBox',
        walletId: walletAddress,
        id,
        tokenIds
      }
    });
  }
}
