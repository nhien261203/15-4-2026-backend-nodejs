require("dotenv").config();

const app = require("./src/app");
const sequelize = require("./src/config/database");

// load models
require("./src/models");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // 1. Connect DB
    await sequelize.authenticate();
    console.log("✅ DB connected");

    // 2. Sync tables
    await sequelize.sync({ alter: true });
    console.log("✅ Tables synced");

    // 3. Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
};

startServer();