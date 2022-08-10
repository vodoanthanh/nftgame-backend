import { HttpException } from '@/exceptions/HttpException';
import FindBoxService from '@/services/external/box/find.service';
import { deployer, gameContract, marketplaceContract, NFTContract } from '@/utils/contract';
import { genSignature, genSignatureMarketplace } from '@/utils/signature';
import { BigNumber } from 'ethers';
import { v4 as uuidv4 } from 'uuid';

export default class GetSignedTxBoxService {
  private findBoxService = new FindBoxService();

  async generateSignedTxMint(id: string): Promise<any> {
    const result = await this.findBoxService.findOneByTeam(id);
    const item = result.data;

    if (item.isSoldOut || item.isComing || item.walletId) {
      throw new HttpException(400, 'This box is invalid for minting', 'INVALID_BOX_TYPE');
    }

    // Authenticator for voucher
    const auth = {
      signer: deployer,
      contract: NFTContract.address,
    };

    // Specific voucher structure
    const types = {
      ItemVoucherStruct: [
        { name: 'id', type: 'string' },
        { name: 'itemType', type: 'string' },
        { name: 'extraType', type: 'string' },
        { name: 'price', type: 'uint256' },
        { name: 'nonce', type: 'string' },
      ],
    };

    // Generate nonce as transaction id
    const itemPrice = BigNumber.from(item.weiPrice);
    const voucher = {
      id: item.id,
      itemType: 'box',
      extraType: '',
      price: itemPrice,
      nonce: item.nonce,
    };

    // Sign voucher and return
    return {
      ...await genSignature(types, voucher, auth),
      price: itemPrice.toString()
    };
  }

  async generateSignedTxOpenBox(walletAddress: string, id: string, nonce: string, tokenId: number, nftNum: number): Promise<any> {
    // Authenticator for voucher
    const auth = {
      signer: deployer,
      contract: NFTContract.address,
    };

    // Specific voucher structure
    const types = {
      StarterBoxStruct: [
        { name: 'walletAddress', type: 'address' },
        { name: 'id', type: 'string' },
        { name: 'tokenId', type: 'uint256' },
        { name: 'numberTokens', type: 'uint256' },
        { name: 'nonce', type: 'string' },
      ],
    };

    // Generate nonce as transaction id
    const boxTokenId = BigNumber.from(tokenId);
    const numberTokens = BigNumber.from(nftNum);
    const voucher = {
      walletAddress,
      id,
      tokenId: boxTokenId,
      numberTokens: numberTokens,
      nonce
    };

    // Sign voucher and return
    return {
      ...await genSignature(types, voucher, auth),
      boxTokenId: boxTokenId.toString(),
      numberTokens: numberTokens.toString()
    };
  }

  async generateSignedTxOffer(walletAddress: string, id: string, price: string): Promise<any> {
    const result = await this.findBoxService.findOneByUser(id);
    const item = result.data;

    if (item.walletId.toLowerCase() != walletAddress.toLowerCase()) {
      throw new HttpException(400, 'You can not offer this Box', 'INVALID_AUTH');
    }

    // Authenticator for voucher
    const auth = {
      signer: deployer,
      contract: marketplaceContract.address,
    };

    // Specific order structure
    const types = {
      OrderItemStruct: [
        { name: 'walletAddress', type: 'address' },
        { name: 'id', type: 'string' },
        { name: 'itemType', type: 'string' },
        { name: 'extraType', type: 'string' },
        { name: 'tokenId', type: 'uint256' },
        { name: 'itemAddress', type: 'address' },
        { name: 'price', type: 'uint256' },
        { name: 'nonce', type: 'string' },
      ],
    };

    const nonce = uuidv4();
    const tokenId = BigNumber.from(item.tokenId);
    const itemPrice = BigNumber.from(price);

    // Generate nonce as transaction id
    const orderItem = {
      walletAddress,
      id: id,
      itemType: 'box',
      extraType: '',
      tokenId: BigNumber.from(item.tokenId),
      itemAddress: NFTContract.address,
      price: itemPrice,
      nonce
    };

    // Sign order and return
    return {
      ...await genSignatureMarketplace(types, orderItem, auth),
      tokenId: tokenId.toString(),
      price: itemPrice.toString()
    };
  }

  async generateSignedTxDeposit(walletAddress: string, id: string): Promise<any> {
    const result = await this.findBoxService.findOneByUser(id);
    const item = result.data;

    if (item.walletId.toLowerCase() != walletAddress.toLowerCase() || item.state != 'WALLET') {
      throw new HttpException(400, 'You can not deposit this Box', 'INVALID_AUTH');
    }

    // Authenticator for voucher
    const auth = {
      signer: deployer,
      contract: gameContract.address,
    };

    // Specific order structure
    const types = {
      DepositItemStruct: [
        { name: 'id', type: 'string' },
        { name: 'itemAddress', type: 'address' },
        { name: 'tokenId', type: 'uint256' },
        { name: 'itemType', type: 'string' },
        { name: 'extraType', type: 'string' },
        { name: 'nonce', type: 'string' },
      ],
    };

    const nonce = uuidv4();
    const tokenId = BigNumber.from(item.tokenId);

    // Generate nonce as transaction id
    const voucher = {
      id: item.id,
      itemAddress: NFTContract.address,
      tokenId: tokenId,
      itemType: 'box',
      extraType: '',
      nonce
    };

    // Sign voucher and return
    return {
      ...await genSignature(types, voucher, auth),
      tokenId: tokenId.toString()
    };
  }

  async generateSignedTxWithdraw(walletAddress: string, id: string): Promise<any> {
    const result = await this.findBoxService.findOneByUser(id);
    const item = result.data;

    if (item.walletId.toLowerCase() != walletAddress.toLowerCase() || !item.isRequestWithdraw) {
      throw new HttpException(400, 'You can not withdraw this Box', 'INVALID_AUTH');
    }

    // Authenticator for voucher
    const auth = {
      signer: deployer,
      contract: gameContract.address,
    };

    // Specific order structure
    const types = {
      WithdrawItemStruct: [
        { name: 'walletAddress', type: 'address' },
        { name: 'id', type: 'string' },
        { name: 'itemAddress', type: 'address' },
        { name: 'tokenId', type: 'uint256' },
        { name: 'itemType', type: 'string' },
        { name: 'extraType', type: 'string' },
        { name: 'nonce', type: 'string' },
      ],
    };

    const tokenId = BigNumber.from(item.tokenId);

    // Generate nonce as transaction id
    const voucher = {
      walletAddress,
      id: item.id,
      itemAddress: NFTContract.address,
      tokenId: tokenId,
      itemType: 'box',
      extraType: '',
      nonce: item.nonce
    };

    // Sign voucher and return
    return {
      ...await genSignature(types, voucher, auth),
      tokenId: tokenId.toString()
    };
  }
}
