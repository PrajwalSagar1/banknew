import { Router } from "express";
import { TransactionController } from "../controllers/transaction.controller";
import { verifyJWT } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { depositSchema, withdrawSchema, transferSchema } from "../schemas/transaction.schema";

const router = Router();

// All transaction routes are protected
router.use(verifyJWT);

router.get("/", TransactionController.getHistory);
router.post("/deposit", validate(depositSchema), TransactionController.deposit);
router.post("/withdraw", validate(withdrawSchema), TransactionController.withdraw);
router.post("/transfer", validate(transferSchema), TransactionController.transfer);

export default router;
