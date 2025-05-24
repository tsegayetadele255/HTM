import { Request, Response } from 'express';
import { User } from '../models/User';
import { AppDataSource } from '../utils/data-source';

export const getAllUsers = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(User);
  const items = await repo.find({
    relations: ['assignedWorkOrders', 'reportedWorkOrders'],
  });
  res.json(items);
};

export const createUser = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(User);
  try {
    const {
      username,
      password,
      role,
      fullName,
      email,
      phone,
      department,
      isActive
    } = req.body;
    const newUser = repo.create({
      username,
      password,
      role,
      fullName,
      email,
      phone,
      department,
      isActive
    });
    await repo.save(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user', details: error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(User);
  try {
    const { id } = req.params;
    const user = await repo.findOneBy({ id: Number(id) });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await repo.remove(user);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user', details: error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(User);
  try {
    const { id } = req.params;
    let user = await repo.findOneBy({ id: Number(id) });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const {
      username,
      password,
      role,
      fullName,
      email,
      phone,
      department,
      isActive
    } = req.body;
    // Only update password if provided
    if (password) {
      user.password = password;
    }
    user.username = username !== undefined ? username : user.username;
    user.role = role !== undefined ? role : user.role;
    user.fullName = fullName !== undefined ? fullName : user.fullName;
    user.email = email !== undefined ? email : user.email;
    user.phone = phone !== undefined ? phone : user.phone;
    user.department = department !== undefined ? department : user.department;
    user.isActive = isActive !== undefined ? isActive : user.isActive;
    await repo.save(user);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user', details: error });
  }
};
