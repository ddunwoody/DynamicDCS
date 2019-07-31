/*
 * DDCS Licensed under AGPL-3.0 by Andrew "Drex" Finegan https://github.com/afinegan/DynamicDCS
 */

const _ = require('lodash');
const userLivesController = require('../action/userLives');
const repairController = require('../menu/repair');
const aiConvoysController = require('../action/aiConvoys');

_.set(exports, 'processTenMinuteActions', function (serverName, fullySynced) {
	if (fullySynced) {
		userLivesController.updateServerLifePoints(serverName);
		repairController.repairBaseSAMRadars(serverName);
		/*
		aiConvoysController.checkForServerImbalance(serverName)
			.catch(function (err) {
				console.log('err line16: ', err);
			})
		;
		 */
	}
});
