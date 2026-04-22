require("dotenv").config();

const sequelize = require("../src/config/database");
const migrations = require("../src/migrations");

async function ensureMetaTable(queryInterface, Sequelize) {
  const tables = await queryInterface.showAllTables();
  const normalized = tables.map((item) => (typeof item === "string" ? item : item.tableName));

  if (normalized.includes("SequelizeMeta")) return;

  await queryInterface.createTable("SequelizeMeta", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
  });
}

async function getExecutedMigrations(queryInterface) {
  const [rows] = await sequelize.query("SELECT name FROM SequelizeMeta ORDER BY name ASC");
  return new Set(rows.map((row) => row.name));
}

async function run() {
  const queryInterface = sequelize.getQueryInterface();
  const Sequelize = sequelize.Sequelize;

  try {
    await sequelize.authenticate();

    await ensureMetaTable(queryInterface, Sequelize);

    const executed = await getExecutedMigrations(queryInterface);
    const pending = migrations.filter((migration) => !executed.has(migration.name));

    if (pending.length === 0) {
      console.log("No pending migrations.");
      process.exit(0);
    }

    for (const migration of pending) {
      console.log(`Running: ${migration.name}`);
      await migration.up(queryInterface, Sequelize);
      await queryInterface.bulkInsert("SequelizeMeta", [{ name: migration.name }]);
    }

    console.log("Migrations completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

run();