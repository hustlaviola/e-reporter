import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';

chai.use(chaiHttp);

const { expect } = chai;

describe('/POST Signup route', () => {
  it('should return an error if first name field is empty', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: '',
        lastname: 'Violin',
        othernames: 'Violet',
        email: 'viola10@gmail.com',
        password: 'viola10',
        phonenumber: '07022334455',
        username: 'viola10',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('firstname field cannot be empty');
        done(err);
      });
  });

  it('should return an error if first name field is badly formatted', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'Viola33',
        lastname: 'Violin',
        othernames: 'Violet',
        email: 'viola10@gmail.com',
        password: 'viola10',
        phonenumber: '07022334455',
        username: 'viola10',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('first name must be alphabets only between 3 and 30');
        done(err);
      });
  });

  it('should return an error if last name field is empty', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'Viola',
        lastname: '',
        othernames: 'Violet',
        email: 'viola10@gmail.com',
        password: 'viola10',
        phonenumber: '07022334455',
        username: 'viola10',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('lastname field cannot be empty');
        done(err);
      });
  });

  it('should return an error if last name field is badly formatted', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'Viola',
        lastname: 'Violin33',
        othernames: 'Violet',
        email: 'viola10@gmail.com',
        password: 'viola10',
        phonenumber: '07022334455',
        username: 'viola10',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('last name must be alphabets only between 3 and 30');
        done(err);
      });
  });

  it('should return an error if other name field is badly formatted', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'Viola',
        lastname: 'Violin',
        othernames: 'Violet345',
        email: 'viola10@gmail.com',
        password: 'viola10',
        phonenumber: '07022334455',
        username: 'viola10',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('other name must be alphabets only between 3 and 30');
        done(err);
      });
  });

  it('should return an error if email field is empty', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'Viola',
        lastname: 'Violin',
        othernames: 'Violet',
        email: '',
        password: 'viola10',
        phonenumber: '07022334455',
        username: 'viola10',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('email field cannot be empty');
        done(err);
      });
  });

  it('should return an error if email field is badly formatted', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'Viola',
        lastname: 'Violin',
        othernames: 'Violet',
        email: 'viola10gmail.com',
        password: 'viola10',
        phonenumber: '07022334455',
        username: 'viola10',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('Invalid email format');
        done(err);
      });
  });

  it('should return an error if password field is empty', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'Viola',
        lastname: 'Violin',
        othernames: 'Violet',
        email: 'viola10@gmail.com',
        password: '',
        phonenumber: '07022334455',
        username: 'viola10',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('password field cannot be empty');
        done(err);
      });
  });

  it('should return an error if password is less than 6 characters', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'Viola',
        lastname: 'Violin',
        othernames: 'Violet',
        email: 'viola10@gmail.com',
        password: 'vio56',
        phonenumber: '07022334455',
        username: 'viola10',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('password must be at least 6 characters');
        done(err);
      });
  });

  it('should return an error if phone number field is empty', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'Viola',
        lastname: 'Violin',
        othernames: 'Violet',
        email: 'viola10@gmail.com',
        password: 'viola10',
        phonenumber: '',
        username: 'viola10',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('phonenumber field cannot be empty');
        done(err);
      });
  });

  it('should return an error if phone number field is badly formatted', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'Viola',
        lastname: 'Violin',
        othernames: 'Violet',
        email: 'viola10@gmail.com',
        password: 'viola10',
        phonenumber: '07022rt4455',
        username: 'viola10',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('Invalid phone number format');
        done(err);
      });
  });

  it('should return an error if username field is empty', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'Viola',
        lastname: 'Violin',
        othernames: 'Violet',
        email: 'viola10@gmail.com',
        password: 'viola10',
        phonenumber: '07022334455',
        username: '',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('username field cannot be empty');
        done(err);
      });
  });

  it('should return an error if username field is badly formatted', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'Viola',
        lastname: 'Violin',
        othernames: 'Violet',
        email: 'viola10@gmail.com',
        password: 'viola10',
        phonenumber: '07022334455',
        username: 'o..la**10',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('username can only contain characters, digits and underscores between 3 and 30');
        done(err);
      });
  });

  it('should create a new user if details are valid', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'Viola',
        lastname: 'Violin',
        othernames: 'Violet',
        email: 'viola10@gmail.com',
        password: 'viola10',
        phonenumber: '07022334455',
        username: 'viola10',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0]).to.have.property('token');
        expect(res.body).to.have.property('message')
          .eql('User created successfully');
        done(err);
      });
  });

  it('should return an error if there is an existing email', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'Viola',
        lastname: 'Violin',
        othernames: 'Violet',
        email: 'viola10@gmail.com',
        password: 'viola10',
        phonenumber: '07122334455',
        username: 'viola11',
      })
      .end((err, res) => {
        expect(res).to.have.status(409);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('email already exists');
        done(err);
      });
  });

  it('should return an error if there is an existing phone number', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'Viola',
        lastname: 'Violin',
        othernames: 'Violet',
        email: 'viola11@gmail.com',
        password: 'viola10',
        phonenumber: '07022334455',
        username: 'viola11',
      })
      .end((err, res) => {
        expect(res).to.have.status(409);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('phone number already exists');
        done(err);
      });
  });

  it('should return an error if there is an existing username', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstname: 'Viola',
        lastname: 'Violin',
        othernames: 'Violet',
        email: 'viola11@gmail.com',
        password: 'viola10',
        phonenumber: '07122334455',
        username: 'viola10',
      })
      .end((err, res) => {
        expect(res).to.have.status(409);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('username already exists');
        done(err);
      });
  });
});

describe('/POST Login route', () => {
  it('should log user in if details are valid', (done) => {
    const loginDetails = {
      email: 'viola10@gmail.com',
      password: 'viola10',
    };
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(loginDetails)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.be.an('array');
        expect(res.body.data[0]).to.have.property('token');
        expect(res.body).to.have.property('message')
          .eql('Sign in successful');
        done(err);
      });
  });

  it('should return an error if email field is empty', (done) => {
    const loginDetails = {
      email: '',
      password: 'viola10',
    };
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(loginDetails)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('email field cannot be empty');
        done(err);
      });
  });

  it('should return an error if email is badly formatted', (done) => {
    const loginDetails = {
      email: 'viola10gmail.com',
      password: 'viola10',
    };
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(loginDetails)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('Invalid email format');
        done(err);
      });
  });

  it('should return an error if password field is empty', (done) => {
    const loginDetails = {
      email: 'viola10@gmail.com',
      password: '',
    };
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(loginDetails)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('password field cannot be empty');
        done(err);
      });
  });

  it('should return an error if password field is less than 6 characters', (done) => {
    const loginDetails = {
      email: 'viola10@gmail.com',
      password: 'viola',
    };
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(loginDetails)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('password must be at least 6 characters');
        done(err);
      });
  });

  it('should return an error if email does not exist', (done) => {
    const loginDetails = {
      email: 'viola54@gmail.com',
      password: 'viola54',
    };
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(loginDetails)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('User does not exist');
        done(err);
      });
  });

  it('should return an error if email does not match password', (done) => {
    const loginDetails = {
      email: 'viola10@gmail.com',
      password: 'viola12',
    };
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(loginDetails)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error')
          .eql('Invalid details! Email or password is incorrect');
        done(err);
      });
  });
});
