import { Model, DataTypes } from "sequelize";
class Task extends Model {
  declare id: number;
  declare title: string;
  declare description: string | null;
  declare dueDate: Date;
  declare status: "PENDING" | "COMPLETED";
  declare priority: "LOW" | "MEDIUM" | "HIGH";
  declare userId: number;
  declare categoryId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static associate(models: any) {
    Task.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });

    Task.belongsTo(models.Category, {
      foreignKey: "categoryId",
      as: "category",
    });
  }
}
export function initTask(sequelize: any) {
  Task.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM("PENDING", "COMPLETED"),
        allowNull: false,
        defaultValue: "PENDING",
      },
      priority: {
        type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH"),
        allowNull: false,
        defaultValue: "MEDIUM",
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "Task",
      tableName: "tasks",
    },
  );
}
export default Task;
