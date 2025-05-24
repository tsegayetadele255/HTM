import { Router } from 'express';
import { getAllTrainingRecords, getOneTrainingRecord, createTrainingRecord, updateTrainingRecord, deleteTrainingRecord } from '../controllers/trainingController';

const router = Router();

function asyncHandler(fn: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.get('/', asyncHandler(getAllTrainingRecords));
router.post('/', asyncHandler(createTrainingRecord));
router.get('/:id', asyncHandler(getOneTrainingRecord));
router.put('/:id', asyncHandler(updateTrainingRecord));
router.delete('/:id', asyncHandler(deleteTrainingRecord));

export default router;
