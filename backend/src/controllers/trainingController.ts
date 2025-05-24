import { Request, Response } from 'express';
import { TrainingRecord } from '../models/TrainingRecord';
import { AppDataSource } from '../utils/data-source';

export const getAllTrainingRecords = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(TrainingRecord);
  const items = await repo.find({ relations: ['trainee', 'trainer'] });
  res.json(items);
};

export const getOneTrainingRecord = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(TrainingRecord);
  const { id } = req.params;
  const item = await repo.findOne({ where: { id: Number(id) }, relations: ['trainee', 'trainer'] });
  if (!item) return res.status(404).json({ error: 'Training record not found' });
  res.json(item);
};

export const createTrainingRecord = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(TrainingRecord);
  const userRepo = AppDataSource.getRepository('User');
  const { topic, description, date, traineeId, trainerId, certificateUrl } = req.body;

  const trainee = await userRepo.findOneBy({ id: traineeId });
  if (!trainee) return res.status(400).json({ error: 'Trainee not found' });
  const trainer = await userRepo.findOneBy({ id: trainerId });
  if (!trainer) return res.status(400).json({ error: 'Trainer not found' });

  const record = repo.create({ topic, description, date, trainee, trainer, certificateUrl });
  await repo.save(record);
  res.status(201).json(record);
};

export const updateTrainingRecord = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(TrainingRecord);
  const userRepo = AppDataSource.getRepository('User');
  const { id } = req.params;
  let record = await repo.findOne({ where: { id: Number(id) }, relations: ['trainee', 'trainer'] });
  if (!record) return res.status(404).json({ error: 'Training record not found' });

  const { traineeId, trainerId, ...fields } = req.body;
  if (traineeId !== undefined) {
    const trainee = await userRepo.findOneBy({ id: traineeId });
    if (!trainee) return res.status(400).json({ error: 'Trainee not found' });
    (record as any).trainee = trainee;
  }
  if (trainerId !== undefined) {
    const trainer = await userRepo.findOneBy({ id: trainerId });
    if (!trainer) return res.status(400).json({ error: 'Trainer not found' });
    (record as any).trainer = trainer;
  }
  repo.merge(record, fields);
  await repo.save(record);
  res.json(record);
};

export const deleteTrainingRecord = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(TrainingRecord);
  const { id } = req.params;
  const record = await repo.findOneBy({ id: Number(id) });
  if (!record) return res.status(404).json({ error: 'Training record not found' });
  await repo.remove(record);
  res.json({ message: 'Training record deleted successfully' });
};
