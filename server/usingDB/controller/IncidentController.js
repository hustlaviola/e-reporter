import pool from '../model/database';
import Helper from '../utils/Helper';
import ErrorController from '../utils/ErrorController';

class IncidentController {
  static createIncident(req, res) {
    const { id } = req.user;
    let {
      comment,
      latitude,
      longitude,
      images,
      videos,
    } = req.body;

    comment = comment.trim();
    latitude = latitude.trim();
    longitude = longitude.trim();

    if (images) {
      images = Helper.modifyMedia(images);
    }
    if (videos) {
      videos = Helper.modifyMedia(videos);
    }

    const {
      incidentType,
    } = req.params;
    const type = incidentType.substr(0, incidentType.length - 1);

    const location = `${latitude}, ${longitude}`;
    const values = [id, comment, location, type, images, videos];
    const query = `INSERT INTO incidents(createdby, comment, location,
      type, images, videos) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`;

    pool.query(query, values, (err, data) => {
      if (err) {
        return ErrorController.databaseError(res);
      }

      const incident = data.rows[0];
      return res.status(201).send({
        status: res.statusCode,
        data: [{
          id: incident.id,
          message: `Created ${type} record`,
        }],
      });
    });
  }

  static getIncidents(req, res) {
    const { id } = req.user;
    const {
      incidentType,
    } = req.params;
    const type = incidentType.substr(0, incidentType.length - 1);
    const query = 'SELECT * FROM incidents WHERE type = $1 AND createdby = $2';
    const value = [type, id];

    pool.query(query, value, (err, data) => {
      if (err) {
        return ErrorController.databaseError(res);
      }
      return res.status(200).send({
        status: res.statusCode,
        data: data.rows,
      });
    });
  }

  static getIncident(req, res) {
    const { incidentId } = req.params;
    const query = 'SELECT * FROM incidents WHERE id = $1';
    const value = [incidentId];

    pool.query(query, value, (err, data) => {
      if (err) {
        return ErrorController.databaseError(res);
      }
      return res.status(200).send({
        status: res.statusCode,
        data: [
          data.rows[0],
        ],
      });
    });
  }

  static updateIncident(req, res) {
    const { incidentId } = req.params;
    const { incidentType } = req.params;
    const type = incidentType.substr(0, incidentType.length - 1);

    let {
      latitude, longitude, comment, status,
    } = req.body;

    if (status) {
      status = status.trim().toLowerCase();

      const query = `UPDATE incidents SET status = $1
        WHERE id = $2 RETURNING id`;
      const values = [status, incidentId];

      pool.query(query, values, (err) => {
        if (err) {
          return ErrorController.databaseError(res);
        }
        return res.status(200).send({
          status: res.statusCode,
          data: [{
            id: incidentId,
            message: `Updated ${type} record status`,
          }],
        });
      });
    }

    if (comment) {
      comment = comment.trim();

      const query = `UPDATE incidents SET comment = $1
       WHERE id = $2 RETURNING id`;
      const values = [comment, incidentId];

      pool.query(query, values, (err) => {
        if (err) {
          return ErrorController.databaseError(res);
        }
        return res.status(200).send({
          status: res.statusCode,
          data: [{
            id: incidentId,
            message: `Updated ${type} record's comment`,
          }],
        });
      });
    }

    if (latitude && longitude) {
      latitude = latitude.trim();
      longitude = longitude.trim();
      const location = `${latitude}, ${longitude}`;

      const query = `UPDATE incidents SET location = $1
       WHERE id = $2 RETURNING id`;
      const values = [location, incidentId];

      pool.query(query, values, (err) => {
        if (err) {
          return ErrorController.databaseError(res);
        }
        return res.status(200).send({
          status: res.statusCode,
          data: [{
            id: incidentId,
            message: `Updated ${type} record's location`,
          }],
        });
      });
    }
  }

  static deleteIncident(req, res) {
    const { incidentId } = req.params;
    const { incidentType } = req.params;
    const type = incidentType.substr(0, incidentType.length - 1);
    const query = 'DELETE FROM incidents WHERE id = $1';
    const value = [incidentId];

    pool.query(query, value, (err) => {
      if (err) {
        return ErrorController.databaseError(res);
      }
      return res.status(200).send({
        status: res.statusCode,
        data: [{
          id: incidentId,
          message: `${type} record has been deleted`,
        }],
      });
    });
  }
}

export default IncidentController;
