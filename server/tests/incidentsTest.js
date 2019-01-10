import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);

const { expect } = chai;

/** Test the GET route */

describe('/GET red-flag', () => {
  it('it should GET all the red-flag', (done) => {
    chai.request(app)
      .get('/api/v1/red-flags')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0]).to.have.property('type').eql('red-flag');
        done(err);
      });
  });
});

/** Test the /GET/:id route */

describe('/GET/:id red-flag', () => {
  it('it should return an error if there is no red flag record', (done) => {
    const redFlag = {
      id: 11,
    };
    chai.request(app)
      .get(`/api/v1/red-flags/${redFlag.id}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('Red-flag record not found');
        done(err);
      });
  });

  it('it should GET a red-flag of the given id', (done) => {
    const redFlag = {
      id: 1,
    };
    chai.request(app)
      .get(`/api/v1/red-flags/${redFlag.id}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.be.an('array');
        expect(res.body).to.have.property('data');
        done(err);
      });
  });
});

/** Test the /POST route */

describe('/POST red-flag', () => {
  it('it should not POST a red-flag without LATITUDE', (done) => {
    const redFlag = {
      longitude: '126.789',
      comment: 'New red-flag',
    };
    chai.request(app)
      .post('/api/v1/red-flags')
      .send(redFlag)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('Please enter a latitude');
        done(err);
      });
  });

  it('it should not POST a red-flag without LONGITUDE', (done) => {
    const redFlag = {
      latitude: '66.789',
      comment: 'New red-flag',
    };
    chai.request(app)
      .post('/api/v1/red-flags')
      .send(redFlag)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('Please enter a longitude');
        done(err);
      });
  });

  it('it should not POST a red-flag with wrongly formatted LATITUDE',
    (done) => {
      const redFlag = {
        latitude: '66er',
        longitude: '44.567',
        comment: 'New red-flag',
      };
      chai.request(app)
        .post('/api/v1/red-flags')
        .send(redFlag)
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('error')
            .eql('Invalid latitude format');
          done(err);
        });
    });

  it('it should not POST a red-flag with wrongly formatted LONGITUDE',
    (done) => {
      const redFlag = {
        latitude: '66.234',
        longitude: '4er',
        comment: 'New red-flag',
      };
      chai.request(app)
        .post('/api/v1/red-flags')
        .send(redFlag)
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('error')
            .eql('Invalid longitude format');
          done(err);
        });
    });

  it('it should not POST a red-flag without COMMENT', (done) => {
    const redFlag = {
      latitude: '66.234',
      longitude: '44.55',
    };
    chai.request(app)
      .post('/api/v1/red-flags')
      .send(redFlag)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').eql('Please add a comment');
        done(err);
      });
  });

  it('it should POST a red-flag incident', (done) => {
    const incident = {
      latitude: '66.234',
      longitude: '34.77',
      comment: 'New red-flag',
    };
    chai.request(app)
      .post('/api/v1/red-flags')
      .send(incident)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0]).to.have.property('message')
          .eql('Created red-flag record');
        done(err);
      });
  });
});

/** Test the /PATCH location route */

describe('/PATCH/:id/location red-flag', () => {
  it('it should return an error if the red-flag record doesn\'t exist',
    (done) => {
      const redFlag = {
        id: 11,
        latitude: '66.234',
        longitude: '45.677',
        comment: 'New red-flag',
      };
      chai.request(app)
        .patch(`/api/v1/red-flags/${redFlag.id}/location`)
        .send(redFlag)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('error')
            .eql('Red-flag record not found');
          done(err);
        });
    });

  it('it should return an error if latitude field is empty', (done) => {
    const redFlag = {
      id: 1,
      latitude: '',
      longitude: '45.677',
      comment: 'New red-flag',
    };
    chai.request(app)
      .patch(`/api/v1/red-flags/${redFlag.id}/location`)
      .send(redFlag)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('Please enter a latitude');
        done(err);
      });
  });

  it('it should return an error if longitude field is empty', (done) => {
    const redFlag = {
      id: 1,
      latitude: '45.677',
      longitude: '',
      comment: 'New red-flag',
    };
    chai.request(app)
      .patch(`/api/v1/red-flags/${redFlag.id}/location`)
      .send(redFlag)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('Please enter a longitude');
        done(err);
      });
  });

  it('it should UPDATE the location of the red-flag of the given id',
    (done) => {
      const redFlag = {
        id: 1,
        longitude: '-150.677',
        latitude: '45.677',
        comment: 'New red-flag',
      };
      chai.request(app)
        .patch(`/api/v1/red-flags/${redFlag.id}/location`)
        .send(redFlag)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.data).to.be.an('array');
          expect(res.body.data[0]).to.have.property('message')
            .eql('Updated red-flag record\'s location');
          done(err);
        });
    });
});

/** Test the /PATCH comment route */

describe('/PATCH/:id/comment red-flag', () => {
  it('it should return an error if the red-flag record doesn\'t exist',
    (done) => {
      const redFlag = {
        id: 11,
        comment: '44.000, 33.000',
      };
      chai.request(app)
        .patch(`/api/v1/red-flags/${redFlag.id}/comment`)
        .send(redFlag)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('error')
            .eql('Red-flag record not found');
          done(err);
        });
    });

  it('it should return an error if comment field is empty', (done) => {
    const redFlag = {
      id: 1,
      comment: '',
    };
    chai.request(app)
      .patch(`/api/v1/red-flags/${redFlag.id}/comment`)
      .send(redFlag)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('Please add a new comment');
        done(err);
      });
  });

  it('it should UPDATE the comment of the red-flag of the given id',
    (done) => {
      const redFlag = {
        id: 1,
        comment: '44.000, 33.000',
      };
      chai.request(app)
        .patch(`/api/v1/red-flags/${redFlag.id}/comment`)
        .send(redFlag)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.data).to.be.an('array');
          expect(res.body.data[0]).to.have.property('message')
            .eql('Updated red-flag record\'s comment');
          done(err);
        });
    });
});

/* Test the /DELETE/:id route */

describe('/DELETE/:id  red-flag', () => {
  it('it should return an error if red-flag record doesn\'t exist',
    (done) => {
      const redFlag = {
        id: 11,
      };
      chai.request(app)
        .delete(`/api/v1/red-flags/${redFlag.id}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('error')
            .eql('Red-flag record not found');
          done(err);
        });
    });

  it('it should DELETE the red-flag of the given id',
    (done) => {
      const redFlag = {
        id: 1,
      };
      chai.request(app)
        .delete(`/api/v1/red-flags/${redFlag.id}`)
        .end((err, res) => {
          expect(res).to.have.status(202);
          expect(res.body).to.be.an('object');
          expect(res.body.data).to.be.an('array');
          expect(res.body.data[0]).to.have.property('message')
            .eql('red-flag record has been deleted');
          done(err);
        });
    });
});
