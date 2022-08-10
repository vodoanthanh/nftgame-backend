import { Event } from '@/models/event.model';
import DiscordService from '@/services/common/discord.service';
import ProcessEventService from '@/services/internal/event/process.service';
import { logger } from '@/utils/logger';
import { sleep } from '@/utils/sleep';
import _ from 'lodash';
import { Op } from 'sequelize';

const LOG_PATH = 'ProcessEventsCronJob';
const discordService = DiscordService.getInstance();
const processEventService = new ProcessEventService();


async function handle(): Promise<void> {
  let isRunning = false;

  const handle = async () => {
    if (isRunning) {
      return;
    }
    isRunning = true;

    // TODO handle later
    const retryLimit = 3;
    const events = await Event.findAll({
      where: {
        isProcessed: false,
        isFailed: false,
        retryCount: {
          [Op.lt]: retryLimit
        }
      }
    });

    try {
      for (const event of events) {
        try {
          await processEventService.execute(event);
          Event.update(
            { isProcessed: true, processedAt: Date.now() },
            { where: { id: event.id } }
          );
        } catch (err: any) {
          await Event.update(
            { retryCount: Number(event.retryCount) + 1, isFailed: true, isProcessed: true, processedAt: Date.now() },
            { where: { id: event.id } }
          );

          if (discordService && Number(event.retryCount) + 1 == retryLimit) {
            await discordService.send(
              `Event **${event.id}** processing failed.`,
              [
                `Contract: ${event.contractName}`,
                `Event: ${event.name}`,
                `Retry: ${Number(event.retryCount) + 1} time`,
                `Stack: ${err.stack}`,
                `Errors: ${JSON.stringify(err.errors)}`
              ].join('\n')
            );
          }

          logger.error(`Event ${event.id} processing failed: ${err.message}`, {
            path: LOG_PATH,
            stack: err.stack,
            errors: err.errors ? _.map(err.errors, error => error.message) : undefined
          });
        }
      }
    } catch (err: any) {
      logger.error(`Event processing failed: ${err.message}`, {
        path: LOG_PATH,
        stack: err.stack,
        errors: err.errors ? _.map(err.errors, error => error.message) : undefined
      });
    }

    isRunning = false;
  };

  while (true) {
    await handle();
    await sleep(1000);
  }
}

handle().catch(async err => {
  logger.error(`Could not handle ${LOG_PATH} job`, {
    path: LOG_PATH,
    stack: err.stack
  });

  if (discordService) {
    await discordService.send(`Could not handle ${LOG_PATH} job`, [
      `Job: ${LOG_PATH}`,
      `stack: ${err.stack}`
    ].join('\n'));
  }

  process.exit(1);
});

export const processEventsJob = handle;
