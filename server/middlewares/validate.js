import incidents from '../models/incidentsModel';

/**
 * @description Validates incidents
 * @exports Validate
 * @class Validate
 */
class Validate {
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
}

export default Validate;
