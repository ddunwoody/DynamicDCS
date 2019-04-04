/*
 * DDCS Licensed under AGPL-3.0 by Andrew "Drex" Finegan https://github.com/afinegan/DynamicDCS
 */

const _ = require('lodash');
const radioTowerController = require('../action/radioTower');

_.set(exports, 'processFiveMinuteActions', function (serverName, fullySynced) {
	if (fullySynced) { radioTowerController.checkBaseWarnings(serverName); }
});
