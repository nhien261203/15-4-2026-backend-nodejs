require("dotenv").config();

const sequelize = require("../src/config/database");
const migrations = require("../src/migrations");

async function run() {
  const queryInterface = sequelize.getQueryInterface();
  const Sequelize = sequelize.Sequelize;

  try {
    await sequelize.authenticate();

    const [rows] = await sequelize.query("SELECT name FROM SequelizeMeta ORDER BY name DESC LIMIT 1");

    if (!rows.length) {
      console.log("No migration to rollback.");
      process.exit(0);
    }

    const migrationName = rows[0].name;
    const migration = migrations.find((item) => item.name === migrationName);

    if (!migration) {
      throw new Error(`Migration file not found for ${migrationName}`);
    }

    console.log(`Rolling back: ${migration.name}`);
    await migration.down(queryInterface, Sequelize);
    await sequelize.query("DELETE FROM SequelizeMeta WHERE name = :name", {
      replacements: { name: migration.name },
    });

    console.log("Rollback completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Rollback failed:", error);
    process.exit(1);
  }
}

run();