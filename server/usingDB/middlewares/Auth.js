import jwt from 'jsonwebtoken';
import ErrorController from '../utils/ErrorController';

class Auth {
  static userAuth(req, res, next) {
    if (!req.headers.authorization) {
      return ErrorController.validationError(res, 401,
        'You are not logged in');
    }

    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.SECRET);

    if (!decoded) {
      return ErrorController.validationError(res, 401,
        'Authentication failed');
    }
    req.user = decoded;
    return next();
  }

  static adminAuth(req, res, next) {
    const {
      isAdmin,
    } = req.user;
    if (isAdmin !== 'true') {
      return ErrorController.validationError(res, 401,
        'You are not authorized to perform this action');
    }
    return next();
  }
}

export default Auth;
