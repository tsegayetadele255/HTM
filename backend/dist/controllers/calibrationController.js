"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCalibrationRecord = exports.updateCalibrationRecord = exports.createCalibrationRecord = exports.getOneCalibrationRecord = exports.getAllCalibrationRecords = void 0;
const CalibrationRecord_1 = require("../models/CalibrationRecord");
const data_source_1 = require("../utils/data-source");
const getAllCalibrationRecords = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(CalibrationRecord_1.CalibrationRecord);
    const items = await repo.find({ relations: ['equipment', 'performedBy'] });
    res.json(items);
};
exports.getAllCalibrationRecords = getAllCalibrationRecords;
const getOneCalibrationRecord = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(CalibrationRecord_1.CalibrationRecord);
    const { id } = req.params;
    const item = await repo.findOne({ where: { id: Number(id) }, relations: ['equipment', 'performedBy'] });
    if (!item)
        return res.status(404).json({ error: 'Calibration record not found' });
    res.json(item);
};
exports.getOneCalibrationRecord = getOneCalibrationRecord;
const createCalibrationRecord = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(CalibrationRecord_1.CalibrationRecord);
    const equipmentRepo = data_source_1.AppDataSource.getRepository('Equipment');
    const userRepo = data_source_1.AppDataSource.getRepository('User');
    const { equipmentId, calibrationDate, dueDate, performedById, certificateUrl, status, notes } = req.body;
    const equipment = await equipmentRepo.findOneBy({ id: equipmentId });
    if (!equipment)
        return res.status(400).json({ error: 'Equipment not found' });
    const performedBy = await userRepo.findOneBy({ id: performedById });
    if (!performedBy)
        return res.status(400).json({ error: 'User not found' });
    const record = repo.create({ equipment, calibrationDate, dueDate, performedBy, certificateUrl, status, notes });
    await repo.save(record);
    res.status(201).json(record);
};
exports.createCalibrationRecord = createCalibrationRecord;
const updateCalibrationRecord = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(CalibrationRecord_1.CalibrationRecord);
    const equipmentRepo = data_source_1.AppDataSource.getRepository('Equipment');
    const userRepo = data_source_1.AppDataSource.getRepository('User');
    const { id } = req.params;
    let record = await repo.findOne({ where: { id: Number(id) }, relations: ['equipment', 'performedBy'] });
    if (!record)
        return res.status(404).json({ error: 'Calibration record not found' });
    const { equipmentId, performedById, ...fields } = req.body;
    if (equipmentId !== undefined) {
        const equipment = await equipmentRepo.findOneBy({ id: equipmentId });
        if (!equipment)
            return res.status(400).json({ error: 'Equipment not found' });
        record.equipment = equipment;
    }
    if (performedById !== undefined) {
        const performedBy = await userRepo.findOneBy({ id: performedById });
        if (!performedBy)
            return res.status(400).json({ error: 'User not found' });
        record.performedBy = performedBy;
    }
    repo.merge(record, fields);
    await repo.save(record);
    res.json(record);
};
exports.updateCalibrationRecord = updateCalibrationRecord;
const deleteCalibrationRecord = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(CalibrationRecord_1.CalibrationRecord);
    const { id } = req.params;
    const record = await repo.findOneBy({ id: Number(id) });
    if (!record)
        return res.status(404).json({ error: 'Calibration record not found' });
    await repo.remove(record);
    res.json({ message: 'Calibration record deleted successfully' });
};
exports.deleteCalibrationRecord = deleteCalibrationRecord;
