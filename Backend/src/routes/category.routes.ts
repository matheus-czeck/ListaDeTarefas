import { Router } from "express";
import CategoryController from "../controllers/category.controller.ts";

const router = Router();

router.get("/:userId", CategoryController.listByUser);
router.post("/", CategoryController.create);

export default router;