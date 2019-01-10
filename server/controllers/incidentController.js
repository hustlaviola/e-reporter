import incidents from '../models/incidentsModel';

/** Incidents controller class */
class IncidentController {
  /**
   * @method getAllRedFlags
   * @description Fetch all red-flag rec
   * @param {object} req - Request Object
   * @param {object} res - Response Object
   * @returns {object} json response
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
}

export default IncidentController;
