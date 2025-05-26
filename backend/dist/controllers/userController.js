"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.deleteUser = exports.createUser = exports.getAllUsers = void 0;
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
const deleteUser = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(User_1.User);
    try {
        const { id } = req.params;
        const user = await repo.findOneBy({ id: Number(id) });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await repo.remove(user);
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete user', details: error });
    }
};
exports.deleteUser = deleteUser;
const updateUser = async (req, res) => {
    const repo = data_source_1.AppDataSource.getRepository(User_1.User);
    try {
        const { id } = req.params;
        let user = await repo.findOneBy({ id: Number(id) });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const { username, password, role, fullName, email, phone, department, isActive } = req.body;
        // Only update password if provided
        if (password) {
            user.password = password;
        }
        user.username = username !== undefined ? username : user.username;
        user.role = role !== undefined ? role : user.role;
        user.fullName = fullName !== undefined ? fullName : user.fullName;
        user.email = email !== undefined ? email : user.email;
        user.phone = phone !== undefined ? phone : user.phone;
        user.department = department !== undefined ? department : user.department;
        user.isActive = isActive !== undefined ? isActive : user.isActive;
        await repo.save(user);
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update user', details: error });
    }
};
exports.updateUser = updateUser;
