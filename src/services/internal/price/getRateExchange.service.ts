import { tokenRateConfig } from '@/config/tokenRateConfig';
import CacheService from '@/services/common/cache.service';
import { deployer, dexContract } from '@/utils/contract';
import { getTokenAddress } from '@/utils/tokenType';
import contract from '@config/contracts';
import { BigNumber } from 'ethers';

export default class GetRateExchangeService {
  public cacheService: CacheService | null = CacheService.getInstance();

  private async getAmountsOut(price: string, fromTokenAdress: string, toTokenAdress: string): Promise<string> {
    return (await dexContract.connect(deployer).getAmountsOut(BigNumber.from(price), [fromTokenAdress, toTokenAdress]) as any[])
      .map(item => BigNumber.from(item).toString())[1];
  }

  async getRateExchangeWithUsdt(price: string) {
    const handle = async () => {
      const result = {} as any;
      for (const tokenType of tokenRateConfig.usdt) {
        result[tokenType] = await this.getAmountsOut(price, contract.USDT.address, getTokenAddress(tokenType));
      }
      return result;
    };

    if (this.cacheService) {
      return await this.cacheService.remember(`rate-exchange:usdt:${price}`, handle, 20);
    }

    return await handle();
  }

  async getRateExchangeWithRunnow(price: string) {
    const handle = async () => {
      const runnowVsUsdt = await this.getAmountsOut(price, contract.RUNNOW.address, getTokenAddress('USDT'));
      const geniVsUsdt = await this.getAmountsOut(price, contract.GENI.address, getTokenAddress('USDT'));

      return {
        'USDT': runnowVsUsdt,
        'GENI': BigNumber.from(runnowVsUsdt).mul(BigNumber.from(price)).div(BigNumber.from(geniVsUsdt)).toString()
      };
    };

    if (this.cacheService) {
      return await this.cacheService.remember(`rate-exchange:runnow:${price}`, handle, 20);
    }

    return await handle();
  }

  async getRateExchangeWithGeni(price: string) {
    const handle = async () => {
      const geniVsUsdt = await this.getAmountsOut(price, contract.GENI.address, getTokenAddress('USDT'));
      const runnowVsUsdt = await this.getAmountsOut(price, contract.RUNNOW.address, getTokenAddress('USDT'));

      return {
        'USDT': runnowVsUsdt,
        'RUNNOW': BigNumber.from(geniVsUsdt).mul(BigNumber.from(price)).div(BigNumber.from(runnowVsUsdt)).toString()
      };
    };

    if (this.cacheService) {
      return await this.cacheService.remember(`rate-exchange:geni:${price}`, handle, 20);
    }

    return await handle();
  }
}
