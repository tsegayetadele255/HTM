"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getAllUsers = void 0;
const User_1 = require("../models/User");
const data_source_1 = require("../utils/data-source");
const getAllUsers = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(User_1.User);
    const items = await repo.find({
        relations: ['assignedWorkOrders', 'reportedWorkOrders'],
    });
    res.json(items);
};
exports.getAllUsers = getAllUsers;
const createUser = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(User_1.User);
    try {
        const { username, password, role, fullName, email, phone, department, isActive } = req.body;
        const newUser = repo.create({
            username,
            password,
            role,
            fullName,
            email,
            phone,
            department,
            isActive
        });
        await repo.save(newUser);
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create user', details: error });
    }
};
exports.createUser = createUser;
