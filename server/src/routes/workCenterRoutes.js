import { Router } from "express";
import {
  createWorkCenter,
  getWorkCenters,
} from "../controllers/workCenterController.js";
import {
  requireAuth,
  requireRoles,
} from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/", getWorkCenters);

router.post(
  "/",
  requireRoles("ADMIN", "OWNER", "MANUFACTURING"),
  createWorkCenter
);

export default router;