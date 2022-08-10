import { discordConfig } from '@/config/discordConfig';
import { logger } from '@/utils/logger';
import { Webhook } from 'discord-webhook-node';

export default class DiscordService {
  private static instance: DiscordService;
  private webhook: Webhook;

  private constructor() {
    this.webhook = new Webhook(String(discordConfig.webHookUrl));
  }

  logPath(): string {
    return this.constructor.name;
  }

  static getInstance() {
    if (discordConfig.enable && discordConfig.webHookUrl) {
      if (!DiscordService.instance) {
        this.instance = new DiscordService();
      }

      return this.instance;
    }

    return null;
  }

  async send(title: string, description: string) {
    try {
      await this.webhook.error(`(${process.env.NODE_ENV}) ${title}`, '-------------', description.slice(0, 1024));
    } catch (err: any) {
      logger.error(err.message, {
        path: this.logPath(),
        data: {
          stack: err.stack
        }
      });
    }
  }
}
