"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDisposalRecord = exports.updateDisposalRecord = exports.createDisposalRecord = exports.getOneDisposalRecord = exports.getAllDisposalRecords = void 0;
const DisposalRecord_1 = require("../models/DisposalRecord");
const data_source_1 = require("../utils/data-source");
const getAllDisposalRecords = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(DisposalRecord_1.DisposalRecord);
    const items = await repo.find({ relations: ['equipment', 'disposedBy'] });
    res.json(items);
};
exports.getAllDisposalRecords = getAllDisposalRecords;
const getOneDisposalRecord = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(DisposalRecord_1.DisposalRecord);
    const { id } = req.params;
    const item = await repo.findOne({ where: { id: Number(id) }, relations: ['equipment', 'disposedBy'] });
    if (!item)
        return res.status(404).json({ error: 'Disposal record not found' });
    res.json(item);
};
exports.getOneDisposalRecord = getOneDisposalRecord;
const createDisposalRecord = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(DisposalRecord_1.DisposalRecord);
    const equipmentRepo = data_source_1.AppDataSource.getRepository('Equipment');
    const userRepo = data_source_1.AppDataSource.getRepository('User');
    const { equipmentId, reason, method, notes, disposedById, disposalDate, status } = req.body;
    const equipment = await equipmentRepo.findOneBy({ id: equipmentId });
    if (!equipment)
        return res.status(400).json({ error: 'Equipment not found' });
    const disposedBy = await userRepo.findOneBy({ id: disposedById });
    if (!disposedBy)
        return res.status(400).json({ error: 'User not found' });
    const record = repo.create({ equipment, reason, method, notes, disposedBy, disposalDate, status });
    await repo.save(record);
    res.status(201).json(record);
};
exports.createDisposalRecord = createDisposalRecord;
const updateDisposalRecord = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(DisposalRecord_1.DisposalRecord);
    const equipmentRepo = data_source_1.AppDataSource.getRepository('Equipment');
    const userRepo = data_source_1.AppDataSource.getRepository('User');
    const { id } = req.params;
    let record = await repo.findOne({ where: { id: Number(id) }, relations: ['equipment', 'disposedBy'] });
    if (!record)
        return res.status(404).json({ error: 'Disposal record not found' });
    const { equipmentId, disposedById, ...fields } = req.body;
    if (equipmentId !== undefined) {
        const equipment = await equipmentRepo.findOneBy({ id: equipmentId });
        if (!equipment)
            return res.status(400).json({ error: 'Equipment not found' });
        record.equipment = equipment;
    }
    if (disposedById !== undefined) {
        const disposedBy = await userRepo.findOneBy({ id: disposedById });
        if (!disposedBy)
            return res.status(400).json({ error: 'User not found' });
        record.disposedBy = disposedBy;
    }
    repo.merge(record, fields);
    await repo.save(record);
    res.json(record);
};
exports.updateDisposalRecord = updateDisposalRecord;
const deleteDisposalRecord = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(DisposalRecord_1.DisposalRecord);
    const { id } = req.params;
    const record = await repo.findOneBy({ id: Number(id) });
    if (!record)
        return res.status(404).json({ error: 'Disposal record not found' });
    await repo.remove(record);
    res.json({ message: 'Disposal record deleted successfully' });
};
exports.deleteDisposalRecord = deleteDisposalRecord;
