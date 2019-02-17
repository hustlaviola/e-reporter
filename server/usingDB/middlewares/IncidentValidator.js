/* eslint-disable no-plusplus */
import pool from '../model/database';
import Helper from '../utils/Helper';
import ErrorController from '../utils/ErrorController';

class IncidentValidator {
  static validateType(req, res, next) {
    const types = ['red-flags', 'interventions'];

    if (!types.includes(req.params.incidentType)) {
      return ErrorController.routeError(res);
    }
    return next();
  }

  static validateId(req, res, next) {
    const regEx = Helper.regEx();
    const { id } = req.user;
    const { incidentId } = req.params;
    const { incidentType } = req.params;
    const type = incidentType.substr(0, incidentType.length - 1);
    const status = req.url.split('/')[3];
    console.log(req.user);

    if (!regEx.id.test(incidentId) || (incidentId === '0')) {
      return ErrorController.validationError(res, 400, 'The given id is invalid');
    }

    if (status === 'status') {
      const query = 'SELECT * FROM incidents WHERE id = $1 AND type = $2';
      return pool.query(query, [incidentId, type], (err, data) => {
        if (err) {
          return ErrorController.databaseError(res);
        }
        if (data.rowCount < 1) {
          return ErrorController.validationError(res, 404,
            `The ${type} record with the given id does not exist`);
        }
        return next();
      });
    }

    const query = 'SELECT * FROM incidents WHERE id = $1 AND type = $2 AND createdby = $3';
    const value = [incidentId, type, id];
    return pool.query(query, value, (err, data) => {
      if (err) {
        return ErrorController.databaseError(res);
      }
      if (data.rowCount < 1) {
        return ErrorController.validationError(res, 404,
          `The ${type} record with the given id does not exist`);
      }
      return next();
    });
  }

  static validateComment(req, res, next) {
    const { comment } = req.body;

    if (!(comment && comment.trim())) {
      return ErrorController.validationError(res, 400, 'Comment is required');
    }

    if (comment.trim().length < 10) {
      return ErrorController.validationError(res, 400,
        'Comment is too short, must have at least 10 characters');
    }
    return next();
  }

  static validateStatus(req, res, next) {
    let { status } = req.body;
    const statuses = ['under investigation', 'resolved', 'rejected'];

    if (!(status && status.trim())) {
      return ErrorController.validationError(res, 400,
        'status is required');
    }
    status = status.trim().toLowerCase();

    if (!statuses.includes(status)) {
      return ErrorController.validationError(res, 400,
        'invalid status format');
    }
    return next();
  }

  static validateCoordinates(req, res, next) {
    const regEx = Helper.regEx();
    let { latitude, longitude } = req.body;

    if (!(latitude && latitude.trim())) {
      return ErrorController.validationError(res, 400,
        'latitude is required');
    }

    latitude = latitude.trim();

    if (!regEx.latitude.test(latitude)) {
      return ErrorController.validationError(res, 400,
        'invalid latitude format');
    }

    if (!(longitude && longitude.trim())) {
      return ErrorController.validationError(res, 400,
        'longitude is required');
    }

    longitude = longitude.trim();

    if (!regEx.longitude.test(longitude)) {
      return ErrorController.validationError(res, 400,
        'invalid longitude format');
    }
    return next();
  }

  static validateImage(req, res, next) {
    let { images } = req.body;
    images = Helper.modifyMedia(images);
    const imageTypes = ['png', 'jpg', 'jpeg'];
    if (images) {
      return Helper.validateMedia(images, imageTypes, res, next);
    }
    return next();
  }

  static validateVideo(req, res, next) {
    let { videos } = req.body;
    videos = Helper.modifyMedia(videos);
    const videoTypes = ['mp4', 'avi', 'mkv'];
    if (videos) {
      return Helper.validateMedia(videos, videoTypes, res, next);
    }
    return next();
  }
}

export default IncidentValidator;
