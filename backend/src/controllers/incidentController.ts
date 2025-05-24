import { Request, Response } from 'express';
import { Incident } from '../models/Incident';
import { AppDataSource } from '../utils/data-source';

export const getAllIncidents = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(Incident);
  const items = await repo.find({ relations: ['relatedEquipment', 'reportedBy'] });
  res.json(items);
};

export const getOneIncident = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(Incident);
  const { id } = req.params;
  const item = await repo.findOne({ where: { id: Number(id) }, relations: ['relatedEquipment', 'reportedBy'] });
  if (!item) return res.status(404).json({ error: 'Incident not found' });
  res.json(item);
};

export const createIncident = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(Incident);
  const equipmentRepo = AppDataSource.getRepository('Equipment');
  const userRepo = AppDataSource.getRepository('User');
  const { description, severity, status, actionsTaken, relatedEquipmentId, reportedById } = req.body;

  const relatedEquipment = await equipmentRepo.findOneBy({ id: relatedEquipmentId });
  if (!relatedEquipment) return res.status(400).json({ error: 'Related equipment not found' });
  const reportedBy = await userRepo.findOneBy({ id: reportedById });
  if (!reportedBy) return res.status(400).json({ error: 'Reporter not found' });

  const incident = repo.create({
    description,
    severity,
    status,
    actionsTaken,
    relatedEquipment,
    reportedBy
  });
  await repo.save(incident);
  res.status(201).json(incident);
};

export const updateIncident = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(Incident);
  const equipmentRepo = AppDataSource.getRepository('Equipment');
  const userRepo = AppDataSource.getRepository('User');
  const { id } = req.params;
  let incident = await repo.findOne({ where: { id: Number(id) }, relations: ['relatedEquipment', 'reportedBy'] });
  if (!incident) return res.status(404).json({ error: 'Incident not found' });

  const { relatedEquipmentId, reportedById, ...fields } = req.body;
  if (relatedEquipmentId !== undefined) {
    const relatedEquipment = await equipmentRepo.findOneBy({ id: relatedEquipmentId });
    if (!relatedEquipment) return res.status(400).json({ error: 'Related equipment not found' });
    (incident as any).relatedEquipment = relatedEquipment;
  }
  if (reportedById !== undefined) {
    const reportedBy = await userRepo.findOneBy({ id: reportedById });
    if (!reportedBy) return res.status(400).json({ error: 'Reporter not found' });
    (incident as any).reportedBy = reportedBy;
  }
  repo.merge(incident, fields);
  await repo.save(incident);
  res.json(incident);
};

export const deleteIncident = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(Incident);
  const { id } = req.params;
  const incident = await repo.findOneBy({ id: Number(id) });
  if (!incident) return res.status(404).json({ error: 'Incident not found' });
  await repo.remove(incident);
  res.json({ message: 'Incident deleted successfully' });
};
