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
        email: 'viola1@gmail.com',
        password: 'vvvvvv',
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
          status: 201,
          data: [{
            id: res.body.data[0].id,
            message: 'Created red-flag record',
          }],
        });
        done(err);
      });
  });

  it('should return an error if user is not authenticated', (done) => {
    chai
      .request(app)
      .post('/api/v1/interventions')
      .set('authorization', '')
      .send({
        latitude: '33.555',
        longitude: '44.666',
        comment: 'collapsed bridge',
        images: 'red.jpeg, blue.png, green.jpg',
        videos: 'tree.mp4, grre.mkv, ger.avi',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('You are not logged in');
        done(err);
      });
  });

  it('should return an error if latitude field is empty', (done) => {
    chai
      .request(app)
      .post('/api/v1/interventions')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        latitude: '',
        longitude: '44.666',
        comment: 'collapsed bridge',
        images: 'red.jpeg, blue.png, green.jpg',
        videos: 'tree.mp4, grre.mkv, ger.avi',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('latitude is required');
        done(err);
      });
  });

  it('should return an error if latitude is badly formatted', (done) => {
    chai
      .request(app)
      .post('/api/v1/interventions')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        latitude: '110.005',
        longitude: '44.666',
        comment: 'collapsed bridge',
        images: 'red.jpeg, blue.png, green.jpg',
        videos: 'tree.mp4, grre.mkv, ger.avi',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('invalid latitude format');
        done(err);
      });
  });

  it('should return an error if longitude field is empty', (done) => {
    chai
      .request(app)
      .post('/api/v1/interventions')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        latitude: '33.445',
        longitude: '',
        comment: 'collapsed bridge',
        images: 'red.jpeg, blue.png, green.jpg',
        videos: 'tree.mp4, grre.mkv, ger.avi',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('longitude is required');
        done(err);
      });
  });

  it('should return an error if longitude is badly formatted', (done) => {
    chai
      .request(app)
      .post('/api/v1/interventions')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        latitude: '11.005',
        longitude: '440.666',
        comment: 'collapsed bridge',
        images: 'red.jpeg, blue.png, green.jpg',
        videos: 'tree.mp4, grre.mkv, ger.avi',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('invalid longitude format');
        done(err);
      });
  });

  it('should return an error if comment field is empty', (done) => {
    chai
      .request(app)
      .post('/api/v1/interventions')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        latitude: '33.445',
        longitude: '44.556',
        comment: '',
        images: 'red.jpeg, blue.png, green.jpg',
        videos: 'tree.mp4, grre.mkv, ger.avi',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('Comment is required');
        done(err);
      });
  });

  it('should return an error if comment is too short', (done) => {
    chai
      .request(app)
      .post('/api/v1/interventions')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        latitude: '33.445',
        longitude: '44.556',
        comment: 'thief',
        images: 'red.jpeg, blue.png, green.jpg',
        videos: 'tree.mp4, grre.mkv, ger.avi',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('Comment is too short, must have at least 10 characters');
        done(err);
      });
  });

  it('should return an error if media is of the wrong type', (done) => {
    chai
      .request(app)
      .post('/api/v1/interventions')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        latitude: '33.445',
        longitude: '44.556',
        comment: 'Police corruption',
        images: 'red.mkg, blue.png, green.jpg',
        videos: 'tree.mp4, grre.mkv, ger.avi',
      })
      .end((err, res) => {
        expect(res).to.have.status(415);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('unsupported media type');
        done(err);
      });
  });

  it('should return an error if media exceeds the maximum number', (done) => {
    chai
      .request(app)
      .post('/api/v1/interventions')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        latitude: '33.445',
        longitude: '44.556',
        comment: 'Police corruption',
        images: 'red.jpeg, blue.png, green.jpg',
        videos: 'tree.mp4, grre.mkv, ger.avi, view.mp4',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('maximum of 3 media is allowed');
        done(err);
      });
  });
});

describe('/GET incidents route', () => {
  it('should return an error if incident type is wrong', (done) => {
    chai
      .request(app)
      .get('/api/v1/intervit')
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('The requested url was not found on this server');
        done(err);
      });
  });

  it('should return an error if user is not authenticated', (done) => {
    chai
      .request(app)
      .get('/api/v1/interventions')
      .set('authorization', '')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('You are not logged in');
        done(err);
      });
  });

  it('should return an error if token cannot be authenticated', (done) => {
    chai
      .request(app)
      .get('/api/v1/interventions')
      .set('authorization', 'urgjrigriirkjwUHJFRFFJrgfr')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('Authentication failed');
        done(err);
      });
  });

  it('should return an error if id is badly formatted', (done) => {
    chai
      .request(app)
      .get('/api/v1/interventions/4t')
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('The given id is invalid');
        done(err);
      });
  });

  it('should return an error if incident record does not exist', (done) => {
    chai
      .request(app)
      .get('/api/v1/interventions/4')
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('The intervention record with the given id does not exist');
        done(err);
      });
  });

  it('should retrieve the list of all red-flags created by the user', (done) => {
    chai
      .request(app)
      .get('/api/v1/red-flags/')
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0]).to.have.property('type')
          .eql('red-flag');
        expect(res.body.data[0]).to.have.property('comment');
        done(err);
      });
  });

  it('should retrieve a specific red-flags created by the user', (done) => {
    chai
      .request(app)
      .get('/api/v1/red-flags/1')
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0]).to.have.property('status');
        expect(res.body.data[0]).to.have.property('location');
        done(err);
      });
  });
});

