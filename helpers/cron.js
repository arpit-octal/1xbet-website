const cron = require("node-cron");
const cronServices = require('../services/cron/cron.services');
var crons = {
	start_jobs: async () => {
		// var beForeInPlayUpdate = cron.schedule("*/5 * * * * *", cronServices.beForeInPlayUpdate);
		// beForeInPlayUpdate.start();

		// var getFancyData = cron.schedule("*/1 * * * * *", cronServices.getFancyData);
		// getFancyData.start();

		// var getPremiumFancyData = cron.schedule("*/1 * * * * *", cronServices.getPremiumFancyData);
		// getPremiumFancyData.start();

		// var getBetFairSocketData = cron.schedule("*/1 * * * * *", cronServices.getBetFairSocketData);
		// getBetFairSocketData.start();

		// var autoResultDeclare = cron.schedule("0 */1 * * * *", cronServices.autoResultDeclare);
		// autoResultDeclare.start();
		console.log("cron job started")
		var rollbackCasinoAmount = cron.schedule("0 */8 * * *", cronServices.rollbackCasinoAmount);
		//var rollbackCasinoAmount = cron.schedule("* * * * *", cronServices.rollbackCasinoAmount);
		rollbackCasinoAmount.start();

	},
};
module.exports = crons;