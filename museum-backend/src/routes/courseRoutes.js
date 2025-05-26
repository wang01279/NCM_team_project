import express from 'express';
import { getCourseById, getRelatedCourses } from '../controllers/courseController.js';
const router = express.Router();

router.get('/related', getRelatedCourses);    // /api/courses/related
router.get('/:id', getCourseById);           // /api/courses/:id

export default router;