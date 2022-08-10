import * as path from 'path';

const gameContract = require(path.resolve(process.cwd(), 'data/contracts/main/game.json'));
const RUNNOWContract = require(path.resolve(process.cwd(), 'data/contracts/main/RUNNOW.json'));
const RUNGEMContract = require(path.resolve(process.cwd(), 'data/contracts/main/RUNGEM.json'));
const GENIContract = require(path.resolve(process.cwd(), 'data/contracts/main/GENI.json'));
const USDTContract = require(path.resolve(process.cwd(), 'data/contracts/main/USDT.json'));
const NFTContract = require(path.resolve(process.cwd(), 'data/contracts/main/NFT.json'));
const marketplaceContract = require(path.resolve(process.cwd(), 'data/contracts/main/marketplace.json'));
const dexContract = require(path.resolve(process.cwd(), 'data/contracts/main/dex.json'));

export default {
  game: {
    address: gameContract.address,
    abi: gameContract.abi
  },
  RUNNOW: {
    address: RUNNOWContract.address,
    abi: RUNNOWContract.abi
  },
  RUNGEM: {
    address: RUNGEMContract.address,
    abi: RUNGEMContract.abi
  },
  GENI: {
    address: GENIContract.address,
    abi: GENIContract.abi
  },
  USDT: {
    address: USDTContract.address,
    abi: USDTContract.abi
  },
  NFT: {
    address: NFTContract.address,
    abi: NFTContract.abi
  },
  marketplace: {
    address: marketplaceContract.address,
    abi: marketplaceContract.abi
  },
  dex: {
    address: dexContract.address,
    abi: dexContract.abi
  }
};
