import { ContractName, EventName } from '@/config/eventSetting';
import { gameContract, marketplaceContract, NFTContract } from '@/utils/contract';
import { BigNumber } from 'ethers';
import _ from 'lodash';

export default class BaseEventService {
  logPath(): string {
    return this.constructor.name;
  }

  async buildParams(event: any) {
    let params: any;

    if (event.event === EventName.DepositItem) {
      params = {
        id: event.args.id,
        user: event.args.user.toLowerCase(),
        itemAddress: event.args.itemAddress.toLowerCase(),
        tokenId: BigNumber.from(event.args.tokenId).toNumber(),
        itemType: event.args.itemType,
        extraType: event.args.extraType,
        timestamp: parseInt(event.args.timestamp.toString()) * 1000
      };
    }

    if (event.event === EventName.WithdrawItem) {
      params = {
        id: event.args.id,
        user: event.args.user.toLowerCase(),
        itemType: event.args.itemType,
        extraType: event.args.extraType,
        tokenId: BigNumber.from(event.args.tokenId).toNumber(),
        nonce: event.args.nonce,
        timestamp: parseInt(event.args.timestamp.toString()) * 1000
      };
    }

    if (event.event === EventName.DepositToken) {
      params = {
        user: event.args.user.toLowerCase(),
        isNativeToken: event.args.isNativeToken,
        tokenAddress: event.args.tokenAddress.toLowerCase(),
        amount: event.args.amount.toString(),
        timestamp: parseInt(event.args.timestamp.toString()) * 1000
      };
    }

    if (event.event === EventName.WithdrawToken) {
      params = {
        user: event.args.user.toLowerCase(),
        nonce: event.args.nonce,
        timestamp: parseInt(event.args.timestamp.toString()) * 1000
      };
    }

    if (event.event === EventName.Redeem) {
      params = {
        user: event.args.user.toLowerCase(),
        id: event.args.id,
        itemType: event.args.itemType,
        extraType: event.args.extraType,
        nonce: event.args.nonce,
        tokenId: BigNumber.from(event.args.tokenId).toNumber(),
        timestamp: parseInt(event.args.timestamp.toString()) * 1000
      };
    }

    if (event.event === EventName.OpenStarterBox) {
      params = {
        user: event.args.user.toLowerCase(),
        id: event.args.id,
        tokenIds: _.map(event.args.tokenIds).map(tokenId => BigNumber.from(tokenId).toNumber()),
        timestamp: parseInt(event.args.timestamp.toString()) * 1000
      };
    }

    if (event.event === EventName.Offer) {
      params = {
        id: event.args.id,
        itemType: event.args.itemType,
        extraType: event.args.extraType,
        tokenId: event.args.tokenId,
        owner: event.args.owner.toLowerCase(),
        price: event.args.price.toString(),
        timestamp: parseInt(event.args.timestamp.toString()) * 1000
      };
    }

    if (event.event === EventName.Buy) {
      params = {
        id: event.args.id,
        itemType: event.args.itemType,
        extraType: event.args.extraType,
        tokenId: BigNumber.from(event.args.tokenId).toNumber(),
        owner: event.args.owner.toLowerCase(),
        price: event.args.price.toString(),
        buyer: event.args.buyer.toLowerCase(),
        timestamp: parseInt(event.args.timestamp.toString()) * 1000
      };
    }

    if (event.event === EventName.Withdraw) {
      params = {
        id: event.args.id,
        itemType: event.args.itemType,
        extraType: event.args.extraType,
        tokenId: BigNumber.from(event.args.tokenId).toNumber(),
        owner: event.args.owner.toLowerCase(),
        timestamp: parseInt(event.args.timestamp.toString()) * 1000
      };
    }

    return params;
  }

  async getContractName(address: string) {
    switch (address.toLowerCase()) {
      case gameContract.address.toLowerCase():
        return ContractName.Game;

      case NFTContract.address.toLowerCase():
        return ContractName.NFT;

      case marketplaceContract.address.toLowerCase():
        return ContractName.Marketplace;
    }
  }
}
