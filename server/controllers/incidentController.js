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
}

export default IncidentController;
