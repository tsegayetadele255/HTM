import { Router } from 'express';
import { getAllUsers, createUser, deleteUser, updateUser } from '../controllers/userController';

const router = Router();

router.get('/', getAllUsers);
router.post('/', createUser);
function asyncHandler(fn: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.delete('/:id', asyncHandler(deleteUser));
router.put('/:id', asyncHandler(updateUser));

export default router;
