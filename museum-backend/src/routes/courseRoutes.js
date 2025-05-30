import express from 'express';
import { getCourseById, getRelatedCourses, getCourses } from '../controllers/courseController.js';
const router = express.Router();

router.get('/related', getRelatedCourses);    // /api/courses/related
router.get('/:id', getCourseById);           // /api/courses/:id
router.get('/', getCourses); // /api/courses

export default router;