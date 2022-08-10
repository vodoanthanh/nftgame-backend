import { UserInstance } from '@/interfaces/model/user';
import { Routes } from '@/interfaces/routes';
import FindTokensService from '@/services/external/token/find.service';
import GetSignedTxTokenService from '@/services/internal/token/getSignedTx.service';
import { passportAuthenticateJWT, routeWrapper } from '@utils/routerWrapper';
import { Router } from 'express';

export class TokenRoute implements Routes {
  public path = '/v1/tokens';
  public router = Router();
  private findTokensService = new FindTokensService();
  private getSignedTxTokenService = new GetSignedTxTokenService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/withdrawHistories', passportAuthenticateJWT, routeWrapper(async (req) => {
      const user = req.user as UserInstance;
      const params = {
        limit: req.query.limit ? Number(req.query.limit) : 10,
        page: req.query.page ? Number(req.query.page) : 1,
        filter: {
          tokenType: req.query.tokenType || 'NATIVE',
          isDeposit: false,
          status: 'ALL'
        }
      } as any;

      return await this.findTokensService.paginateWithdrawHistories(user.walletID, params);
    }));

    this.router.get('/withdrawHistories/:id/getSignedTxWithdraw', passportAuthenticateJWT, routeWrapper(async (req) => {
      const user = req.user as UserInstance;
      const { id } = req.params;

      return {
        data: await this.getSignedTxTokenService.generateSignedTxWithdraw(user.walletID, id)
      };
    }));

    this.router.get('/depositHistories', passportAuthenticateJWT, routeWrapper(async (req) => {
      const user = req.user as UserInstance;
      const params = {
        limit: req.query.limit ? Number(req.query.limit) : 10,
        page: req.query.page ? Number(req.query.page) : 1,
        filter: {
          tokenType: req.query.tokenType || 'NATIVE',
          isDeposit: true,
          status: 'ALL'
        }
      } as any;

      return await this.findTokensService.paginateDepositHistories(user.walletID, params);
    }));
  }
}
