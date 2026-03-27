import express from 'express';
import cors from 'cors';
import productWoodRoutes from './routes/productWoodRoutes';
import productGalleryRoutes from './routes/productGalleryRoutes';
import categoryWoodRoutes from './routes/categoryWoodRoutes';
import categoryGalleryRoutes from './routes/categoryGalleryRoutes';
import orderRoutes from './routes/orderRoutes';
import authRoutes from './routes/authRoutes';
import contactMessageRoutes from './routes/contactMessageRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Import all models to ensure tables are created/synced on startup
import './models/productWoodModel';
import './models/productGalleryModel';
import './models/categoryWoodModel';
import './models/categoryGalleryModel';
import './models/orderModel';
import './models/contactMessageModel';

// Test database connection
import sequelize from './sequelize';
sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to PostgreSQL database');
    return sequelize.sync({ alter: true });
  })
  .then(() => console.log('Database synced successfully'))
  .catch((err) => console.error('Failed to connect to PostgreSQL:', err));

// Health Check & Root Route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Achaia Wood Shop API is running successfully on Vercel!' });
});
// Ignore browser favicon requests
app.get('/favicon.ico', (req, res) => { res.status(204).end(); });
app.get('/favicon.png', (req, res) => { res.status(204).end(); });

// Routes
app.use(['/api/wood-products', '/wood-products'], productWoodRoutes);
app.use(['/api/gallery-products', '/gallery-products'], productGalleryRoutes);
app.use(['/api/wood-categories', '/wood-categories'], categoryWoodRoutes);
app.use(['/api/gallery-categories', '/gallery-categories'], categoryGalleryRoutes);
app.use(['/api/orders', '/orders'], orderRoutes);
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/contact-messages', '/contact-messages'], contactMessageRoutes);

export default app;
