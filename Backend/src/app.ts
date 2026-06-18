import express from "express";
import categoryRoutes from "./routes/category.routes.ts";
import taskyRoutes from "./routes/task.routes.ts";
import userRoutes from "./routes/user.routes.ts";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/categories", categoryRoutes);
app.use("/task", taskyRoutes);
app.use("/user", userRoutes);

export default app;
