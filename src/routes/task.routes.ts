import { Router } from "express";
import TaskController from "../controllers/task.controller.ts";

const router = Router();

router.get("/:userId", TaskController.listByUser);
router.post("/", TaskController.create);
router.put("/updateTask/:id", TaskController.update);
router.delete("/delete/:id", TaskController.delete);

export default router;
