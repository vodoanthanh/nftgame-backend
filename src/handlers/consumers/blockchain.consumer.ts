import { EventName } from '@/config/eventSetting';
import DiscordService from '@/services/common/discord.service';
import CreateEventService from '@/services/internal/event/create.service';
import { gameContract, marketplaceContract, NFTContract } from '@/utils/contract';
import { logger } from '@/utils/logger';
import { v4 as uuidv4 } from 'uuid';

const LOG_PATH = 'BlockchainConsumer';
const discordService = DiscordService.getInstance();

async function handle(): Promise<void> {
  const createEventService = new CreateEventService();
  const executeCreateService = async (event: any, eventName: EventName) => {
    const requestId = uuidv4().toString();
    try {
      logger.info(`Handle event ${eventName} - ${requestId}`, {
        path: LOG_PATH,
        event: event
      });
      await createEventService.execute([event[event.length - 1]]);
    } catch (err: any) {
      logger.error(`Cannot save event: ${err.message} - ${requestId}`, {
        path: LOG_PATH,
        event: event,
        stack: err.stack
      });
    }
  };

  if (process.env.ALLOW_EVENT_DEPOSIT_NFT == 'true') {
    gameContract.on(EventName.DepositItem, async (...event) => {
      await executeCreateService(event, EventName.DepositItem);
    });
  }

  if (process.env.ALLOW_EVENT_WITHDRAW_NFT == 'true') {
    gameContract.on(EventName.WithdrawItem, async (...event) => {
      await executeCreateService(event, EventName.WithdrawItem);
    });
  }

  if (process.env.ALLOW_EVENT_DEPOSIT_TOKEN == 'true') {
    gameContract.on(EventName.DepositToken, async (...event) => {
      await executeCreateService(event, EventName.DepositToken);
    });
  }

  if (process.env.ALLOW_EVENT_WITHDRAW_TOKEN == 'true') {
    gameContract.on(EventName.WithdrawToken, async (...event) => {
      await executeCreateService(event, EventName.WithdrawToken);
    });
  }

  if (process.env.ALLOW_EVENT_REDEEM == 'true') {
    NFTContract.on(EventName.Redeem, async (...event) => {
      await executeCreateService(event, EventName.Redeem);
    });
  }

  if (process.env.ALLOW_EVENT_MINTED_STARTER_BOX == 'true') {
    NFTContract.on(EventName.OpenStarterBox, async (...event) => {
      await executeCreateService(event, EventName.OpenStarterBox);
    });
  }

  if (process.env.ALLOW_EVENT_OFFER == 'true') {
    marketplaceContract.on(EventName.Offer, async (...event) => {
      await executeCreateService(event, EventName.Offer);
    });
  }

  if (process.env.ALLOW_EVENT_BUY == 'true') {
    marketplaceContract.on(EventName.Buy, async (...event) => {
      await executeCreateService(event, EventName.Buy);
    });
  }

  if (process.env.ALLOW_EVENT_WITHDRAW == 'true') {
    marketplaceContract.on(EventName.Withdraw, async (...event) => {
      await executeCreateService(event, EventName.Withdraw);
    });
  }
}

handle().catch(async err => {
  logger.error(`Could not handle ${LOG_PATH} consumer`, {
    path: LOG_PATH,
    stack: err.stack
  });

  if (discordService) {
    await discordService.send(`Could not handle ${LOG_PATH} consumer`, [
      `Consumer: ${LOG_PATH}`,
      `stack: ${err.stack}`
    ].join('\n'));
  }

  process.exit(1);
});

export const blockchainConsumer = handle;
