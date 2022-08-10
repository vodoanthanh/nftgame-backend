import { User } from '@/models/user.model';
import { config } from '@config/jwtConfig';
import { HttpException } from '@exceptions/HttpException';
import { UserInstance } from '@interfaces/model/user';
import { personalSign } from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';
import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const msgFromNonce = (nonce: string) => `I am signing my one-time RUNNOWOM nonce: ${nonce}`;

export default class SignMessageService {
  async verifySignedMessage(walletID: string, signature: string) {
    if (!signature || !walletID) {
      throw new HttpException(400, 'Request should have signature and walletID');
    }

    // get the user with the given walletID
    const user: UserInstance | null = await User.findOne({ where: { walletID } });
    if (!user) {
      throw new HttpException(401, `User with walletID ${walletID} is not found in database`, 'NOT_FOUND');
    }

    // verify digital signature
    const message = msgFromNonce(user.nonce);
    // use ethers lib to extract the address from the message and signature
    const address = ethers.utils.verifyMessage(message, signature);
    // the signature verification is successful if the address
    // found with ethers matches the initial walletID
    if (address.toLowerCase() !== walletID.toLowerCase()) {
      throw new HttpException(401, 'Signature verification failed', 'INVALID_SIGNATURE');
    }

    // generate a new nonce for the user
    user.nonce = uuidv4();
    await user.save();

    // create JWT for authenticate
    // https://github.com/auth0/node-jsonwebtoken
    const accessToken = await jwt.sign(
      {
        payload: {
          id: user.id,
          walletID,
        },
      },
      config.secret,
      {
        algorithm: config.algorithms[0],
      },
    );

    if (!accessToken) {
      throw new HttpException(503, 'Empty token');
    }

    return accessToken;
  }

  async getMessage(walletID: string) {
    if (!walletID) {
      throw new HttpException(400, 'Request should have walletID', 'EMPTY');
    }

    // find user with given wallet id
    let user: UserInstance | null = await User.findOne({ where: { walletID } });

    // if user has not yet create then create new record in db
    if (!user) {
      user = await User.create({ walletID });
    }

    // response nonce to user
    return msgFromNonce(user.nonce);
  }

  genrateSignature(message: string, privateKey: string): string {
    const privateKeyHex = Buffer.from(privateKey, 'hex');
    const msgBufferHex = bufferToHex(Buffer.from(message, 'utf8'));

    return personalSign(privateKeyHex, { data: msgBufferHex });
  }
}
