/*
 * DDCS Licensed under AGPL-3.0 by Andrew "Drex" Finegan https://github.com/afinegan/DynamicDCS
 */

const _ = require('lodash');
const radioTowerController = require('../action/radioTower');
const hoursPlayedController = require('../action/hoursPlayed');

_.set(exports, 'processFiveMinuteActions', function (serverName, fullySynced) {
	if (fullySynced) {
		radioTowerController.checkBaseWarnings(serverName);
		hoursPlayedController.recordFiveMinutesPlayed(serverName);
	}
});
