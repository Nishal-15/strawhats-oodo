import { Router } from "express";
import {
  reserve,
  release,
  consume,
  getMovements,
} from "../controllers/inventoryController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.post("/reserve", reserve);
router.post("/release", release);
router.post("/consume", consume);
router.get("/movements/:productId", getMovements);

export default router;