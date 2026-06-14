import { Sequelize } from "sequelize";
import path from "path";
import User, { initUser } from "./User.ts";
import Category, { initCategory } from "./Category.ts";
import Task, { initTask } from "./Task.ts";

const caminhoDoBanco = path.resolve(
  process.cwd(),
  "src",
  "dataBase",
  "storage",
  "database.sqlite",
);

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: caminhoDoBanco,
  logging: false,
  define: {
    timestamps: true 
  }
});

initUser(sequelize);
initTask(sequelize);
initCategory(sequelize);

const models: any = {
  User,
  Category,
  Task,
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export { sequelize, User, Category, Task };
export default sequelize;
