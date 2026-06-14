import express from "express"
import categoryRoutes from './routes/category.routes.ts'
import taskyRoutes from './routes/task.routes.ts'
const app = express()

app.use(express.json());
app.use("/categories", categoryRoutes)
app.use("/tarefas", taskyRoutes)




export default app;
