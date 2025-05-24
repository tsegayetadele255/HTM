"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAuditLog = exports.createAuditLog = exports.getOneAuditLog = exports.getAllAuditLogs = void 0;
const AuditLog_1 = require("../models/AuditLog");
const data_source_1 = require("../utils/data-source");
const getAllAuditLogs = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(AuditLog_1.AuditLog);
    const items = await repo.find({ relations: ['user'] });
    res.json(items);
};
exports.getAllAuditLogs = getAllAuditLogs;
const getOneAuditLog = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(AuditLog_1.AuditLog);
    const { id } = req.params;
    const item = await repo.findOne({ where: { id: Number(id) }, relations: ['user'] });
    if (!item)
        return res.status(404).json({ error: 'Audit log not found' });
    res.json(item);
};
exports.getOneAuditLog = getOneAuditLog;
const createAuditLog = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(AuditLog_1.AuditLog);
    const userRepo = data_source_1.AppDataSource.getRepository('User');
    const { action, entityType, entityId, details, userId } = req.body;
    let user = undefined;
    if (userId !== undefined) {
        user = await userRepo.findOneBy({ id: userId });
        if (!user)
            return res.status(400).json({ error: 'User not found' });
    }
    const log = repo.create({ action, entityType, entityId, details, user });
    await repo.save(log);
    res.status(201).json(log);
};
exports.createAuditLog = createAuditLog;
const deleteAuditLog = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(AuditLog_1.AuditLog);
    const { id } = req.params;
    const log = await repo.findOneBy({ id: Number(id) });
    if (!log)
        return res.status(404).json({ error: 'Audit log not found' });
    await repo.remove(log);
    res.json({ message: 'Audit log deleted successfully' });
};
exports.deleteAuditLog = deleteAuditLog;
