import express from 'express';
import IncidentController from '../controller/IncidentController';
import UserController from '../controller/UsersController';

const router = express.Router();

router.post('/auth/signup', UserController.signUp);
router.post('/auth/login', UserController.signIn);
router.post('/:incidentType', IncidentController.createIncident);
router.get('/:incidentType', IncidentController.getIncidents);
router.get('/:incidentType/:incidentId', IncidentController.getIncident);
router.patch('/:incidentType/:incidentId/location',
  IncidentController.updateIncident);
router.patch('/:incidentType/:incidentId/comment',
  IncidentController.updateIncident);
router.delete('/:incidentType/:incidentId', IncidentController.deleteIncident);


export default router;
