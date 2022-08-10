import { HttpException } from '@/exceptions/HttpException';
import Identifier from '@/utils/identifier';
import Price from '@/utils/price';
import { BigNumber } from 'ethers';
import GameServerService from '../gameServer.service';

export default class FindNftsService extends GameServerService {
  async paginate(params: any): Promise<any> {
    // Convert price
    if (params.filter.priceRange && params.filter.priceRange[0]) {
      params.filter.priceRange[0] = Price.convertToEther(BigNumber.from(params.filter.priceRange[0]).toString());
    }

    if (params.filter.priceRange && params.filter.priceRange[1]) {
      params.filter.priceRange[1] = Price.convertToEther(BigNumber.from(params.filter.priceRange[1]).toString());
    }

    const response = await this.sendRequest({
      data: {
        action: 'GetListUserNFT',
        ...params
      }
    });

    for (const nft of response.data) {
      nft.id = Identifier.encode(nft.id, nft.nftType);
      nft.weiPrice = Price.convertToWei(nft.price);
    }

    return response;
  }

  async paginateByTeam(params: any): Promise<any> {
    const response = await this.sendRequest({
      data: {
        action: 'GetListTeamNFT',
        ...params
      }
    });

    for (const nft of response.data) {
      nft.id = Identifier.encode(nft.id, nft.nftType);
      nft.weiPrice = Price.convertToWei(nft.price);
    }

    return response;
  }

  async paginateByUser(userAddress: string, params: any): Promise<any> {
    const response = await this.sendRequest({
      data: {
        walletId: userAddress,
        action: 'GetListAccountNFT',
        ...params
      }
    });

    for (const nft of response.data) {
      nft.id = Identifier.encode(nft.id, nft.nftType);
      nft.weiPrice = Price.convertToWei(nft.price);
    }

    return response;
  }

  async findOneByUser(id: string, params: any): Promise<any> {
    try {
      const response = await this.sendRequest({
        data: {
          action: 'GetUserNFTDetail',
          id,
          ...params
        }
      });

      const nft = response.data;
      nft.id = Identifier.encode(nft.id, nft.nftType);

      return response;
    } catch (err) {
      throw new HttpException(404, 'Item is not found!', 'NOT_FOUND');
    }
  }

  async paginateTransactions(id: string, params: any): Promise<any> {
    return await this.sendRequest({
      data: {
        action: 'GetNFTTransactions',
        id: id,
        ...params
      }
    });
  }
}
