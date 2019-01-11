import incidents from '../models/incidentsModel';

/**
 * @description Validates incidents
 * @exports Validate
 * @class Validate
 */
class Validate {
  /**
   * @method validateId
   * @description Validates id of any endpoint where id is required
   * @static
   * @param {object} req - Request object
   * @param {object} res - Response Object
   * @returns {object}
   * @memberof Validate
   */
  static validateId(req, res, next) {
    const redFlagId = Number(req.params.id);

    if (Number.isNaN(redFlagId)) {
      return res.status(422).send({
        status: res.statusCode,
        error: 'Invalid Id, Please input a number',
      });
    }

    const redFlag = incidents
      .find(incident => incident.id === parseInt(req.params.id, 10));
    if (!redFlag) {
      return res.status(404).send({
        status: res.statusCode,
        error: 'Red-flag record not found',
      });
    }
    return next();
  }

  /**
   * @method validatePost
   * @description Validates post api endpoint
   * @static
   * @param {object} req - Request object
   * @param {object} res - Response Object
   * @returns {object}
   * @memberof Validate
   */
  static validatePost(req, res, next) {
    const {
      latitude,
      longitude,
      comment,
    } = req.body;

    if (!latitude) {
      return res.status(400).send({
        status: res.statusCode,
        error: 'Please add a latitude',
      });
    }

    if (!longitude) {
      return res.status(400).send({
        status: res.statusCode,
        error: 'Please add a longitude',
      });
    }

    if (!comment) {
      return res.status(400).send({
        status: res.statusCode,
        error: 'Please add a comment',
      });
    }

    return next();
  }

  /**
   * @method validateLocationUpdate
   * @description Validates coordinates of a location
   * @static
   * @param {object} req - Request object
   * @param {object} res - Response Object
   * @returns {object}
   * @memberof Validate
   */
  static validateLocationUpdate(req, res, next) {
    const {
      latitude,
      longitude,
    } = req.body;

    const latEx = /^[-+]?([1-8]?[0-9][.]([0-9]+)|90[.](0+))$/;
    const lonEX = /^[-+]?((1[0-7][0-9])|([1-9]?[0-9]))[.]([0-9]+)|(180)[.](0+)/;

    if (!latitude) {
      return res.status(400).send({
        status: res.statusCode,
        error: 'Please enter a latitude',
      });
    }

    if (!longitude) {
      return res.status(400).send({
        status: res.statusCode,
        error: 'Please enter a longitude',
      });
    }
    if (!latEx.test(latitude)) {
      return res.status(422).send({
        status: res.statusCode,
        error: 'Invalid latitude format',
      });
    }

    if (!lonEX.test(longitude)) {
      return res.status(422).send({
        status: res.statusCode,
        error: 'Invalid longitude format',
      });
    }

    return next();
  }

  /**
   * @method validateCommentUpdate
   * @description Validates comment, checks if comment field is empty
   * @static
   * @param {object} req - Request object
   * @param {object} res - Response Object
   * @returns {object}
   * @memberof Validate
   */
  static validateCommentUpdate(req, res, next) {
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).send({
        status: res.statusCode,
        error: 'Please add a new comment',
      });
    }

    return next();
  }
}

export default Validate;
