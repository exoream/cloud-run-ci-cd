const { User, Report } = require("././associations");

async function autoMigrate() {
  await User.sync();
  await Report.sync();
  console.log("Auto migration successful");
}

module.exports = autoMigrate;
