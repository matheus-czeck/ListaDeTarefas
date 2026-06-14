import { type Request, type Response } from "express";
import Task from "../dataBase/models/Task.ts";
import Category from "../dataBase/models/Category.ts";

class TaskController {
  static async create(req: Request, res: Response): Promise<Response> {
    try {
      const { title, description, dueDate, priority, userId, categoryId } =
        req.body;

      if (!title || !dueDate || !userId || !categoryId) {
        return res.status(400).json({
          error: "Campos obrigatorios: title, dueDate, userId e categoryId",
        });
      }
      const newTask = await Task.create({
        title,
        description,
        dueDate,
        priority,
        userId,
        categoryId,
      });
      return res.status(201).json(newTask);
    } catch (error: any) {
      return res.status(500).json({
        error: "Erro interno ao criar tarefa",
        details: error.message,
      });
    }
  }

  static async listByUser(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.params;

      const task = await Task.findAll({
        where: {
          userId: Number(userId),
        },
        include: [
          {
            model: Category,
            as: "category",
            attributes: ["id", "name", "color"],
          },
        ],
        order: [["dueDate", "ASC"]],
      });

      return res.json(task);
    } catch (error: any) {
      return res.status(500).json({
        error: "Error interno ao buscar tarefas",
        details: error.message,
      });
    }
  }

  static async update(req: Request, res: Response):Promise<Response>{
    try{
        const {id} = req.params;
        const { title, description, dueDate, status, priority, categoryId } = req.body;

        const task = await Task.findByPk(id);

        if(!task){
            return res.status(404).json({ error: "Tarefa nao encontrada."})
        }

        await task.update({
            title: title ?? task.title,
            description: description ?? task.description,
            dueDate: dueDate ?? task.dueDate,
            status: status ?? task.status,
            priority: priority ?? task.priority,
            categoryId: categoryId ?? task.categoryId,

        })

    }
  }
}

export default TaskController;
