"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const data_source_1 = require("./utils/data-source");
const equipmentRoutes_1 = __importDefault(require("./routes/equipmentRoutes"));
const workOrderRoutes_1 = __importDefault(require("./routes/workOrderRoutes"));
const sparePartRoutes_1 = __importDefault(require("./routes/sparePartRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const incidentRoutes_1 = __importDefault(require("./routes/incidentRoutes"));
const sopRoutes_1 = __importDefault(require("./routes/sopRoutes"));
const trainingRoutes_1 = __importDefault(require("./routes/trainingRoutes"));
const calibrationRoutes_1 = __importDefault(require("./routes/calibrationRoutes"));
const disposalRoutes_1 = __importDefault(require("./routes/disposalRoutes"));
const procurementRoutes_1 = __importDefault(require("./routes/procurementRoutes"));
const auditLogRoutes_1 = __importDefault(require("./routes/auditLogRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Example routes
app.use('/api/equipment', equipmentRoutes_1.default);
app.use('/api/workorders', workOrderRoutes_1.default);
app.use('/api/spareparts', sparePartRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/incidents', incidentRoutes_1.default);
app.use('/api/sops', sopRoutes_1.default);
app.use('/api/training', trainingRoutes_1.default);
app.use('/api/calibration', calibrationRoutes_1.default);
app.use('/api/disposals', disposalRoutes_1.default);
app.use('/api/procurement', procurementRoutes_1.default);
app.use('/api/auditlogs', auditLogRoutes_1.default);
const PORT = process.env.PORT || 4000;
data_source_1.AppDataSource.initialize()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch((error) => console.error('TypeORM connection error:', error));
