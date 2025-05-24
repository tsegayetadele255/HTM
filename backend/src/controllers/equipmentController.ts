import { Request, Response } from 'express';
import { Equipment } from '../models/Equipment';
import { AppDataSource } from '../utils/data-source';

export const getAllEquipment = async (req: Request, res: Response) => {
  const equipmentRepo = AppDataSource.getRepository(Equipment);
  const equipment = await equipmentRepo.find({
    relations: ['workOrders', 'spareParts'],
  });
  res.json(equipment);
};

export const createEquipment = async (req: Request, res: Response) => {
  const equipmentRepo = AppDataSource.getRepository(Equipment);
  const newEquipment = equipmentRepo.create(req.body);
  await equipmentRepo.save(newEquipment);
  res.status(201).json(newEquipment);
};

export const getOneEquipment = async (req: Request, res: Response) => {
  const equipmentRepo = AppDataSource.getRepository(Equipment);
  const { id } = req.params;
  const equipment = await equipmentRepo.findOne({
    where: { id: Number(id) },
    relations: ['workOrders', 'spareParts'],
  });
  if (!equipment) return res.status(404).json({ error: 'Equipment not found' });
  res.json(equipment);
};

export const updateEquipment = async (req: Request, res: Response) => {
  const equipmentRepo = AppDataSource.getRepository(Equipment);
  const { id } = req.params;
  let equipment = await equipmentRepo.findOneBy({ id: Number(id) });
  if (!equipment) return res.status(404).json({ error: 'Equipment not found' });
  equipmentRepo.merge(equipment, req.body);
  await equipmentRepo.save(equipment);
  res.json(equipment);
};

export const deleteEquipment = async (req: Request, res: Response) => {
  const equipmentRepo = AppDataSource.getRepository(Equipment);
  const { id } = req.params;
  const equipment = await equipmentRepo.findOne({
    where: { id: Number(id) },
    relations: ['workOrders', 'spareParts'],
  });
  if (!equipment) return res.status(404).json({ error: 'Equipment not found' });
  if ((equipment.workOrders && equipment.workOrders.length > 0) || (equipment.spareParts && equipment.spareParts.length > 0)) {
    return res.status(400).json({ error: 'Cannot delete equipment with related work orders or spare parts.' });
  }
  await equipmentRepo.remove(equipment);
  res.json({ message: 'Equipment deleted successfully' });
};
