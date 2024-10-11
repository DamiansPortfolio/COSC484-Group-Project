import express from 'express';
import { getArtists } from '../controllers/artistController.js'; // Include .js extension

const router = express.Router();

router.get('/', getArtists);

export default router;
