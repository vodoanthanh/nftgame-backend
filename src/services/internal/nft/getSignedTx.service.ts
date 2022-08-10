import { HttpException } from '@/exceptions/HttpException';
import FindNftsService from '@/services/external/nft/find.service';
import { deployer, gameContract, marketplaceContract, NFTContract } from '@/utils/contract';
import { genSignature, genSignatureMarketplace } from '@/utils/signature';
import { BigNumber } from 'ethers';
import { v4 as uuidv4 } from 'uuid';

export default class GetSignedTxNftService {
  private findNftsService = new FindNftsService();

  async generateSignedTxMint(id: string, nftType: string): Promise<any> {
    const result = await this.findNftsService.findOneByUser(id, {
      type: nftType
    });
    const item = result.data;

    if (item.isSoldOut || item.isComing || item.walletId) {
      throw new HttpException(400, 'This NFT is invalid for minting', 'INVALID_BOX_TYPE');
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
      itemType: 'nft',
      extraType: item.nftType,
      price: itemPrice,
      nonce: item.nonce,
    };

    // Sign voucher and return
    return {
      ...await genSignature(types, voucher, auth),
      price: itemPrice.toString()
    };
  }

  async generateSignedTxOffer(walletAddress: string, id: string, price: string, nftType: string): Promise<any> {
    const result = await this.findNftsService.findOneByUser(id, {
      type: nftType
    });
    const item = result.data;

    if (item.walletId.toLowerCase() != walletAddress.toLowerCase()) {
      throw new HttpException(400, 'You can not offer this NFT', 'INVALID_AUTH');
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
      itemType: 'nft',
      extraType: item.nftType,
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

  async generateSignedTxDeposit(walletAddress: string, id: string, nftType: string): Promise<any> {
    const result = await this.findNftsService.findOneByUser(id, {
      type: nftType
    });
    const item = result.data;

    if (item.walletId.toLowerCase() != walletAddress.toLowerCase() || item.state != 'WALLET') {
      throw new HttpException(400, 'You can not deposit this NFT', 'INVALID_AUTH');
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

    const nonce = item.nonce;
    const tokenId = BigNumber.from(item.tokenId);

    // Generate nonce as transaction id
    const voucher = {
      id: item.id,
      itemAddress: NFTContract.address,
      tokenId: tokenId,
      itemType: 'nft',
      extraType: item.nftType,
      nonce
    };

    // Sign voucher and return
    return {
      ...await genSignature(types, voucher, auth),
      tokenId: tokenId.toString()
    };
  }

  async generateSignedTxWithdraw(walletAddress: string, id: string, type: string): Promise<any> {
    const result = await this.findNftsService.findOneByUser(id, {
      type: type
    });
    const item = result.data;

    if (item.walletId.toLowerCase() != walletAddress.toLowerCase() || !item.isRequestWithdraw) {
      throw new HttpException(400, 'You can not withdraw this NFT', 'INVALID_AUTH');
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
      itemType: 'nft',
      extraType: item.nftType,
      nonce: item.nonce
    };

    // Sign voucher and return
    return {
      ...await genSignature(types, voucher, auth),
      tokenId: tokenId.toString()
    };
  }
}
