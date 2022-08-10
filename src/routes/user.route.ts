import { UserInstance } from '@/interfaces/model/user';
import { Routes } from '@/interfaces/routes';
import FindUsersService from '@/services/external/user/find.service';
import SendVerificationService from '@/services/external/user/sendVerification.service';
import UpdateUserService from '@/services/external/user/update.service';
import VerifyOtpService from '@/services/external/user/verifyOtp.service';
import { passportAuthenticateJWT, routeWrapper } from '@utils/routerWrapper';
import { Router } from 'express';

export class UserRoute implements Routes {
  public path = '/v1/users';
  public router = Router();
  public findUsersService = new FindUsersService();
  public updateUserService = new UpdateUserService();
  public sendVerificationService = new SendVerificationService();
  public verifyOtpService = new VerifyOtpService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/profile', passportAuthenticateJWT, routeWrapper(async (req) => {
      const user = req.user as UserInstance;

      return await this.findUsersService.findOne(user.walletID);
    }));

    this.router.put('/profile', passportAuthenticateJWT, routeWrapper(async (req) => {
      const user = req.user as UserInstance;
      const params = {} as any;

      if (req.body.password) {
        params.password = req.body.password;
        await this.updateUserService.update(user.walletID, params);
      }

      return await this.findUsersService.findOne(user.walletID);
    }));

    this.router.post('/send-verification', passportAuthenticateJWT, routeWrapper(async (req) => {
      const user = req.user as UserInstance;

      await this.sendVerificationService.send(user.walletID, req.body.email);

      return {
        data: true
      };
    }));

    this.router.post('/verify-otp', passportAuthenticateJWT, routeWrapper(async (req) => {
      const user = req.user as UserInstance;

      await this.verifyOtpService.verify(user.walletID, req.body.email, req.body.otp);

      return {
        data: true
      };
    }));
  }
}
