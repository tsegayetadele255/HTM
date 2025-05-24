"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSOP = exports.updateSOP = exports.createSOP = exports.getOneSOP = exports.getAllSOPs = void 0;
const SOP_1 = require("../models/SOP");
const User_1 = require("../models/User");
const data_source_1 = require("../utils/data-source");
const getAllSOPs = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(SOP_1.SOP);
    const items = await repo.find({ relations: ['createdBy'] });
    res.json(items);
};
exports.getAllSOPs = getAllSOPs;
const getOneSOP = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(SOP_1.SOP);
    const { id } = req.params;
    const item = await repo.findOne({ where: { id: Number(id) }, relations: ['createdBy'] });
    if (!item)
        return res.status(404).json({ error: 'SOP not found' });
    res.json(item);
};
exports.getOneSOP = getOneSOP;
const createSOP = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(SOP_1.SOP);
    const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
    const { title, content, documentUrl, createdById } = req.body;
    const createdBy = await userRepo.findOneBy({ id: createdById });
    if (!createdBy)
        return res.status(400).json({ error: 'Creator not found' });
    const sop = repo.create({ title, content, documentUrl, createdBy });
    await repo.save(sop);
    res.status(201).json(sop);
};
exports.createSOP = createSOP;
const updateSOP = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(SOP_1.SOP);
    const userRepo = data_source_1.AppDataSource.getRepository('User');
    const { id } = req.params;
    let sop = await repo.findOne({ where: { id: Number(id) }, relations: ['createdBy'] });
    if (!sop)
        return res.status(404).json({ error: 'SOP not found' });
    const { createdById, ...fields } = req.body;
    if (createdById !== undefined) {
        const createdBy = await userRepo.findOneBy({ id: createdById });
        if (!createdBy)
            return res.status(400).json({ error: 'Creator not found' });
        sop.createdBy = createdBy;
    }
    repo.merge(sop, fields);
    await repo.save(sop);
    res.json(sop);
};
exports.updateSOP = updateSOP;
const deleteSOP = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(SOP_1.SOP);
    const { id } = req.params;
    const sop = await repo.findOneBy({ id: Number(id) });
    if (!sop)
        return res.status(404).json({ error: 'SOP not found' });
    await repo.remove(sop);
    res.json({ message: 'SOP deleted successfully' });
};
exports.deleteSOP = deleteSOP;
