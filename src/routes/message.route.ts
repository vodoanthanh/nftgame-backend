import { Routes } from '@/interfaces/routes';
import CreateUserService from '@/services/external/user/create.service';
import FindUsersService from '@/services/external/user/find.service';
import SignMessageService from '@/services/internal/message/sign.service';
import { routeWrapper } from '@utils/routerWrapper';
import { Router } from 'express';

export class MessageRoute implements Routes {
  public path = '/v1/signMessage';
  public router = Router();
  public signMessageService = new SignMessageService();
  public findUsersService = new FindUsersService();
  public createUserService = new CreateUserService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/request', routeWrapper(async (req) => {
      const { walletID } = req.body;
      const data = await this.signMessageService.getMessage(walletID ? walletID.toLowerCase() : walletID);

      return { data };
    }));

    this.router.post('/verify', routeWrapper(async (req) => {
      const { walletID, signature } = req.body;
      const data = await this.signMessageService.verifySignedMessage(walletID ? walletID.toLowerCase() : walletID, signature);

      const userProfile = await this.findUsersService.findOne(walletID.toLowerCase());
      if (!userProfile.data) {
        await this.createUserService.create(walletID.toLowerCase());
      }

      return {
        data: {
          token: data,
          profile: userProfile.data || (await this.findUsersService.findOne(walletID.toLowerCase())).data
        }
      };
    }));

    this.router.post('/generate-signature', routeWrapper(async (req) => {
      const { message, privateKey } = req.body;
      const data = this.signMessageService.genrateSignature(message, privateKey);

      return { data };
    }));
  }
}
