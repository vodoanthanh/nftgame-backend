import { UserInstance } from '@/interfaces/model/user';
import { Routes } from '@/interfaces/routes';
import FindBoxesService from '@/services/external/box/find.service';
import GetSignedTxBoxService from '@/services/internal/box/getSignedTx.service';
import OpenBoxService from '@/services/internal/box/open.service';
import { passportAuthenticateJWT, routeWrapper } from '@utils/routerWrapper';
import { Router } from 'express';

export class BoxRoute implements Routes {
  public path = '/v1/boxes';
  public router = Router();
  public findBoxService = new FindBoxesService();
  public getSignedTxBoxService = new GetSignedTxBoxService();
  public openBoxService = new OpenBoxService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/findByTeam', routeWrapper(async (req) => {
      const params = {
        limit: req.query.limit ? Number(req.query.limit) : 10,
        page: req.query.page ? Number(req.query.page) : 1,
        sort: req.query.sort ? req.query.sort : undefined,
        filter: {}
      } as any;

      if (req.query.nftType) {
        params.filter.nftType = req.query.nftType;
      }

      return await this.findBoxService.paginateByTeam(params);
    }));

    this.router.get('/findByMarket', routeWrapper(async (req) => {
      const params = {
        limit: req.query.limit ? Number(req.query.limit) : 10,
        page: req.query.page ? Number(req.query.page) : 1,
        sort: req.query.sort ? req.query.sort : undefined,
        filter: {}
      } as any;

      if (req.query.nftType) {
        params.filter.nftType = req.query.nftType;
      }

      return await this.findBoxService.paginateByMarket(params);
    }));

    this.router.get('/findByUser', passportAuthenticateJWT, routeWrapper(async (req) => {
      const user = req.user as UserInstance;
      const params = {
        limit: req.query.limit ? Number(req.query.limit) : 10,
        page: req.query.page ? Number(req.query.page) : 1,
        filter: {}
      } as any;

      if (req.query.state) {
        params.filter.state = req.query.state;
      }
      if (req.query.nftType) {
        params.filter.nftType = req.query.nftType;
      }

      return await this.findBoxService.paginateByUser(user.walletID, params);
    }));

    this.router.get('/:id/findByTeam', routeWrapper(async (req) => {
      const { id } = req.params;

      return await this.findBoxService.findOneByTeam(id);
    }));

    this.router.get('/:id/getSignedTxMint', routeWrapper(async (req) => {
      const { id } = req.params;

      return {
        data: await this.getSignedTxBoxService.generateSignedTxMint(id)
      };
    }));

    this.router.get('/:id/getSignedTxOffer', passportAuthenticateJWT, routeWrapper(async (req) => {
      const user = req.user as UserInstance;
      const { id } = req.params;

      return {
        data: await this.getSignedTxBoxService.generateSignedTxOffer(user.walletID, id, String(req.query.itemPrice))
      };
    }));

    this.router.get('/:id/getSignedTxDeposit', passportAuthenticateJWT, routeWrapper(async (req) => {
      const user = req.user as UserInstance;
      const { id } = req.params;

      return {
        data: await this.getSignedTxBoxService.generateSignedTxDeposit(user.walletID, id)
      };
    }));

    this.router.get('/:id/getSignedTxWithdraw', passportAuthenticateJWT, routeWrapper(async (req) => {
      const user = req.user as UserInstance;
      const { id } = req.params;

      return {
        data: await this.getSignedTxBoxService.generateSignedTxWithdraw(user.walletID, id)
      };
    }));

    this.router.get('/:id/transactions', routeWrapper(async (req) => {
      const { id } = req.params;
      const params = {
        limit: req.query.limit ? Number(req.query.limit) : 10,
        page: req.query.page ? Number(req.query.page) : 1,
      } as any;

      return await this.findBoxService.paginateTransactions(id, params);
    }));

    this.router.post('/:id/open', passportAuthenticateJWT, routeWrapper(async (req) => {
      const user = req.user as UserInstance;
      const { id } = req.params;

      return {
        data: await this.openBoxService.open(user.walletID, id)
      };
    }));

    this.router.get('/:id/openedNewNfts', passportAuthenticateJWT, routeWrapper(async (req) => {
      const user = req.user as UserInstance;
      const { id } = req.params;

      return await this.findBoxService.findOpenedNewNfts(user.walletID, id);
    }));

    this.router.get('/:id', routeWrapper(async (req) => {
      const { id } = req.params;

      return await this.findBoxService.findOneByUser(id);
    }));
  }
}
