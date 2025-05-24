import { Router } from 'express';
import { getAllAuditLogs, getOneAuditLog, createAuditLog, updateAuditLog, deleteAuditLog } from '../controllers/auditLogController';

const router = Router();

function asyncHandler(fn: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.get('/', asyncHandler(getAllAuditLogs));
router.post('/', asyncHandler(createAuditLog));
router.get('/:id', asyncHandler(getOneAuditLog));
router.put('/:id', asyncHandler(updateAuditLog));
router.delete('/:id', asyncHandler(deleteAuditLog));

export default router;
