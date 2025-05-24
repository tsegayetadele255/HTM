import { Request, Response } from 'express';
import { AuditLog } from '../models/AuditLog';
import { AppDataSource } from '../utils/data-source';

export const getAllAuditLogs = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(AuditLog);
  const items = await repo.find({ relations: ['user'] });
  res.json(items);
};

export const getOneAuditLog = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(AuditLog);
  const { id } = req.params;
  const item = await repo.findOne({ where: { id: Number(id) }, relations: ['user'] });
  if (!item) return res.status(404).json({ error: 'Audit log not found' });
  res.json(item);
};

export const createAuditLog = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(AuditLog);
  const userRepo = AppDataSource.getRepository('User');
  const { action, entityType, entityId, details, userId } = req.body;

  let user: any = undefined;
  if (userId !== undefined) {
    user = await userRepo.findOneBy({ id: userId });
    if (!user) return res.status(400).json({ error: 'User not found' });
  }

  const log = repo.create({ action, entityType, entityId, details, user });
  await repo.save(log);
  res.status(201).json(log);
};

export const updateAuditLog = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(AuditLog);
  const userRepo = AppDataSource.getRepository('User');
  const { id } = req.params;
  let log = await repo.findOne({ where: { id: Number(id) }, relations: ['user'] });
  if (!log) return res.status(404).json({ error: 'Audit log not found' });

  const { action, entityType, entityId, details, userId } = req.body;
  let user = log.user;
  if (userId !== undefined) {
    user = await userRepo.findOneBy({ id: userId });
    if (!user) return res.status(400).json({ error: 'User not found' });
  }
  repo.merge(log, { action, entityType, entityId, details, user });
  await repo.save(log);
  res.json(log);
};

export const deleteAuditLog = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(AuditLog);
  const { id } = req.params;
  const log = await repo.findOneBy({ id: Number(id) });
  if (!log) return res.status(404).json({ error: 'Audit log not found' });
  await repo.remove(log);
  res.json({ message: 'Audit log deleted successfully' });
};
