import contract from '@config/contracts';
import 'dotenv/config';
import { Contract, ethers } from 'ethers';

export const provider = new ethers.providers.JsonRpcProvider(`${process.env.PROVIDER_URL}`);

export const deployer = new ethers.Wallet(`${process.env.DEPLOYER_PRIVATE_KEY}`, provider);

export const gameContract = new Contract(contract.game.address, contract.game.abi, provider);

export const NFTContract = new Contract(contract.NFT.address, contract.NFT.abi, provider);

export const marketplaceContract = new Contract(contract.marketplace.address, contract.marketplace.abi, provider);

export const dexContract = new Contract(contract.dex.address, contract.dex.abi);
