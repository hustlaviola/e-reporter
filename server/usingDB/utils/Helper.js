import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class Helper {
  static generateToken(payload) {
    const token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: '7d',
    });
    return token;
  }

  static hashPassword(password) {
    return bcrypt.hashSync(password, 10);
  }

  static verifyPassword(password, hashed) {
    return bcrypt.compareSync(password, hashed);
  }
}

export default Helper;
