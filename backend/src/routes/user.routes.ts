import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { verifyJWT } from "../middleware/auth.middleware";

const router = Router();

// Protected route to get current user details
router.get("/me", verifyJWT, UserController.getMe);

export default router;
