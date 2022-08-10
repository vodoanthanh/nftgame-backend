import { ethers } from 'ethers';

export default class Price {
  static convertToWei(price: number) {
    return ethers.utils.parseEther(price.toString()).toString();
  }

  static convertToEther(price: string) {
    return ethers.utils.formatEther(price).toString();
  }
}
