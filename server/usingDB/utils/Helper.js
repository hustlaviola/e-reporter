/* eslint-disable no-plusplus */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ErrorController from './ErrorController';

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

  static regEx() {
    return {
      id: /^[1-9](\d+)?$/,
      name: /^[a-zA-Z]{3,30}$/,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phonenumber: /^\+?[0-9]{11,14}$/,
      username: /^[\w]{3,30}$/,
      latitude: /^[-+]?([1-8]?[0-9][.]([0-9]+)|90[.](0+))$/,
      longitude: /^[-+]?((1[0-7][0-9])|([1-9]?[0-9]))[.]([0-9]+)$|(180)[.](0+)$/,
    };
  }

  static modifyMedia(media) {
    const modifiedMediaArray = [];
    const mediaArray = media.split(',');

    for (let i = 0; i < mediaArray.length; i++) {
      const data = mediaArray[i].trim();
      modifiedMediaArray.push(data);
    }
    return modifiedMediaArray;
  }

  static validateMedia(media, types, res, next) {
    if (media.length > 3) {
      return ErrorController.validationError(res, 400,
        'maximum of 3 media is allowed');
    }
    for (let i = 0; i < media.length; i++) {
      const type = media[i].split('.')[1];
      if (!types.includes(type)) {
        return ErrorController.validationError(res, 415,
          'unsupported media type');
      }
    }
    return next();
  }
}

export default Helper;
