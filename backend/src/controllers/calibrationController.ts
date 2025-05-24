import { Request, Response } from 'express';
import { CalibrationRecord } from '../models/CalibrationRecord';
import { AppDataSource } from '../utils/data-source';

export const getAllCalibrationRecords = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(CalibrationRecord);
  const items = await repo.find({ relations: ['equipment', 'performedBy'] });
  res.json(items);
};

export const getOneCalibrationRecord = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(CalibrationRecord);
  const { id } = req.params;
  const item = await repo.findOne({ where: { id: Number(id) }, relations: ['equipment', 'performedBy'] });
  if (!item) return res.status(404).json({ error: 'Calibration record not found' });
  res.json(item);
};

export const createCalibrationRecord = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(CalibrationRecord);
  const equipmentRepo = AppDataSource.getRepository('Equipment');
  const userRepo = AppDataSource.getRepository('User');
  const { equipmentId, calibrationDate, dueDate, performedById, certificateUrl, status, notes } = req.body;

  const equipment = await equipmentRepo.findOneBy({ id: equipmentId });
  if (!equipment) return res.status(400).json({ error: 'Equipment not found' });
  const performedBy = await userRepo.findOneBy({ id: performedById });
  if (!performedBy) return res.status(400).json({ error: 'User not found' });

  const record = repo.create({ equipment, calibrationDate, dueDate, performedBy, certificateUrl, status, notes });
  await repo.save(record);
  res.status(201).json(record);
};

export const updateCalibrationRecord = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(CalibrationRecord);
  const equipmentRepo = AppDataSource.getRepository('Equipment');
  const userRepo = AppDataSource.getRepository('User');
  const { id } = req.params;
  let record = await repo.findOne({ where: { id: Number(id) }, relations: ['equipment', 'performedBy'] });
  if (!record) return res.status(404).json({ error: 'Calibration record not found' });

  const { equipmentId, performedById, ...fields } = req.body;
  if (equipmentId !== undefined) {
    const equipment = await equipmentRepo.findOneBy({ id: equipmentId });
    if (!equipment) return res.status(400).json({ error: 'Equipment not found' });
    (record as any).equipment = equipment;
  }
  if (performedById !== undefined) {
    const performedBy = await userRepo.findOneBy({ id: performedById });
    if (!performedBy) return res.status(400).json({ error: 'User not found' });
    (record as any).performedBy = performedBy;
  }
  repo.merge(record, fields);
  await repo.save(record);
  res.json(record);
};

export const deleteCalibrationRecord = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(CalibrationRecord);
  const { id } = req.params;
  const record = await repo.findOneBy({ id: Number(id) });
  if (!record) return res.status(404).json({ error: 'Calibration record not found' });
  await repo.remove(record);
  res.json({ message: 'Calibration record deleted successfully' });
};
