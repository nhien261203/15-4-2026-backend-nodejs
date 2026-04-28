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

    // 2. Schema management is handled by migrations.
    //    Avoid sequelize.sync({ alter: true }) here to prevent duplicate ALTER operations.
    //    Run `npm run migrate` separately after schema changes.

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