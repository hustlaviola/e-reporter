import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class Helper {
  static generateToken(data) {
    const token = jwt.sign(data, process.env.SECRET, {
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
