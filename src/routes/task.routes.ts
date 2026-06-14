import { Router } from "express";
import TaskController from "../controllers/task.controller.ts";

const router = Router();

router.get("/:userId", TaskController.listByUser);
router.post("/", TaskController.create);

export default router;
