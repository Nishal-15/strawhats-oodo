import { Router } from "express";
import { login, logout, me } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import { loginSchema } from "../validators/auth.js";

const router = Router();

router.post("/login", (req, res, next) => {
  try {
    req.body = loginSchema.parse(req.body);
    return login(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post("/logout", logout);
router.get("/me", requireAuth, me);

export default router;
