import GameServerService from '../gameServer.service';

export default class CreateUserService extends GameServerService {
  async create(walletAddress: string): Promise<any> {
    return await this.sendRequest({
      data: {
        action: 'CreateUser',
        walletId: walletAddress
      }
    });
  }
}
