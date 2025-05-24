import { Request, Response } from 'express';
import { SOP } from '../models/SOP';
import { User } from '../models/User';
import { AppDataSource } from '../utils/data-source';

export const getAllSOPs = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(SOP);
  const items = await repo.find({ relations: ['createdBy'] });
  res.json(items);
};

export const getOneSOP = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(SOP);
  const { id } = req.params;
  const item = await repo.findOne({ where: { id: Number(id) }, relations: ['createdBy'] });
  if (!item) return res.status(404).json({ error: 'SOP not found' });
  res.json(item);
};

export const createSOP = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(SOP);
  const userRepo = AppDataSource.getRepository(User);
  const { title, content, documentUrl, createdById } = req.body;

  const createdBy = await userRepo.findOneBy({ id: createdById });
  if (!createdBy) return res.status(400).json({ error: 'Creator not found' });

  const sop = repo.create({ title, content, documentUrl, createdBy });
  await repo.save(sop);
  res.status(201).json(sop);
};

export const updateSOP = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(SOP);
  const userRepo = AppDataSource.getRepository('User');
  const { id } = req.params;
  let sop = await repo.findOne({ where: { id: Number(id) }, relations: ['createdBy'] });
  if (!sop) return res.status(404).json({ error: 'SOP not found' });

  const { createdById, ...fields } = req.body;
  if (createdById !== undefined) {
    const createdBy = await userRepo.findOneBy({ id: createdById });
    if (!createdBy) return res.status(400).json({ error: 'Creator not found' });
    (sop as any).createdBy = createdBy;
  }
  repo.merge(sop, fields);
  await repo.save(sop);
  res.json(sop);
};

export const deleteSOP = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(SOP);
  const { id } = req.params;
  const sop = await repo.findOneBy({ id: Number(id) });
  if (!sop) return res.status(404).json({ error: 'SOP not found' });
  await repo.remove(sop);
  res.json({ message: 'SOP deleted successfully' });
};
