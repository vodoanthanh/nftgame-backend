import GameServerService from '../gameServer.service';

export default class VerifyOtpService extends GameServerService {
  async verify(walletAddress: string, email: string, otp: string): Promise<any> {
    return await this.sendRequest({
      data: {
        action: 'VerifyOTP',
        walletId: walletAddress,
        email,
        otp
      }
    });
  }
}
