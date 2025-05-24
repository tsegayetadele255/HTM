import { Router } from 'express';
import { getAllIncidents, getOneIncident, createIncident, updateIncident, deleteIncident } from '../controllers/incidentController';

const router = Router();

function asyncHandler(fn: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.get('/', asyncHandler(getAllIncidents));
router.post('/', asyncHandler(createIncident));
router.get('/:id', asyncHandler(getOneIncident));
router.put('/:id', asyncHandler(updateIncident));
router.delete('/:id', asyncHandler(deleteIncident));

export default router;
