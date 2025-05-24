"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Equipment_1 = require("../models/Equipment");
const WorkOrder_1 = require("../models/WorkOrder");
const SparePart_1 = require("../models/SparePart");
const User_1 = require("../models/User");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true, // Set to false in production!
    logging: false,
    entities: [Equipment_1.Equipment, WorkOrder_1.WorkOrder, SparePart_1.SparePart, User_1.User, require('../models/Incident').Incident, require('../models/SOP').SOP, require('../models/TrainingRecord').TrainingRecord, require('../models/CalibrationRecord').CalibrationRecord, require('../models/AuditLog').AuditLog, require('../models/DisposalRecord').DisposalRecord, require('../models/ProcurementRecord').ProcurementRecord],
    migrations: [],
    subscribers: [],
});
