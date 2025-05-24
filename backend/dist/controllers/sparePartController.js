"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSparePart = exports.deleteSparePart = exports.updateSparePart = exports.getOneSparePart = exports.getAllSpareParts = void 0;
const SparePart_1 = require("../models/SparePart");
const data_source_1 = require("../utils/data-source");
const getAllSpareParts = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(SparePart_1.SparePart);
    const items = await repo.find({
        relations: ['linkedEquipment'],
    });
    res.json(items);
};
exports.getAllSpareParts = getAllSpareParts;
const getOneSparePart = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(SparePart_1.SparePart);
    const { id } = req.params;
    const item = await repo.findOne({
        where: { id: Number(id) },
        relations: ['linkedEquipment'],
    });
    if (!item)
        return res.status(404).json({ error: 'Spare part not found' });
    res.json(item);
};
exports.getOneSparePart = getOneSparePart;
const updateSparePart = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(SparePart_1.SparePart);
    const equipmentRepo = data_source_1.AppDataSource.getRepository('Equipment');
    const { id } = req.params;
    let sparePart = await repo.findOne({ where: { id: Number(id) }, relations: ['linkedEquipment'] });
    if (!sparePart)
        return res.status(404).json({ error: 'Spare part not found' });
    const { linkedEquipmentId, ...fields } = req.body;
    let linkedEquipment = sparePart.linkedEquipment;
    if (linkedEquipmentId !== undefined) {
        const equip = linkedEquipmentId ? await equipmentRepo.findOneBy({ id: linkedEquipmentId }) : null;
        if (linkedEquipmentId && !equip)
            return res.status(400).json({ error: 'Linked equipment not found' });
        linkedEquipment = equip;
    }
    repo.merge(sparePart, { ...fields, linkedEquipment });
    await repo.save(sparePart);
    res.json(sparePart);
};
exports.updateSparePart = updateSparePart;
const deleteSparePart = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(SparePart_1.SparePart);
    const { id } = req.params;
    const sparePart = await repo.findOneBy({ id: Number(id) });
    if (!sparePart)
        return res.status(404).json({ error: 'Spare part not found' });
    await repo.remove(sparePart);
    res.json({ message: 'Spare part deleted successfully' });
};
exports.deleteSparePart = deleteSparePart;
const createSparePart = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(SparePart_1.SparePart);
    const equipmentRepo = data_source_1.AppDataSource.getRepository('Equipment');
    try {
        const { name, stockLevel, expiryDate, location, equipmentType, partNumber, manufacturer, minStockLevel, maxStockLevel, linkedEquipmentId } = req.body;
        let linkedEquipment = undefined;
        if (linkedEquipmentId) {
            linkedEquipment = await equipmentRepo.findOneBy({ id: linkedEquipmentId });
            if (!linkedEquipment)
                return res.status(400).json({ error: 'Linked equipment not found' });
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create spare part', details: error });
    }
};
exports.createSparePart = createSparePart;
