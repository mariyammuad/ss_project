import express from 'express';
import adminRoutes from './adminRoutes.js'; 

const router = express.Router();

// Add admin-related routes under '/admin'
router.use('/admin', adminRoutes);

export default router;
