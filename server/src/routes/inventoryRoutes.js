import { Router } from "express";
import {
  reserve,
  release,
  consume,
} from "../controllers/inventoryController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.post("/reserve", reserve);
router.post("/release", release);
router.post("/consume", consume);

export default router;