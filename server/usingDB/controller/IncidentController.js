import pool from '../model/database';

class IncidentController {
  static createIncident(req, res) {
    const { id } = req.user;
    const {
      comment,
      latitude,
      longitude,
      images,
      videos,
    } = req.body;
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
        return res.status(500).send({
          status: 500,
          error: 'Database error.',
        });
      }

      const incident = data.rows[0];
      return res.status(201).send({
        status: 201,
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
        return res.status(500).send({
          status: 500,
          error: 'Database error.',
        });
      }
      return res.status(200).send({
        status: 200,
        data: data.rows,
      });
    });
  }

  static getIncident(req, res) {
    const { id } = req.user;
    const { incidentId } = req.params;
    const { incidentType } = req.params;
    const type = incidentType.substr(0, incidentType.length - 1);

    const query = `SELECT * FROM incidents WHERE type = $1
      AND id = $2 AND createdby = $3`;
    const values = [type, incidentId, id];
    pool.query(query, values, (err, data) => {
      if (err) {
        return res.status(500).send({
          status: 500,
          error: 'Database error.',
        });
      }
      return res.status(200).send({
        status: 200,
        data: data.rows[0],
      });
    });
  }

  static updateIncident(req, res) {
    const { id } = req.user;
    const { incidentId } = req.params;
    const { incidentType } = req.params;
    const type = incidentType.substr(0, incidentType.length - 1);

    const {
      latitude, longitude, comment, status,
    } = req.body;
    const location = `${latitude}, ${longitude}`;

    if (status) {
      const query = `UPDATE incidents SET status = $1
        WHERE id = $2 RETURNING id`;
      const values = [status, incidentId];

      pool.query(query, values, (err) => {
        if (err) {
          return res.status(500).send({
            status: 500,
            error: 'Database error.',
          });
        }
        return res.status(200).json({
          status: 200,
          data: [{
            id: incidentId,
            message: `Updated ${type} record status`,
          }],
        });
      });
    }

    if (comment) {
      const query = `UPDATE incidents SET comment = $1
       WHERE id = $2 AND createdby = $3 RETURNING id`;
      const values = [comment, incidentId, id];

      pool.query(query, values, (err) => {
        if (err) {
          return res.status(500).send({
            status: 500,
            error: 'Database error.',
          });
        }
        return res.status(200).send({
          status: 200,
          data: [{
            id: incidentId,
            message: `Updated ${type} record's comment`,
          }],
        });
      });
    }

    if (latitude && longitude) {
      const query = `UPDATE incidents SET location = $1
       WHERE id = $2 AND createdby = $3 RETURNING id`;
      const values = [location, incidentId, id];

      pool.query(query, values, (err) => {
        if (err) {
          return res.status(500).send({
            status: 500,
            error: 'Database error.',
          });
        }
        return res.status(200).send({
          status: 200,
          data: [{
            id: incidentId,
            message: `Updated ${type} record's location`,
          }],
        });
      });
    }
  }

  static deleteIncident(req, res) {
    const { id } = req.user;
    const { incidentId } = req.params;
    const { incidentType } = req.params;
    const type = incidentType.substr(0, incidentType.length - 1);
    const query = 'DELETE FROM incidents WHERE id = $1 AND createdby = $2';
    const values = [incidentId, id];

    pool.query(query, values, (err) => {
      if (err) {
        return res.status(500).send({
          status: 500,
          error: 'Database error.',
        });
      }
      return res.status(200).send({
        status: 200,
        data: [{
          id: incidentId,
          message: `${type} record has been deleted`,
        }],
      });
    });
  }
}

export default IncidentController;
