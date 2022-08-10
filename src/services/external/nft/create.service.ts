import GameServerService from '../gameServer.service';

export default class CreateNftService extends GameServerService {
  async create(walletAddress: string, id: string, nftType: string, tokenId: number, txHash: string): Promise<any> {
    return await this.sendRequest({
      data: {
        action: 'CreateNFT',
        walletId: walletAddress,
        id,
        nftType,
        tokenId,
        txHash
      }
    });
  }
}
