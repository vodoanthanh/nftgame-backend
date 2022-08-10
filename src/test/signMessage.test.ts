import { User } from '@/models/user.model';
import server from '@utils/server';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { personalSign } from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';
chai.use(chaiHttp);

const ethAccount = {
  address: '0x34c6e5146de6cedc70f4b28f48515583843dd0e8',
  privateKey: '7ab44b5168b1acbc5c2daae827b676802ee925410396fb81c91eb21cd4fc7dcf'
};

describe('sign message route', () => {
  beforeEach(async () => {
    // Renew database before test
    await User.sync({ force: true });
  });

  describe('request', () => {
    it('response message with new login', async () => {
      const res = await chai.request(server).post('/v1/signMessage/request').send({
        walletID: ethAccount.address
      });

      // Validate result
      chai.expect(res.status).equal(200);
      chai.expect(res.body.data).to.be.a('string')
        .and.satisfy((msg: string) => msg.startsWith('I am signing my one-time RUNNOWOM nonce: '));
    });

    it('response exception when missing walletID', async () => {
      const res = await chai.request(server).post('/v1/signMessage/request').send();

      // Validate result
      chai.expect(res.status).equal(400);
      chai.expect(res.body.error.message).equal('Request should have walletID');
    });
  });

  describe('verify', () => {
    it('response access token with correct signed message', async () => {
      // Get message from api
      let res = await chai.request(server).post('/v1/signMessage/request').send({
        walletID: ethAccount.address
      });
      const message = res.body.data;

      // Sign message
      const privateKeyHex = Buffer.from(ethAccount.privateKey, 'hex');
      const msgBufferHex = bufferToHex(Buffer.from(message, 'utf8'));
      const signature = personalSign(privateKeyHex, { data: msgBufferHex });

      // Verify message
      res = await chai.request(server).post('/v1/signMessage/verify').send({
        walletID: ethAccount.address,
        signature: signature
      });

      // Validate result
      chai.expect(res.status).equal(200);
    });

    it('response http exception when missing walletID', async () => {
      const res = await chai.request(server).post('/v1/signMessage/verify').send({
        signature: 'abc'
      });

      // Validate result
      chai.expect(res.status).equal(400);
      chai.expect(res.body.error.message).equal('Request should have signature and walletID');
    });

    it('response http exception when missing signature', async () => {
      const res = await chai.request(server).post('/v1/signMessage/verify').send({
        walletID: 'abc'
      });

      // Validate result
      chai.expect(res.status).equal(400);
      chai.expect(res.body.error.message).equal('Request should have signature and walletID');
    });

    it('response http exception with wrong signature', async () => {
      User.create({ walletID: ethAccount.address });
      // Sign wrong message
      const message = 'abc';
      const privateKeyHex = Buffer.from(ethAccount.privateKey, 'hex');
      const msgBufferHex = bufferToHex(Buffer.from(message, 'utf8'));
      const signature = personalSign(privateKeyHex, { data: msgBufferHex });

      const res = await chai.request(server).post('/v1/signMessage/verify').send({
        walletID: ethAccount.address,
        signature: signature
      });

      // Validate result
      chai.expect(res.status).equal(401);
      chai.expect(res.body.error.message).equal('Signature verification failed');
    });
  });
});
