import { HttpException } from '@/exceptions/HttpException';
import GameServerService from '../gameServer.service';

export default class FindTokensService extends GameServerService {
  async findOneTransaction(walletAddress: string, id: string): Promise<any> {
    try {
      return await this.sendRequest({
        data: {
          action: 'GetTokenTransactionDetail',
          walletId: walletAddress,
          id
        }
      });
    } catch (err) {
      throw new HttpException(404, 'Token transaction is not found!', 'NOT_FOUND');
    }
  }

  async paginateWithdrawHistories(walletAddress: string, params: any): Promise<any> {
    return await this.sendRequest({
      data: {
        walletId: walletAddress,
        action: 'GetTokenTransactions',
        ...params
      }
    });
  }

  async paginateDepositHistories(walletAddress: string, params: any): Promise<any> {
    return await this.sendRequest({
      data: {
        walletId: walletAddress,
        action: 'GetTokenTransactions',
        ...params
      }
    });
  }
}
