require("dotenv").config();
const sequelize = require("../src/config/database");
const seedBlogPosts = require("./seed-blog");

const runSeeder = async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected");

    // Sync all models
    await sequelize.sync();

    await seedBlogPosts();

  } catch (error) {
    console.error("Error running seeder:", error);
  } finally {
    await sequelize.close();
  }
};

runSeeder();