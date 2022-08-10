import { RecoverEvent } from '@/models/recoverEvent';
import CreateEventService from '@/services/internal/event/create.service';
import { gameContract, marketplaceContract, NFTContract } from '@/utils/contract';
import { logger } from '@/utils/logger';
import { Contract } from 'ethers';
import _ from 'lodash';

export default class RecoverEventService {
  private createEventService = new CreateEventService();
  private LOG_PATH = 'RecoverEventsCronJob';

  async execute() {
    const latestBlock = await gameContract.provider.getBlockNumber();

    try {
      const missingEvents = await this.queryMissingEvents(gameContract, latestBlock) as any[];
      await this.createEventService.execute(missingEvents, true, true);
    } catch (err: any) {
      logger.error(`Can not query for GameContract: ${err.message}`, {
        path: this.LOG_PATH,
        stack: err.stack,
        errors: err.errors ? _.map(err.errors, error => error.message) : undefined
      });
    }

    try {
      const missingEvents = await this.queryMissingEvents(NFTContract, latestBlock) as any[];
      await this.createEventService.execute(missingEvents, true, true);
    } catch (err: any) {
      logger.error(`Can not query for NFTContract: ${err.message}`, {
        path: this.LOG_PATH,
        stack: err.stack,
        errors: err.errors ? _.map(err.errors, error => error.message) : undefined
      });
    }

    try {
      const missingEvents = await this.queryMissingEvents(marketplaceContract, latestBlock) as any[];
      await this.createEventService.execute(missingEvents, true, true);
    } catch (err: any) {
      logger.error(`Can not query for MarketplaceContract: ${err.message}`, {
        path: this.LOG_PATH,
        stack: err.stack,
        errors: err.errors ? _.map(err.errors, error => error.message) : undefined
      });
    }
  }

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
}
