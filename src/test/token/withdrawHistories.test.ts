import server from '@utils/server';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);

describe('/GET v1/tokens/withdrawHistories', () => {
  it('it should GET all withdraw token histories', async () => {
    const res = await chai.request(server).get('/v1/tokens/withdrawHistories');
    expect(res).to.have.status(401);
  });
});
