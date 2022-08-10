import { HttpException } from '@/exceptions/HttpException';
import Price from '@/utils/price';
import _ from 'lodash';
import GameServerService from '../gameServer.service';

export default class FindBoxesService extends GameServerService {
  async paginateByTeam(params: any): Promise<any> {
    const response = await this.sendRequest({
      data: {
        action: 'GetListTeamBox',
        ...params
      }
    });

    for (const box of response.data) {
      box.weiPrice = Price.convertToWei(box.price);
    }

    return response;
  }

  async findOneByTeam(id: string): Promise<any> {
    try {
      const response = await this.sendRequest({
        data: {
          action: 'GetTeamBoxDetail',
          id
        }
      });

      response.data.weiPrice = Price.convertToWei(response.data.price);

      return response;
    } catch (err) {
      throw new HttpException(404, 'Box is not found!', 'NOT_FOUND');
    }
  }

  async paginateByMarket(params: any): Promise<any> {
    const response = await this.sendRequest({
      data: {
        action: 'GetListUserBox',
        ...params
      }
    });

    for (const box of response.data) {
      box.weiPrice = Price.convertToWei(box.price);
    }

    return response;
  }

  async paginateByUser(walletAddress: string, params: any): Promise<any> {
    const response = await this.sendRequest({
      data: {
        walletId: walletAddress,
        action: 'GetListAccountBox',
        ...params
      }
    });

    for (const box of response.data) {
      box.weiPrice = Price.convertToWei(box.price);
    }

    return response;
  }

  async findOneByUser(id: string): Promise<any> {
    try {
      const response = await this.sendRequest({
        data: {
          action: 'GetUserBoxDetail',
          id
        }
      });

      response.data.weiPrice = Price.convertToWei(response.data.price);

      return response;
    } catch (err) {
      throw new HttpException(404, 'Box is not found!', 'NOT_FOUND');
    }
  }

  async paginateTransactions(id: string, params: any): Promise<any> {
    return await this.sendRequest({
      data: {
        action: 'GetBoxTransactions',
        id: id,
        ...params
      }
    });
  }

  async findOpenedNewNfts(walletAddress: string, id: string): Promise<any> {
    try {
      const result = await this.sendRequest({
        data: {
          action: 'GetNFTOpenBox',
          walletId: walletAddress,
          id: id,
        }
      });

      if (_.get(result, 'data.length')) {
        return result;
      }
    } catch (err) { }

    return {
      data: null
    };
  }
}
