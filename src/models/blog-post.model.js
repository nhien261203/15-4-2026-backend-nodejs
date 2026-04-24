const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const BlogPost = sequelize.define(
  "BlogPost",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    excerpt: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'PetShop Team'
    },
    published: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    tableName: 'blog_posts',
    timestamps: true
  }
);

module.exports = BlogPost;