import { sleep } from '@/utils/sleep';
import { logger } from '@utils/logger';
import axios, { AxiosRequestConfig, Method } from 'axios';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import DiscordService from '../common/discord.service';

export interface IRequestParams {
  url?: string;
  method?: Method;
  auth?: boolean;
  data?: any;
  headers?: object;
  retryCount?: number;
  sleepTimeout?: number;
  basicAuth?: {
    username: string;
    password: string;
  };
  params?: object;
  timeoutRequest?: number;
}

export default class BaseExternalService {
  protected timeoutRequest = 3000;
  private discordService: DiscordService | null = DiscordService.getInstance();

  logPath(): string {
    return this.constructor.name;
  }

  protected async sendRequest(params: IRequestParams): Promise<any> {
    if (_.isUndefined(params.retryCount)) {
      params.retryCount = 1;
    }

    if (_.isUndefined(params.sleepTimeout)) {
      params.sleepTimeout = 3000;
    }

    if (_.isUndefined(params.method)) {
      params.method = 'GET';
    }

    const requestId = uuidv4().toString();
    const startTime = (new Date).valueOf();
    const options: AxiosRequestConfig = {
      url: params.url,
      method: params.method,
      data: params.data,
      timeout: params.timeoutRequest ?? this.timeoutRequest,
      params: params.params,
      headers: {}
    };

    if (params.basicAuth) {
      options.auth = params.basicAuth;
    }

    if (params.headers) {
      _.merge(options.headers, params.headers);
    }

    try {
      const result = (await axios.request(options)).data;
      const duration = (new Date).valueOf() - startTime;

      logger.info(`Result: Send a request to "${options.url}"-"${requestId}"`, {
        path: this.logPath(),
        data: {
          duration: duration,
          options,
          data: result
        }
      });

      return result;
    }
    catch (err: any) {
      const duration = (new Date).valueOf() - startTime;
      const statusCode = _.get(err, 'response.status', 503);
      const response = _.get(err, 'response.data');
      err.status = statusCode;
      err.message = _.get(response, 'error.message', 'Something went wrong. Please try again!');
      err.code = _.get(response, 'error.code', 'BAD_EXTERNAL_REQUEST');

      logger.error(`Error(${statusCode}): Send a request to "${options.url}"-"${requestId}"`, {
        path: this.logPath(),
        data: {
          duration: duration,
          params,
          statusCode,
          stack: err.stack,
          data: response
        }
      });

      // Push notification to Slack or Discord
      if (this.discordService) {
        await this.discordService.send(`Error: ${err.message} from "${options.url}"`, [
          `Service: ${this.logPath()}`,
          `Status: ${statusCode}`,
          `Params: ${JSON.stringify(params)}`,
          `Response: ${JSON.stringify(response)}`
        ].join('\n'));
      }

      // Retry
      if (statusCode >= 500 && params.retryCount) {
        await sleep(params.sleepTimeout);
        return await this.sendRequest({ ...params, retryCount: params.retryCount - 1 });
      }

      throw err;
    }
  }
}
