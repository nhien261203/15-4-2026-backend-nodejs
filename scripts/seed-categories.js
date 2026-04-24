require("dotenv").config();
const sequelize = require("../src/config/database");
const { Category } = require("../src/models");

const seedCategories = async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected");

    const categories = [
      { name: "Dog", type: "pet" },
      { name: "Cat", type: "pet" },
      { name: "Food", type: "product" },
      { name: "Toys", type: "product" },
      { name: "Accessories", type: "product" },
      { name: "Grooming", type: "product" },
      { name: "Health", type: "product" },
    ];

    for (const cat of categories) {
      const existing = await Category.findOne({ where: { name: cat.name } });
      if (!existing) {
        await Category.create(cat);
        console.log(`Created category: ${cat.name}`);
      } else {
        console.log(`Category ${cat.name} already exists`);
      }
    }

    console.log("Categories seeded successfully");
  } catch (error) {
    console.error("Error seeding categories:", error);
  } finally {
    await sequelize.close();
  }
};

seedCategories();