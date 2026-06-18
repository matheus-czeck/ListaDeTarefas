import { Model, DataTypes } from "sequelize";

class Category extends Model {
  declare id: number;
  declare name: string;
  declare color: string;
  declare userId: number
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static associate(models: any) {
    Category.hasMany(models.Task, {
      foreignKey: "categoryId",
      as: "tasks",
    });

    Category.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    })
  }
}
export function initCategory(sequelize: any) {
  Category.init(
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
      color: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "#3B82F6",
      },
      userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }
    },
    {
      sequelize,
      modelName: "Category",
      tableName: "categories",
      timestamps: true,
    },
  );
}

export default Category;
