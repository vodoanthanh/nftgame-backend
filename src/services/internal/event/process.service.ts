import { EventName } from '@/config/eventSetting';
import { EventInstance } from '@/interfaces/model/event';
import { RecoverEvent } from '@/models/recoverEvent';
import CreateBoxService from '@/services/external/box/create.service';
import DepositBoxService from '@/services/external/box/deposit.service';
import OpenBoxService from '@/services/external/box/open.service';
import WithdrawBoxService from '@/services/external/box/withdraw.service';
import BuyMarketplaceService from '@/services/external/marketplace/buy.service';
import OfferMarketplaceService from '@/services/external/marketplace/offer.service';
import WithdrawMarketplaceService from '@/services/external/marketplace/withdraw.service';
import CreateNftService from '@/services/external/nft/create.service';
import DepositNFTService from '@/services/external/nft/deposit.service';
import WithdrawNFTService from '@/services/external/nft/withdraw.service';
import DepositTokenService from '@/services/external/token/deposit.service';
import WithdrawTokenServices from '@/services/external/token/withdraw.service';
import { BigNumber, Contract } from 'ethers';
import _ from 'lodash';
import CreateEventService from './create.service';

export default class ProcessEventService {
  private createEventService = new CreateEventService();
  private depositBoxService = new DepositBoxService();
  private depositNFTService = new DepositNFTService();
  private withdrawBoxService = new WithdrawBoxService();
  private withdrawNFTService = new WithdrawNFTService();
  private withdrawTokenService = new WithdrawTokenServices();
  private depositTokenService = new DepositTokenService();
  private createBoxService = new CreateBoxService();
  private createNftService = new CreateNftService();
  private openBoxService = new OpenBoxService();
  private offerMarketplaceService = new OfferMarketplaceService();
  private buyMarketplaceService = new BuyMarketplaceService();
  private withdrawMarketplaceService = new WithdrawMarketplaceService();

  async execute(event: EventInstance) {
    switch (event.name) {
      case EventName.DepositItem:
        await this.handleDepositItemEvent(event);
        break;

      case EventName.WithdrawItem:
        await this.handleWithdrawItemEvent(event);
        break;

      case EventName.DepositToken:
        await this.depositTokenService.process(event);
        break;

      case EventName.WithdrawToken:
        await this.withdrawTokenService.process(event);
        break;

      case EventName.Redeem:
        await this.handleRedeemEvent(event);
        break;

      case EventName.OpenStarterBox:
        await this.handleOpenStarterBoxEvent(event);
        break;

      case EventName.Offer:
        await this.offerMarketplaceService.process(event);
        break;

      case EventName.Buy:
        await this.buyMarketplaceService.process(event);
        break;

      case EventName.Withdraw:
        await this.withdrawMarketplaceService.process(event);
        break;
    }
  }

  async handleRedeemEvent(event: EventInstance) {
    const userAddress = _.get(event.param, 'user');
    const id = _.get(event.param, 'id');
    const itemType = _.get(event.param, 'itemType');
    const extraType = _.get(event.param, 'extraType');
    const tokenId = BigNumber.from(_.get(event.param, 'tokenId'));
    const txHash = event.transHash;

    if (itemType == 'box') {
      await this.createBoxService.create(userAddress, id, tokenId.toNumber(), txHash);
    } else {
      await this.createNftService.create(userAddress, id, extraType, tokenId.toNumber(), txHash);
    }
  };

  async handleOpenStarterBoxEvent(event: EventInstance) {
    const userAddress = _.get(event.param, 'user');
    const id = _.get(event.param, 'id');
    // Remove first token id, it's box token id
    const tokenIds = _.map(_.get(event.param, 'tokenIds'), item => BigNumber.from(item).toNumber()).slice(1);
    await this.openBoxService.open(userAddress, id, tokenIds);
  };

  async queryMissingEvents(contract: Contract, latestBlock: number, limit = 5000) {
    const contractName = await this.createEventService.getContractName(contract.address);

    if (contractName) {
      let recoverEvent = await RecoverEvent.findOne({
        where: { contractName: contractName }
      });
      if (!recoverEvent) {
        recoverEvent = await RecoverEvent.create(
          { block: latestBlock, contractName: contractName }
        );
      }

      // If we don't have any new events
      if (latestBlock == recoverEvent.block) {
        return [];
      }

      const fromBlock = Number(recoverEvent.block);
      const toBlock = Math.min(Number(recoverEvent.block) + limit, latestBlock);
      const missingEvents = await contract.queryFilter({}, fromBlock + 1, toBlock); // +1: prevent to get dup event from

      await RecoverEvent.update(
        { block: toBlock },
        { where: { id: recoverEvent.id } }
      );

      return missingEvents;
    }
  };

  async handleDepositItemEvent(event: EventInstance) {
    const eventParams = event.param as any;
    const itemType = eventParams.itemType;

    if (itemType == 'box') {
      await this.depositBoxService.process(event);
    } else {
      await this.depositNFTService.process(event);
    }
  };

  async handleWithdrawItemEvent(event: EventInstance) {
    const eventParams = event.param as any;
    const itemType = eventParams.itemType;

    if (itemType == 'box') {
      await this.withdrawBoxService.process(event);
    } else {
      await this.withdrawNFTService.process(event);
    }
  }
}
