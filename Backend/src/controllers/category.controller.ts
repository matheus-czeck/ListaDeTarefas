import { type Request, type Response } from "express";
import { Category } from "../dataBase/models/index.ts";

class CategoryController {
  static async create(req: Request, res: Response): Promise<Response> {
    try {
      const { name, color, userId } = req.body;

      if (!name) {
        return res
          .status(400)
          .json({ error: "O nome da categoria e obrigatorio" });
      }
      const newCategory = await Category.create({ name, color, userId });
      return res.status(201).json(newCategory);
    } catch (error: any) {
      console.error("🔥 ERRO DETALHADO DO BANCO:", error);
      const detalhesDoErro = error.errors
        ? error.errors.map((e: any) => `${e.path} -> ${e.message}`)
        : [];
      return res.status(500).json({
        error: "Erro ao criar categoria",
        tipoDoErro: error.name,
        messagem: error.message,
        campoCulpado: detalhesDoErro,
      });
    }
  }
  static async listByUser(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.params;
      const categories = await Category.findAll({
        where: {
          userId: Number(userId),
        },
      });
      return res.status(200).json(categories);
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: "Ocorreu um erro interno", details: error.message });
    }
  }
}

export default CategoryController;