describe('/PATCH incidents routes', () => {
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'victoria1@gmail.com',
        password: 'vvvvvv',
      })
      .end((err, res) => {
        adminToken = res.body.data[0].token;
        done(err);
      });
  });

  it('should return an error if user is not authenticated', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/1/comment')
      .set('authorization', '')
      .send({
        comment: 'Armed robbery',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('You are not logged in');
        done(err);
      });
  });

  it('should return an error if token cannot be authenticated', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/1/comment')
      .set('authorization', 'urgjrigriirkjwUHJFRFFJrgfr')
      .send({
        comment: 'Armed robbery',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('Authentication failed');
        done(err);
      });
  });

  it('should return an error if id is badly formatted', (done) => {
    chai
      .request(app)
      .patch('/api/v1/interventions/4t/location')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        latitude: '33.445',
        longitude: '44.556',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('The given id is invalid');
        done(err);
      });
  });

  it('should return an error if incident record does not exist', (done) => {
    chai
      .request(app)
      .patch('/api/v1/interventions/4/location')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        latitude: '33.445',
        longitude: '44.556',
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('The intervention record with the given id does not exist');
        done(err);
      });
  });

  it('should return an error if latitude field is missing', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/1/location')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        latitude: '',
        longitude: '44.556',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('latitude is required');
        done(err);
      });
  });

  it('should return an error if latitude is badly formatted', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/1/location')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        latitude: '110.334',
        longitude: '44.556',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('invalid latitude format');
        done(err);
      });
  });

  it('should return an error if longitude field is missing', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/1/location')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        latitude: '33.445',
        longitude: '',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('longitude is required');
        done(err);
      });
  });

  it('should return an error if longitude is badly formatted', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/1/location')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        latitude: '10.334',
        longitude: '244.556',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('invalid longitude format');
        done(err);
      });
  });

  it('should update the location if details are valid', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/1/location')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        latitude: '22.334',
        longitude: '170.556',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data[0]).to.have.property('message')
          .eql('Updated red-flag record\'s location');
        done(err);
      });
  });

  it('should return an error if comment field is empty', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/1/comment')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        comment: '',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('Comment is required');
        done(err);
      });
  });

  it('should return an error if comment is too short', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/1/comment')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        comment: 'police',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('Comment is too short, must have at least 10 characters');
        done(err);
      });
  });

  it('should update the comment if details are valid', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/1/comment')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        comment: 'Innocent woman molested',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data[0]).to.have.property('message')
          .eql('Updated red-flag record\'s comment');
        done(err);
      });
  });

  it('should return an error if non-admin tries to access the status route', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/1/status')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        status: 'under investigation',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('You are not authorized to perform this action');
        done(err);
      });
  });

  it('should return an error if status field is empty', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/1/status')
      .set('authorization', `Bearer ${adminToken}`)
      .send({
        status: '',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('status is required');
        done(err);
      });
  });

  it('should return an error if status is invalid', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/1/status')
      .set('authorization', `Bearer ${adminToken}`)
      .send({
        status: 'under rejection',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('invalid status format');
        done(err);
      });
  });

  it('should update the record if details are valid', (done) => {
    chai
      .request(app)
      .patch('/api/v1/red-flags/1/status')
      .set('authorization', `Bearer ${adminToken}`)
      .send({
        status: 'under investigation',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data[0]).to.have.property('message')
          .eql('Updated red-flag record status');
        done(err);
      });
  });
});


describe('/DELETE incidents route', () => {
  it('should return an error if user is not authenticated', (done) => {
    chai
      .request(app)
      .delete('/api/v1/red-flags/1')
      .set('authorization', '')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('You are not logged in');
        done(err);
      });
  });

  it('should return an error if token cannot be authenticated', (done) => {
    chai
      .request(app)
      .delete('/api/v1/red-flags/1')
      .set('authorization', 'urgjrigriirkjwUHJFRFFJrgfr')
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('Authentication failed');
        done(err);
      });
  });

  it('should return an error if the id is invalid', (done) => {
    chai
      .request(app)
      .delete('/api/v1/red-flags/6t')
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('The given id is invalid');
        done(err);
      });
  });

  it('should return an error if the incident does not exist', (done) => {
    chai
      .request(app)
      .delete('/api/v1/red-flags/6')
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('The red-flag record with the given id does not exist');
        done(err);
      });
  });

  it('should delete a specific incident record', (done) => {
    chai
      .request(app)
      .delete('/api/v1/red-flags/1')
      .set('authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data[0]).to.have.property('message')
          .eql('red-flag record has been deleted');
        done(err);
      });
  });
});
