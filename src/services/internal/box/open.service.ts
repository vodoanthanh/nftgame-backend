import { HttpException } from '@/exceptions/HttpException';
import FindBoxesService from '@/services/external/box/find.service';
import ExternalOpenBoxService from '@/services/external/box/open.service';
import GetSignedTxBoxService from './getSignedTx.service';

export default class OpenBoxService {
  private openBoxService = new ExternalOpenBoxService();
  private getSignedTxBoxService = new GetSignedTxBoxService();
  private findBoxesService = new FindBoxesService();

  async open(redeemerAddress: string, id: string): Promise<any> {
    const result = await this.findBoxesService.findOneByUser(id);
    const item = result.data;

    if (item.walletId.toLowerCase() != redeemerAddress.toLowerCase()) {
      throw new HttpException(400, 'This box is invalid for opening', 'INVALID_BOX_TYPE');
    }

    if (item.type == 'COMBOBOX') {
      return {
        hasSignexTx: true,
        data: await this.getSignedTxBoxService.generateSignedTxOpenBox(redeemerAddress, id, item.nonce, item.tokenId, item.nftNum)
      };
    }

    return {
      hasSignexTx: false,
      ...await this.openBoxService.open(redeemerAddress, id, [])
    };
  }
}
