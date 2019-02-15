import Helper from '../utils/Helper';
import pool from '../model/database';

class UserController {
  static signUp(req, res) {
    const {
      firstname,
      lastname,
      othernames,
      email,
      phonenumber,
      password,
      username,
    } = req.body;

    const hashedPassword = Helper.hashPassword(password.trim());

    const query = `INSERT INTO users(firstname, lastname, othernames, email,
      phonenumber, password, username)
      VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    const values = [firstname, lastname, othernames, email,
      phonenumber, hashedPassword, username];

    pool.query(query, values, (err, data) => {
      if (err) {
        return res.status(500).send({
          status: 500,
          error: 'database error',
        });
      }
      const user = data.rows[0];
      const result = {
        id: user.id,
        email: user.email,
        username: user.username,
      };

      const token = Helper.generateToken(result);
      return res.status(201).send({
        status: 201,
        data: [{
          token,
          user,
        }],
        message: 'User created successfully',
      });
    });
  }

  static signIn(req, res) {
    const {
      email,
      password,
    } = req.body;

    const query = 'SELECT * FROM users WHERE email = $1';
    const value = [email];
    pool.query(query, value, (err, data) => {
      if (err) {
        return res.status(400).send({
          status: 400,
          error: 'Some inputs missing',
        });
      }
      const user = data.rows[0];
      if (!user) {
        return res.status(422).send({
          status: 422,
          error: 'User does not exists',
        });
      }

      if (!Helper.verifyPassword(password, user.password)) {
        return res.status(422).send({
          status: 422,
          error: 'Invalid details. Email or password is incorrect',
        });
      }

      const result = {
        id: user.id,
        email: user.email,
        isAdmin: user.isadmin,
      };
      const token = Helper.generateToken(result);
      return res.status(200).send({
        status: 200,
        data: [{
          token,
          user,
        }],
        message: 'Sign in successful',
      });
    });
  }
}

export default UserController;
