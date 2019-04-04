/*
 * DDCS Licensed under AGPL-3.0 by Andrew "Drex" Finegan https://github.com/afinegan/DynamicDCS
 */

const _ = require('lodash');
const userLivesController = require('../action/userLives');
const groupController = require('../menu/repair');

_.set(exports, 'processTenMinuteActions', function (serverName, fullySynced) {
	if (fullySynced) {
		userLivesController.updateServerLifePoints(serverName);
		groupController.repairBaseSAMRadars(serverName);
	}
});
