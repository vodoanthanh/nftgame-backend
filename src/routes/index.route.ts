import { Routes } from '@/interfaces/routes';
import { MessageRoute } from '@/routes/message.route';
import IndexService from '@/services/index';
import { Router } from 'express';
import { BoxRoute } from './box.route';
import { ConfigRoute } from './config.route';
import { NftRoute } from './nft.route';
import { PriceRoute } from './price.route';
import { TokenRoute } from './token.route';
import { UserRoute } from './user.route';

class IndexRoute implements Routes {
  public path = '/';
  public router = Router();
  private indexService = new IndexService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, (req, res, next) => {
      try {
        res.status(200).json(this.indexService.hello());
      } catch (error) {
        next(error);
      }
    });
  }
}

const routes: Routes[] = [
  new IndexRoute(),
  new MessageRoute(),
  new NftRoute(),
  new BoxRoute(),
  new TokenRoute(),
  new ConfigRoute(),
  new PriceRoute(),
  new UserRoute(),
];

export default routes;
