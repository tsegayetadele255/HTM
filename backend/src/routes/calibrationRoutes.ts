import { Router } from 'express';
import { getAllCalibrationRecords, getOneCalibrationRecord, createCalibrationRecord, updateCalibrationRecord, deleteCalibrationRecord } from '../controllers/calibrationController';

const router = Router();

function asyncHandler(fn: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.get('/', asyncHandler(getAllCalibrationRecords));
router.post('/', asyncHandler(createCalibrationRecord));
router.get('/:id', asyncHandler(getOneCalibrationRecord));
router.put('/:id', asyncHandler(updateCalibrationRecord));
router.delete('/:id', asyncHandler(deleteCalibrationRecord));

export default router;
