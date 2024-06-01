import express from 'express';
import { indexView } from './controller.mjs';
const router = express.Router();

router.get("/", indexView);

export default router;