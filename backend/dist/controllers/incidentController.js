"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteIncident = exports.updateIncident = exports.createIncident = exports.getOneIncident = exports.getAllIncidents = void 0;
const Incident_1 = require("../models/Incident");
const data_source_1 = require("../utils/data-source");
const getAllIncidents = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(Incident_1.Incident);
    const items = await repo.find({ relations: ['relatedEquipment', 'reportedBy'] });
    res.json(items);
};
exports.getAllIncidents = getAllIncidents;
const getOneIncident = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(Incident_1.Incident);
    const { id } = req.params;
    const item = await repo.findOne({ where: { id: Number(id) }, relations: ['relatedEquipment', 'reportedBy'] });
    if (!item)
        return res.status(404).json({ error: 'Incident not found' });
    res.json(item);
};
exports.getOneIncident = getOneIncident;
const createIncident = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(Incident_1.Incident);
    const equipmentRepo = data_source_1.AppDataSource.getRepository('Equipment');
    const userRepo = data_source_1.AppDataSource.getRepository('User');
    const { description, severity, status, actionsTaken, relatedEquipmentId, reportedById } = req.body;
    const relatedEquipment = await equipmentRepo.findOneBy({ id: relatedEquipmentId });
    if (!relatedEquipment)
        return res.status(400).json({ error: 'Related equipment not found' });
    const reportedBy = await userRepo.findOneBy({ id: reportedById });
    if (!reportedBy)
        return res.status(400).json({ error: 'Reporter not found' });
    const incident = repo.create({
        description,
        severity,
        status,
        actionsTaken,
        relatedEquipment,
        reportedBy
    });
    await repo.save(incident);
    res.status(201).json(incident);
};
exports.createIncident = createIncident;
const updateIncident = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(Incident_1.Incident);
    const equipmentRepo = data_source_1.AppDataSource.getRepository('Equipment');
    const userRepo = data_source_1.AppDataSource.getRepository('User');
    const { id } = req.params;
    let incident = await repo.findOne({ where: { id: Number(id) }, relations: ['relatedEquipment', 'reportedBy'] });
    if (!incident)
        return res.status(404).json({ error: 'Incident not found' });
    const { relatedEquipmentId, reportedById, ...fields } = req.body;
    if (relatedEquipmentId !== undefined) {
        const relatedEquipment = await equipmentRepo.findOneBy({ id: relatedEquipmentId });
        if (!relatedEquipment)
            return res.status(400).json({ error: 'Related equipment not found' });
        incident.relatedEquipment = relatedEquipment;
    }
    if (reportedById !== undefined) {
        const reportedBy = await userRepo.findOneBy({ id: reportedById });
        if (!reportedBy)
            return res.status(400).json({ error: 'Reporter not found' });
        incident.reportedBy = reportedBy;
    }
    repo.merge(incident, fields);
    await repo.save(incident);
    res.json(incident);
};
exports.updateIncident = updateIncident;
const deleteIncident = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(Incident_1.Incident);
    const { id } = req.params;
    const incident = await repo.findOneBy({ id: Number(id) });
    if (!incident)
        return res.status(404).json({ error: 'Incident not found' });
    await repo.remove(incident);
    res.json({ message: 'Incident deleted successfully' });
};
exports.deleteIncident = deleteIncident;
