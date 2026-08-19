import { Router } from "express";
import {
  createBoM,
  getBoMs,
  assignWorkCenters,
} from "../controllers/bomController.js";
import { requireAuth, requireRoles } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/", getBoMs);

router.patch(
  "/operations/work-centers",
  requireRoles("ADMIN", "OWNER", "MANUFACTURING"),
  assignWorkCenters
);

router.post(
  "/",
  requireRoles("ADMIN", "OWNER", "MANUFACTURING"),
  createBoM
);

export default router;