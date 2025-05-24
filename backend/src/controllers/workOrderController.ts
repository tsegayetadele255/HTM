import { Request, Response } from 'express';
import { WorkOrder } from '../models/WorkOrder';
import { AppDataSource } from '../utils/data-source';

export const getAllWorkOrders = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(WorkOrder);
  const items = await repo.find({
    relations: ['assignedTechnician', 'faultReportedBy', 'equipment'],
  });
  res.json(items);
};

export const getOneWorkOrder = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(WorkOrder);
  const { id } = req.params;
  const item = await repo.findOne({
    where: { id: Number(id) },
    relations: ['assignedTechnician', 'faultReportedBy', 'equipment'],
  });
  if (!item) return res.status(404).json({ error: 'Work order not found' });
  res.json(item);
};

export const updateWorkOrder = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(WorkOrder);
  const userRepo = AppDataSource.getRepository('User');
  const equipmentRepo = AppDataSource.getRepository('Equipment');
  const { id } = req.params;
  let workOrder = await repo.findOne({ where: { id: Number(id) }, relations: ['assignedTechnician', 'faultReportedBy', 'equipment'] });
  if (!workOrder) return res.status(404).json({ error: 'Work order not found' });

  const {
    assignedTechnicianId,
    faultReportedById,
    equipmentId,
    ...fields
  } = req.body;

  let assignedTechnician = workOrder.assignedTechnician;
  let faultReportedBy = workOrder.faultReportedBy;
  let equipment = workOrder.equipment;

  if (assignedTechnicianId !== undefined) {
    const tech = assignedTechnicianId ? await userRepo.findOneBy({ id: assignedTechnicianId }) : null;
    if (assignedTechnicianId && !tech)
      return res.status(400).json({ error: 'Assigned technician not found' });
    assignedTechnician = tech as typeof workOrder.assignedTechnician;
  }
  if (faultReportedById !== undefined) {
    const reporter = faultReportedById ? await userRepo.findOneBy({ id: faultReportedById }) : null;
    if (faultReportedById && !reporter)
      return res.status(400).json({ error: 'Fault reporter not found' });
    faultReportedBy = reporter as typeof workOrder.faultReportedBy;
  }
  if (equipmentId !== undefined) {
    const equip = equipmentId ? await equipmentRepo.findOneBy({ id: equipmentId }) : null;
    if (equipmentId && !equip)
      return res.status(400).json({ error: 'Equipment not found' });
    equipment = equip as typeof workOrder.equipment;
  }

  repo.merge(workOrder, { ...fields, assignedTechnician, faultReportedBy, equipment });
  await repo.save(workOrder);
  res.json(workOrder);
};

export const deleteWorkOrder = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(WorkOrder);
  const { id } = req.params;
  const workOrder = await repo.findOneBy({ id: Number(id) });
  if (!workOrder) return res.status(404).json({ error: 'Work order not found' });
  await repo.remove(workOrder);
  res.json({ message: 'Work order deleted successfully' });
};

export const createWorkOrder = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(WorkOrder);
  const userRepo = AppDataSource.getRepository('User');
  const equipmentRepo = AppDataSource.getRepository('Equipment');
  try {
    const {
      description,
      status,
      priority,
      assignedTechnicianId,
      faultReportedById,
      equipmentId,
      repairCost,
      repairTime,
      maintenanceType,
      reason,
      solution,
      completedAt
    } = req.body;

    // Find related entities
    const assignedTechnician = assignedTechnicianId ? await userRepo.findOneBy({ id: assignedTechnicianId }) : undefined;
    const faultReportedBy = faultReportedById ? await userRepo.findOneBy({ id: faultReportedById }) : undefined;
    const equipment = equipmentId ? await equipmentRepo.findOneBy({ id: equipmentId }) : undefined;

    if (assignedTechnicianId && !assignedTechnician)
      return res.status(400).json({ error: 'Assigned technician not found' });
    if (faultReportedById && !faultReportedBy)
      return res.status(400).json({ error: 'Fault reporter not found' });
    if (equipmentId && !equipment)
      return res.status(400).json({ error: 'Equipment not found' });

    const newWorkOrder = repo.create({
      description,
      status,
      priority,
      assignedTechnician: assignedTechnician || undefined,
      faultReportedBy: faultReportedBy || undefined,
      equipment: equipment || undefined,
      repairCost,
      repairTime,
      maintenanceType,
      reason,
      solution,
      completedAt
    });
    await repo.save(newWorkOrder);
    res.status(201).json(newWorkOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create work order', details: error });
  }
};
