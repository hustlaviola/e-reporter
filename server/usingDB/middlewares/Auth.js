import jwt from 'jsonwebtoken';

class Auth {
  static userAuth(req, res, next) {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).send({
        status: 401,
        error: 'You are not logged in',
      });
    }
    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      req.user = decoded;
      return next();
    } catch (err) {
      return res.status(403).send({
        status: 403,
        error: 'Authentication failed',
      });
    }
  }

  static adminAuth(req, res, next) {
    const { isAdmin } = req.user;
    if (isAdmin !== 'true') {
      return res.status(403).send({
        status: 403,
        error: 'You are not authorized to perform this action',
      });
    }
    return next();
  }
}

export default Auth;
