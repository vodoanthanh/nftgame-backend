import GameServerService from '../gameServer.service';

export default class UpdateUserService extends GameServerService {
  async update(walletAddress: string, params: any): Promise<any> {
    return await this.sendRequest({
      data: {
        action: 'CreateUser',
        walletId: walletAddress,
        ...params
      }
    });
  }
}
