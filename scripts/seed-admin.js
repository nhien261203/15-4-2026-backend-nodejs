require("dotenv").config();
const sequelize = require("../src/config/database");
const { User } = require("../src/models");
const { hashPassword } = require("../src/utils/security");

const seedAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected");

    const existingAdmin = await User.findOne({ where: { email: "admin@example.com" } });
    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const passwordHash = hashPassword("admin123");
    const admin = await User.create({
      fullName: "Admin User",
      email: "admin@example.com",
      passwordHash,
      role: "admin"
    });

    console.log("Admin created:", admin.email);
  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    await sequelize.close();
  }
};

seedAdmin();