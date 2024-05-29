const User = require("../../feature/user/model/model");
const Report = require("../../feature/report/model/model");

// Define associations
User.hasMany(Report, { foreignKey: "id_user", as: "reports" });
Report.belongsTo(User, { foreignKey: "id_user", as: "user" });

module.exports = { User, Report };
