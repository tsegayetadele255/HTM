import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './utils/data-source';
import equipmentRoutes from './routes/equipmentRoutes';
import workOrderRoutes from './routes/workOrderRoutes';
import sparePartRoutes from './routes/sparePartRoutes';
import userRoutes from './routes/userRoutes';
import incidentRoutes from './routes/incidentRoutes';
import sopRoutes from './routes/sopRoutes';
import trainingRoutes from './routes/trainingRoutes';
import calibrationRoutes from './routes/calibrationRoutes';
import disposalRoutes from './routes/disposalRoutes';
import procurementRoutes from './routes/procurementRoutes';
import auditLogRoutes from './routes/auditLogRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Example routes
app.use('/api/equipment', equipmentRoutes);
app.use('/api/workorders', workOrderRoutes);
app.use('/api/spareparts', sparePartRoutes);
app.use('/api/users', userRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/sops', sopRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/calibration', calibrationRoutes);
app.use('/api/disposals', disposalRoutes);
app.use('/api/procurement', procurementRoutes);
app.use('/api/auditlogs', auditLogRoutes);

const PORT = process.env.PORT || 4000;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => console.error('TypeORM connection error:', error));
