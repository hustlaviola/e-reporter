import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';

chai.use(chaiHttp);

const { expect } = chai;

let userToken;
let adminToken;

describe('/POST incidents routes', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'viola10@gmail.com',
        password: 'viola10',
      })
      .end((err, res) => {
        userToken = res.body.data[0].token;
        done(err);
      });
  });

  it('should add a new incident record if details are valid', (done) => {
    const incident = {
      latitude: '+33.334',
      longitude: '-179.002',
      comment: 'Police brutality',
      images: 'bluebird.png, greentree.jpeg, redferrari.jpg',
      videos: 'policebust.mkv, treehouse.mp4, lighthouse.avi',
    };
    chai
      .request(app)
      .post('/api/v1/red-flags')
      .set('authorization', `Bearer ${userToken}`)
      .send(incident)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0]).to.have.property('message')
          .eql('Created red-flag record');
        expect(res.body).to.deep.eql({
          status: res.statusCode,
          data: [{
            id: res.body.data[0].id,
            message: 'Created red-flag record',
          }],
        });
        done(err);
      });
  });
});
