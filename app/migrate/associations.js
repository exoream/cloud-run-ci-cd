const User = require("../../feature/user/model/model");
const { Report, ReportLikes }= require("../../feature/report/model/model");

// Define associations
User.hasMany(Report, { foreignKey: "id_user", as: "reports" });
Report.belongsTo(User, { foreignKey: "id_user", as: "user" });

ReportLikes.belongsTo(User, { foreignKey: "id_user", as: "user" });
ReportLikes.belongsTo(Report, { foreignKey: "id_report", as: "report" });

module.exports = { User, Report, ReportLikes };
