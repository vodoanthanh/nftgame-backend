import { HttpException } from '@/exceptions/HttpException';
import _ from 'lodash';
import BaseExternalService, { IRequestParams } from './base.service';

export default class GameServerService extends BaseExternalService {
  protected timeoutRequest: number = 10_000;

  protected async sendRequest(params: IRequestParams): Promise<any> {
    if (process.env.GAME_SERVER_API_URL && process.env.GAME_SERVER_API_KEY) {
      if (_.isUndefined(params.retryCount)) {
        params.url = process.env.GAME_SERVER_API_URL;
        params.method = 'POST';
        params.headers = { key: process.env.GAME_SERVER_API_KEY };
        params.retryCount = 5;
      }

      try {
        return await super.sendRequest(params);
      } catch (err: any) {
        if (err.status && err.status == 403) {
          err.status = 400;
        }
        throw err;
      }
    }

    throw new HttpException(500, 'Missing Game Server API Url Config');
  }
}
