import { feeConfig } from '@/config/feeConfig';
import { marketplaceConfig } from '@/config/marketplaceConfig';
import { Routes } from '@/interfaces/routes';
import { routeWrapper } from '@utils/routerWrapper';
import { Router } from 'express';

export class ConfigRoute implements Routes {
  public path = '/v1/configs';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', routeWrapper((req) => {
      return {
        data: {
          feeConfig,
          marketplaceConfig
        }
      };
    }));
  }
}
