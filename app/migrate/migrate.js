const { User, Report, ReportLikes } = require("./associations");
const Article = require("../../feature/article/model/model");

async function autoMigrate() {
  await User.sync();
  await Report.sync();
  await Article.sync();
  await ReportLikes.sync();
  console.log("Auto migration successful");
}

module.exports = autoMigrate;
