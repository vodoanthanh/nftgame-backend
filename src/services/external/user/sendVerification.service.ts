import GameServerService from '../gameServer.service';

export default class SendVerificationService extends GameServerService {
  async send(walletAddress: string, email: string): Promise<any> {
    return await this.sendRequest({
      data: {
        action: 'SendVerification',
        walletId: walletAddress,
        email
      }
    });
  }
}
