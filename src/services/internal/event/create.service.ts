import { Event } from '@/models/event.model';
import { logger } from '@/utils/logger';
import _ from 'lodash';
import BaseEventService from './base.service';

export default class CreateEventService extends BaseEventService {
  async execute(eventArguments: any[], isProcessed: boolean = false, isFailed: boolean = false) {
    const events = [];

    for (const eventArgument of eventArguments) {
      const params = await this.buildParams(eventArgument);
      if (params) {
        const contractName = await this.getContractName(eventArgument.address);
        if (contractName) {
          events.push({
            contractName: contractName,
            contractAddress: eventArgument.address,
            transHash: eventArgument.transactionHash,
            name: eventArgument.event,
            block: eventArgument.blockNumber,
            param: params,
            isProcessed,
            isFailed
          });
        }
      }
    }

    if (events.length) {
      try {
        await Event.bulkCreate(events);
      } catch (err: any) {
        logger.error(`Cannot save event: ${err.message}`, {
          path: this.logPath(),
          events: events,
          stack: err.stack,
          errors: err.errors ? _.map(err.errors, error => error.message) : undefined
        });
        throw err;
      }
    }
  }
}
