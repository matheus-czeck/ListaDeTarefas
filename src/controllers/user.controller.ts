import { type Request, type Response } from "express";
import User from "../dataBase/models/User.ts";
import bcrypt from "bcrypt";

class UserController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({
          error: "Campos obrigatorios: nome, email e senha!",
        });
        return;
      }

      const userExists = await User.findOne({
        where: { email },
      });
      if (userExists) {
        res.status(400).json({ error: "Este e-mail ja esta em uso!" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      res.status(201).json({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      });
    } catch (error: any) {
      res.status(500).json({
        error: "Erro interno do servidor!",
        details: error.message,
      });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: "Email e Senha sao obrigatorios!" });
        return;
      }
      const user = await User.findOne({
        where: { email },
      });
      if (!user) {
        res.status(401).json({ error: "E-mail ou senha invalidos!" });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ error: "E-mail ou senha invalidos!" });
        return;
      }

      res.json({
        message: "Login realizado com sucesso!",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        error: "Erro ao fazer login!",
        details: error.message,
      });
    }
  }
}

export default UserController;
