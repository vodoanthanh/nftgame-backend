import { UserInstance } from '@/interfaces/model/user';
import { Routes } from '@/interfaces/routes';
import FindNftsService from '@/services/external/nft/find.service';
import GetSignedTxNftService from '@/services/internal/nft/getSignedTx.service';
import Identifier from '@/utils/identifier';
import { passportAuthenticateJWT, routeWrapper } from '@utils/routerWrapper';
import { Router } from 'express';

export class NftRoute implements Routes {
  public path = '/v1/nfts';
  public router = Router();
  public findNftService = new FindNftsService();
  public getSignedTxNftService = new GetSignedTxNftService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/findByMarket', routeWrapper(async (req) => {
      const params = {
        limit: req.query.limit ? Number(req.query.limit) : 10,
        page: req.query.page ? Number(req.query.page) : 1,
        sort: req.query.sort ? req.query.sort : undefined,
        filter: {
          nftType: req.query.nftType
        }
      } as any;

      if (req.query.rarity) {
        params.filter.rarity = String(req.query.rarity).split(',');
      }

      if (req.query.class) {
        params.filter.class = String(req.query.class).split(',');
      }

      if (req.query.fromPrice || req.query.toPrice) {
        const fromPrice = req.query.fromPrice || 0;
        const toPrice = req.query.toPrice || 999_999_999_999;
        params.filter.priceRange = [fromPrice, toPrice];
      }

      if (req.query.belongToParentId) {
        params.filter.belongToParentId = req.query.belongToParentId;
      }

      if (req.query.hasChildId) {
        params.filter.hasChildId = req.query.hasChildId;
      }

      if (req.query.type) {
        params.filter.type = String(req.query.type).split(',');
      }

      if (req.query.brand) {
        params.filter.brand = String(req.query.brand).split(',');
      }

      return await this.findNftService.paginate(params);
    }));

    this.router.get('/findByTeam', routeWrapper(async (req) => {
      const params = {
        limit: req.query.limit ? Number(req.query.limit) : 10,
        page: req.query.page ? Number(req.query.page) : 1,
        sort: req.query.sort ? req.query.sort : undefined,
        filter: {
          nftType: req.query.nftType
        }
      } as any;

      return await this.findNftService.paginateByTeam(params);
    }));

    this.router.get('/findByUser', passportAuthenticateJWT, routeWrapper(async (req) => {
      const user = req.user as UserInstance;
      const params = {
        limit: req.query.limit ? Number(req.query.limit) : 10,
        page: req.query.page ? Number(req.query.page) : 1,
        filter: {
          nftType: req.query.nftType
        }
      } as any;

      if (req.query.state) {
        params.filter.state = req.query.state;
      }

      return await this.findNftService.paginateByUser(user.walletID, params);
    }));

    this.router.get('/:id/getSignedTxMint', passportAuthenticateJWT, routeWrapper(async (req) => {
      const user = req.user as UserInstance;
      const { id } = req.params;
      const [nftId, nftType] = Identifier.decode(id);

      return {
        data: await this.getSignedTxNftService.generateSignedTxMint(nftId, nftType)
      };
    }));

    this.router.get('/:id/getSignedTxOffer', passportAuthenticateJWT, routeWrapper(async (req) => {
      const user = req.user as UserInstance;
      const { id } = req.params;
      const [nftId, nftType] = Identifier.decode(id);

      return {
        data: await this.getSignedTxNftService.generateSignedTxOffer(user.walletID, nftId, String(req.query.itemPrice), nftType)
      };
    }));

    this.router.get('/:id/getSignedTxDeposit', passportAuthenticateJWT, routeWrapper(async (req) => {
      const user = req.user as UserInstance;
      const { id } = req.params;
      const [nftId, nftType] = Identifier.decode(id);

      return {
        data: await this.getSignedTxNftService.generateSignedTxDeposit(user.walletID, nftId, nftType)
      };
    }));

    this.router.get('/:id/getSignedTxWithdraw', passportAuthenticateJWT, routeWrapper(async (req) => {
      const user = req.user as UserInstance;
      const { id } = req.params;
      const [nftId, nftType] = Identifier.decode(id);

      return {
        data: await this.getSignedTxNftService.generateSignedTxWithdraw(user.walletID, nftId, nftType)
      };
    }));

    this.router.get('/:id/transactions', routeWrapper(async (req) => {
      const { id } = req.params;
      const [nftId, nftType] = Identifier.decode(id);
      const params = {
        limit: req.query.limit ? Number(req.query.limit) : 10,
        page: req.query.page ? Number(req.query.page) : 1,
        sort: req.query.sort ? req.query.sort : undefined,
        filter: {
          nftType
        }
      } as any;

      return await this.findNftService.paginateTransactions(nftId, params);
    }));

    this.router.get('/:id', routeWrapper(async (req) => {
      const { id } = req.params;
      const [nftId, nftType] = Identifier.decode(id);

      return await this.findNftService.findOneByUser(nftId, {
        type: nftType
      });
    }));
  }
}
