import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS to allow requests from the frontend (localhost:5173)
app.use(cors({
    origin: 'http://localhost:5173'  // Allow requests from your frontend
}));

app.use(express.json());

// Import routes
import artistRoutes from './routes/artistRoutes.js';
app.use('/api/artists', artistRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
