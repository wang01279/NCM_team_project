import express from 'express';
import { getArtistById, getArtistExperiences, getAllArtists } from '../controllers/artistController.js';
const router = express.Router();

router.get('/:id', getArtistById);
router.get('/:id/experiences', getArtistExperiences);
router.get('/', getAllArtists);

export default router;