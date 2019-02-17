/* eslint-disable no-unused-vars */
import pool from '../model/database';
import Helper from '../utils/Helper';
import ErrorController from '../utils/ErrorController';

class UserValidator {
  static validateExistingUser(req, res, next) {
    const {
      email,
      username,
      phonenumber,
    } = req.body;

    const query = `SELECT email, username, phonenumber FROM users
      WHERE email = $1 OR username = $2 OR phonenumber = $3`;

    pool.query(query, [email, username, phonenumber], (err, data) => {
      if (err) {
        return ErrorController.databaseError(res);
      }
      const result = data.rows[0];
      if (result) {
        let conflict;
        if (result.email === email) {
          conflict = 'email';
        } else if (result.phonenumber === phonenumber) {
          conflict = 'phone number';
        } else if (result.username === username) {
          conflict = 'username';
        }

        return ErrorController.validationError(res, 409,
          `${conflict} already exist`);
      }
      return next();
    });
  }

  static validateSignUp(req, res, next) {
    const regEx = Helper.regEx();
    const {
      firstname,
      lastname,
      othernames,
      email,
      password,
      phonenumber,
      username,
    } = req.body;

    let error;

    if (!firstname) {
      error = 'firstname field cannot be empty';
    } else if (!regEx.name.test(firstname)) {
      error = 'first name must be alphabets only between 3 and 30';
    } else if (!lastname) {
      error = 'lastname field cannot be empty';
    } else if (!regEx.name.test(lastname)) {
      error = 'last name must be alphabets only between 3 and 30';
    } else if (!regEx.name.test(othernames)) {
      error = 'other name must be alphabets only between 3 and 30';
    } else if (!email) {
      error = 'email field cannot be empty';
    } else if (!regEx.email.test(email)) {
      error = 'Invalid email format';
    } else if (!password) {
      error = 'password field cannot be empty';
    } else if (password.length < 6) {
      error = 'password must be at least 6 characters';
    } else if (!phonenumber) {
      error = 'phonenumber field cannot be empty';
    } else if (!regEx.phonenumber.test(phonenumber)) {
      error = 'Invalid phone number format';
    } else if (!username) {
      error = 'username field cannot be empty';
    } else if (!username || !regEx.username.test(username)) {
      error = 'username can only contain characters, digits and underscores between 3 and 30';
    }

    if (error) {
      return ErrorController.validationError(res, 400, error);
    }
    return next();
  }

  static validateSignIn(req, res, next) {
    const regEx = Helper.regEx();
    const {
      email,
      password,
    } = req.body;

    let error;

    if (!email) {
      error = 'email field cannot be empty';
    } else if (!regEx.email.test(email)) {
      error = 'Invalid email format';
    } else if (!password) {
      error = 'password field cannot be empty';
    } else if (password.length < 6) {
      error = 'password must be at least 6 characters';
    }

    if (error) {
      return ErrorController.validationError(res, 400, error);
    }
    return next();
  }
}

export default UserValidator;
