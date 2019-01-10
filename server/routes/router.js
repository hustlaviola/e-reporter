import express from 'express';
import IncidentController from '../controllers/incidentController';

const router = express.Router();

router.get('/red-flags', IncidentController.getAllRedFlags);

export default router;
