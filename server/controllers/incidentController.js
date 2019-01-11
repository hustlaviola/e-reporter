import incidents from '../models/incidentsModel';

/**
 * @description A controller class which contains methods for all api endpoints
 * @exports IncidentController
 * @class IncidentController
 */
class IncidentController {
  /**
   * @method getAllRedFlags
   * @description Fetch all red-flag records
   * @static
   * @param {object} req - Request Object
   * @param {object} res - Response Object
   * @returns {object} json response
   * @memberof IncidentController
   */
  static getAllRedFlags(req, res) {
    const redFlags = [];

    incidents.forEach((incident) => {
      if (incident.type === 'red-flag') {
        redFlags.push(incident);
      }
    });

    return res.status(200).send({
      status: res.statusCode,
      data: redFlags,
    });
  }

  /**
   * @method getRedFlag
   * @description Fetch a specific red-flag record
   * @static
   * @param {object} req - Request Object
   * @param {object} res - Response Object
   * @returns {object} json response
   * @memberof IncidentController
   */
  static getRedFlag(req, res) {
    const redFlag = [];
    const redFlagIncident = incidents
      .find(incident => incident.id === parseInt(req.params.id, 10));

    redFlag.push(redFlagIncident);
    return res.status(200).send({
      status: res.statusCode,
      data: redFlag,
    });
  }

  /**
   * @method postRedFlag
   * @description Create a new red-flag record`
   * @static
   * @param {object} req - Request Object
   * @param {object} res - Response Object
   * @returns {object} json response
   * @memberof IncidentController
   */
  static postRedFlag(req, res) {
    const {
      createdBy, latitude, longitude, Images, Videos, comment,
    } = req.body;

    const id = incidents.length > 0
      ? incidents[incidents.length - 1].id + 1 : incidents.length + 1;
    const createdOn = new Date();
    const type = 'red-flag';
    const location = `${latitude}, ${longitude}`;
    const status = 'draft';

    const redFlag = {
      id,
      createdOn,
      createdBy,
      type,
      location,
      status,
      Images,
      Videos,
      comment,
    };
    const response = [
      {
        id: redFlag.id,
        message: 'Created red-flag record',
      },
    ];
    incidents.push(redFlag);
    return res.status(201).send({
      status: res.statusCode,
      data: response,
    });
  }

  /**
   * @method updateLocation
   * @description Edit location of a red-flag record
   * @static
   * @param {object} req - Request Object
   * @param {object} res - Response Object
   * @returns {object} json response
   * @memberof IncidentController
   */
  static updateLocation(req, res) {
    const redFlag = incidents
      .find(incident => incident.id === parseInt(req.params.id, 10));

    const { latitude, longitude } = req.body;

    redFlag.location = `${latitude}, ${longitude}`;

    const response = [{
      id: redFlag.id,
      message: 'Updated red-flag record\'s location',
    }];
    return res.status(200).send({
      status: res.statusCode,
      data: response,
    });
  }

  /**
   * @method updateComment
   * @description Edit comment of a red-flag record
   * @static
   * @param {object} req - Request Object
   * @param {object} res - Response Object
   * @returns {object} json response
   * @memberof IncidentController
   */
  static updateComment(req, res) {
    const redFlag = incidents
      .find(incident => incident.id === parseInt(req.params.id, 10));

    redFlag.comment = req.body.comment;
    const response = [{
      id: redFlag.id,
      message: 'Updated red-flag record\'s comment',
    }];
    return res.status(200).send({
      status: res.statusCode,
      data: response,
    });
  }
}

export default IncidentController;
