import { Router } from "express";

import { createUser } from "../controllers/userController.js";

import {
  requireAuth,
  requireRoles,
} from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

// Only ADMIN can create users and assign roles
router.post(
  "/",
  requireRoles("ADMIN"),
  createUser
);

export default router;