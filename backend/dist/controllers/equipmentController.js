"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEquipment = exports.updateEquipment = exports.getOneEquipment = exports.createEquipment = exports.getAllEquipment = void 0;
const Equipment_1 = require("../models/Equipment");
const data_source_1 = require("../utils/data-source");
const getAllEquipment = async (req, res) => {
    const equipmentRepo = data_source_1.AppDataSource.getRepository(Equipment_1.Equipment);
    const equipment = await equipmentRepo.find({
        relations: ['workOrders', 'spareParts'],
    });
    res.json(equipment);
};
exports.getAllEquipment = getAllEquipment;
const createEquipment = async (req, res) => {
    const equipmentRepo = data_source_1.AppDataSource.getRepository(Equipment_1.Equipment);
    const newEquipment = equipmentRepo.create(req.body);
    await equipmentRepo.save(newEquipment);
    res.status(201).json(newEquipment);
};
exports.createEquipment = createEquipment;
const getOneEquipment = async (req, res) => {
    const equipmentRepo = data_source_1.AppDataSource.getRepository(Equipment_1.Equipment);
    const { id } = req.params;
    const equipment = await equipmentRepo.findOne({
        where: { id: Number(id) },
        relations: ['workOrders', 'spareParts'],
    });
    if (!equipment)
        return res.status(404).json({ error: 'Equipment not found' });
    res.json(equipment);
};
exports.getOneEquipment = getOneEquipment;
const updateEquipment = async (req, res) => {
    const equipmentRepo = data_source_1.AppDataSource.getRepository(Equipment_1.Equipment);
    const { id } = req.params;
    let equipment = await equipmentRepo.findOneBy({ id: Number(id) });
    if (!equipment)
        return res.status(404).json({ error: 'Equipment not found' });
    equipmentRepo.merge(equipment, req.body);
    await equipmentRepo.save(equipment);
    res.json(equipment);
};
exports.updateEquipment = updateEquipment;
const deleteEquipment = async (req, res) => {
    const equipmentRepo = data_source_1.AppDataSource.getRepository(Equipment_1.Equipment);
    const { id } = req.params;
    const equipment = await equipmentRepo.findOne({
        where: { id: Number(id) },
        relations: ['workOrders', 'spareParts'],
    });
    if (!equipment)
        return res.status(404).json({ error: 'Equipment not found' });
    if ((equipment.workOrders && equipment.workOrders.length > 0) || (equipment.spareParts && equipment.spareParts.length > 0)) {
        return res.status(400).json({ error: 'Cannot delete equipment with related work orders or spare parts.' });
    }
    await equipmentRepo.remove(equipment);
    res.json({ message: 'Equipment deleted successfully' });
};
exports.deleteEquipment = deleteEquipment;
