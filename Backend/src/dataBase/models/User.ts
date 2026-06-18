import { DataTypes, Model } from "sequelize";

class User extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
 


  static associate(models: any) {
    User.hasMany(models.Task, {
      foreignKey: "userId",
      as: "tasks",
    });
    User.hasMany(models.Category, {
      foreignKey: "userId",
      as: "categories",
    });
  }
}
export function initUser(sequelize: any) {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    {
      sequelize,
      modelName: "Users",
      tableName: "users",
    },
  );
}

export default User;
