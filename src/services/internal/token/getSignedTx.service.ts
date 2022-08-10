import { HttpException } from '@/exceptions/HttpException';
import FindTokensService from '@/services/external/token/find.service';
import { deployer, gameContract } from '@/utils/contract';
import Price from '@/utils/price';
import { genSignature } from '@/utils/signature';
import { getTokenAddress } from '@/utils/tokenType';
import { BigNumber } from 'ethers';

export default class GetSignedTxTokenService {
  private findTokenService = new FindTokensService();

  async generateSignedTxWithdraw(walletAddress: string, id: string): Promise<any> {
    const result = await this.findTokenService.findOneTransaction(walletAddress, id);
    const item = result.data;

    if (item.walletId.toLowerCase() != walletAddress.toLowerCase() || item.isDeposit || item.isCompleted) {
      throw new HttpException(400, 'This token transaction is invalid for withdrawing', 'INVALID_TOKEN_TRANSACTION_TYPE');
    }

    // Authenticator for voucher
    const auth = {
      signer: deployer,
      contract: gameContract.address,
    };

    // Specific voucher structure
    const types = {
      WithdrawTokenStruct: [
        { name: 'walletAddress', type: 'address' },
        { name: 'isNativeToken', type: 'bool' },
        { name: 'tokenAddress', type: 'address' },
        { name: 'amount', type: 'uint256' },
        { name: 'nonce', type: 'string' },
      ],
    };

    // Generate nonce as transaction id
    const amount = Price.convertToWei(item.amount);
    const voucher = {
      walletAddress,
      isNativeToken: item.tokenType == 'NATIVE',
      tokenAddress: getTokenAddress(item.tokenType),
      amount: BigNumber.from(amount),
      nonce: item.nonce
    };

    // Sign voucher and return
    return {
      ...await genSignature(types, voucher, auth),
      amount: amount.toString()
    };
  }
}
