const User = require("./user.model");
const Category = require("./category.model");
const Pet = require("./pet.model");
const Product = require("./product.model");
const Order = require("./order.model");
const OrderItem = require("./order-item.model");

Category.hasMany(Pet, { foreignKey: "categoryId", onDelete: "SET NULL" });
Pet.belongsTo(Category, { foreignKey: "categoryId" });

Category.hasMany(Product, { foreignKey: "categoryId", onDelete: "SET NULL" });
Product.belongsTo(Category, { foreignKey: "categoryId" });

User.hasMany(Order, { foreignKey: "userId", onDelete: "CASCADE" });
Order.belongsTo(User, { foreignKey: "userId" });

Order.hasMany(OrderItem, { foreignKey: "orderId", onDelete: "CASCADE" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

module.exports = {
  User,
  Category,
  Pet,
  Product,
  Order,
  OrderItem,
};