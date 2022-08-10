import GameServerService from '../gameServer.service';

export default class FindUsersService extends GameServerService {
  async findOne(walletAddress: string): Promise<any> {
    try {
      return await this.sendRequest({
        data: {
          action: 'GetUserInfo',
          walletId: walletAddress
        }
      });
    } catch (err) {
      return {
        data: null
      };
    }
  }
}
