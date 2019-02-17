import Helper from '../utils/Helper';
import pool from '../model/database';
import ErrorController from '../utils/ErrorController';

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

    const hashedPassword = Helper.hashPassword(password);

    const query = `INSERT INTO users(firstname, lastname, othernames, email,
      phonenumber, password, username)
      VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    const values = [firstname, lastname, othernames, email,
      phonenumber, hashedPassword, username];

    pool.query(query, values, (err, data) => {
      if (err) {
        return ErrorController.databaseError(res);
      }
      const user = data.rows[0];
      const result = {
        id: user.id,
        email: user.email,
        username: user.username,
      };

      const token = Helper.generateToken(result);
      return res.status(201).send({
        status: res.statusCode,
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
        return ErrorController.databaseError(res);
      }
      const user = data.rows[0];
      if (!user) {
        return ErrorController.validationError(res, 422,
          'User does not exists');
      }

      if (!Helper.verifyPassword(password, user.password)) {
        return ErrorController.validationError(res, 422,
          'Invalid details. Email or password is incorrect');
      }

      const result = {
        id: user.id,
        email: user.email,
        isAdmin: user.isadmin,
      };
      const token = Helper.generateToken(result);
      return res.status(200).send({
        status: res.statusCode,
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
