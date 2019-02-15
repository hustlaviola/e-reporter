import express from 'express';
import IncidentController from '../controller/IncidentController';
import UserController from '../controller/UsersController';
import Auth from '../middlewares/Auth';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).send('Welcome to iReporter API v1');
});

router.post('/auth/signup',
  UserController.signUp);

router.post('/auth/login',
  UserController.signIn);

router.post('/:incidentType',
  Auth.userAuth,
  IncidentController.createIncident);

router.get('/:incidentType',
  Auth.userAuth,
  IncidentController.getIncidents);

router.get('/:incidentType/:incidentId',
  Auth.userAuth,
  IncidentController.getIncident);

router.patch('/:incidentType/:incidentId/location',
  Auth.userAuth,
  IncidentController.updateIncident);

router.patch('/:incidentType/:incidentId/comment',
  Auth.userAuth,
  IncidentController.updateIncident);

router.patch('/:incidentType/:incidentId/status',
  Auth.userAuth,
  Auth.adminAuth,
  IncidentController.updateIncident);

router.delete('/:incidentType/:incidentId',
  Auth.userAuth,
  IncidentController.deleteIncident);

export default router;
