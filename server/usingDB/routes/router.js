import express from 'express';
import IncidentController from '../controller/IncidentController';
import UserController from '../controller/UserController';
import Auth from '../middlewares/Auth';
import IncidentValidator from '../middlewares/IncidentValidator';
import UserValidator from '../middlewares/UserValidator';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).send('Welcome to iReporter API v1');
});

router.post('/auth/signup',
  UserValidator.validateSignUp,
  UserValidator.validateExistingUser,
  UserController.signUp);

router.post('/auth/login',
  UserValidator.validateSignIn,
  UserController.signIn);

router.post('/:incidentType',
  IncidentValidator.validateType,
  Auth.userAuth,
  IncidentValidator.validateComment,
  IncidentValidator.validateCoordinates,
  IncidentValidator.validateImage,
  IncidentValidator.validateVideo,
  IncidentController.createIncident);

router.get('/:incidentType',
  IncidentValidator.validateType,
  Auth.userAuth,
  IncidentController.getIncidents);

router.get('/:incidentType/:incidentId',
  IncidentValidator.validateType,
  Auth.userAuth,
  IncidentValidator.validateId,
  IncidentController.getIncident);

router.patch('/:incidentType/:incidentId/location',
  IncidentValidator.validateType,
  Auth.userAuth,
  IncidentValidator.validateId,
  IncidentValidator.validateCoordinates,
  IncidentController.updateIncident);

router.patch('/:incidentType/:incidentId/comment',
  IncidentValidator.validateType,
  Auth.userAuth,
  IncidentValidator.validateId,
  IncidentValidator.validateComment,
  IncidentController.updateIncident);

router.patch('/:incidentType/:incidentId/status',
  IncidentValidator.validateType,
  Auth.userAuth,
  Auth.adminAuth,
  IncidentValidator.validateId,
  IncidentValidator.validateStatus,
  IncidentController.updateIncident);

router.delete('/:incidentType/:incidentId',
  IncidentValidator.validateType,
  Auth.userAuth,
  IncidentValidator.validateId,
  IncidentController.deleteIncident);

export default router;
