import { Router } from 'express';
import { getAllDisposalRecords, getOneDisposalRecord, createDisposalRecord, updateDisposalRecord, deleteDisposalRecord } from '../controllers/disposalController';

const router = Router();

function asyncHandler(fn: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.get('/', asyncHandler(getAllDisposalRecords));
router.post('/', asyncHandler(createDisposalRecord));
router.get('/:id', asyncHandler(getOneDisposalRecord));
router.put('/:id', asyncHandler(updateDisposalRecord));
router.delete('/:id', asyncHandler(deleteDisposalRecord));

export default router;
