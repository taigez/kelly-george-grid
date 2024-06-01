import express from 'express';
import { indexView, chineseView } from './controller.mjs';
const router = express.Router();

router.get("/", indexView);
router.get("/cn", chineseView);

export default router;