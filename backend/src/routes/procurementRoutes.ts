import { Router } from 'express';
import { getAllProcurementRecords, getOneProcurementRecord, createProcurementRecord, updateProcurementRecord, deleteProcurementRecord } from '../controllers/procurementController';

const router = Router();

function asyncHandler(fn: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.get('/', asyncHandler(getAllProcurementRecords));
router.post('/', asyncHandler(createProcurementRecord));
router.get('/:id', asyncHandler(getOneProcurementRecord));
router.put('/:id', asyncHandler(updateProcurementRecord));
router.delete('/:id', asyncHandler(deleteProcurementRecord));

export default router;
