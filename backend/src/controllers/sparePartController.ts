import { Request, Response } from 'express';
import { SparePart } from '../models/SparePart';
import { AppDataSource } from '../utils/data-source';

export const getAllSpareParts = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(SparePart);
  const items = await repo.find({
    relations: ['linkedEquipment'],
  });
  res.json(items);
};

export const getOneSparePart = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(SparePart);
  const { id } = req.params;
  const item = await repo.findOne({
    where: { id: Number(id) },
    relations: ['linkedEquipment'],
  });
  if (!item) return res.status(404).json({ error: 'Spare part not found' });
  res.json(item);
};

export const updateSparePart = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(SparePart);
  const equipmentRepo = AppDataSource.getRepository('Equipment');
  const { id } = req.params;
  let sparePart = await repo.findOne({ where: { id: Number(id) }, relations: ['linkedEquipment'] });
  if (!sparePart) return res.status(404).json({ error: 'Spare part not found' });

  const { linkedEquipmentId, ...fields } = req.body;
  let linkedEquipment = sparePart.linkedEquipment;
  if (linkedEquipmentId !== undefined) {
    const equip = linkedEquipmentId ? await equipmentRepo.findOneBy({ id: linkedEquipmentId }) : null;
    if (linkedEquipmentId && !equip)
      return res.status(400).json({ error: 'Linked equipment not found' });
    linkedEquipment = equip as typeof sparePart.linkedEquipment;
  }

  repo.merge(sparePart, { ...fields, linkedEquipment });
  await repo.save(sparePart);
  res.json(sparePart);
};

export const deleteSparePart = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(SparePart);
  const { id } = req.params;
  const sparePart = await repo.findOneBy({ id: Number(id) });
  if (!sparePart) return res.status(404).json({ error: 'Spare part not found' });
  await repo.remove(sparePart);
  res.json({ message: 'Spare part deleted successfully' });
};

export const createSparePart = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(SparePart);
  const equipmentRepo = AppDataSource.getRepository('Equipment');
  try {
    const {
      name,
      stockLevel,
      expiryDate,
      location,
      equipmentType,
      partNumber,
      manufacturer,
      minStockLevel,
      maxStockLevel,
      linkedEquipmentId
    } = req.body;

    let linkedEquipment = undefined;
    if (linkedEquipmentId) {
      linkedEquipment = await equipmentRepo.findOneBy({ id: linkedEquipmentId });
      if (!linkedEquipment) return res.status(400).json({ error: 'Linked equipment not found' });
    }

    const newSparePart = repo.create({
      name,
      stockLevel,
      expiryDate,
      location,
      equipmentType,
      partNumber,
      manufacturer,
      minStockLevel,
      maxStockLevel,
      linkedEquipment: linkedEquipment || undefined
    });
    await repo.save(newSparePart);
    res.status(201).json(newSparePart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create spare part', details: error });
  }
};
