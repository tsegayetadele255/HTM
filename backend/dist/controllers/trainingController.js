"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTrainingRecord = exports.updateTrainingRecord = exports.createTrainingRecord = exports.getOneTrainingRecord = exports.getAllTrainingRecords = void 0;
const TrainingRecord_1 = require("../models/TrainingRecord");
const data_source_1 = require("../utils/data-source");
const getAllTrainingRecords = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(TrainingRecord_1.TrainingRecord);
    const items = await repo.find({ relations: ['trainee', 'trainer'] });
    res.json(items);
};
exports.getAllTrainingRecords = getAllTrainingRecords;
const getOneTrainingRecord = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(TrainingRecord_1.TrainingRecord);
    const { id } = req.params;
    const item = await repo.findOne({ where: { id: Number(id) }, relations: ['trainee', 'trainer'] });
    if (!item)
        return res.status(404).json({ error: 'Training record not found' });
    res.json(item);
};
exports.getOneTrainingRecord = getOneTrainingRecord;
const createTrainingRecord = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(TrainingRecord_1.TrainingRecord);
    const userRepo = data_source_1.AppDataSource.getRepository('User');
    const { topic, description, date, traineeId, trainerId, certificateUrl } = req.body;
    const trainee = await userRepo.findOneBy({ id: traineeId });
    if (!trainee)
        return res.status(400).json({ error: 'Trainee not found' });
    const trainer = await userRepo.findOneBy({ id: trainerId });
    if (!trainer)
        return res.status(400).json({ error: 'Trainer not found' });
    const record = repo.create({ topic, description, date, trainee, trainer, certificateUrl });
    await repo.save(record);
    res.status(201).json(record);
};
exports.createTrainingRecord = createTrainingRecord;
const updateTrainingRecord = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(TrainingRecord_1.TrainingRecord);
    const userRepo = data_source_1.AppDataSource.getRepository('User');
    const { id } = req.params;
    let record = await repo.findOne({ where: { id: Number(id) }, relations: ['trainee', 'trainer'] });
    if (!record)
        return res.status(404).json({ error: 'Training record not found' });
    const { traineeId, trainerId, ...fields } = req.body;
    if (traineeId !== undefined) {
        const trainee = await userRepo.findOneBy({ id: traineeId });
        if (!trainee)
            return res.status(400).json({ error: 'Trainee not found' });
        record.trainee = trainee;
    }
    if (trainerId !== undefined) {
        const trainer = await userRepo.findOneBy({ id: trainerId });
        if (!trainer)
            return res.status(400).json({ error: 'Trainer not found' });
        record.trainer = trainer;
    }
    repo.merge(record, fields);
    await repo.save(record);
    res.json(record);
};
exports.updateTrainingRecord = updateTrainingRecord;
const deleteTrainingRecord = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(TrainingRecord_1.TrainingRecord);
    const { id } = req.params;
    const record = await repo.findOneBy({ id: Number(id) });
    if (!record)
        return res.status(404).json({ error: 'Training record not found' });
    await repo.remove(record);
    res.json({ message: 'Training record deleted successfully' });
};
exports.deleteTrainingRecord = deleteTrainingRecord;
