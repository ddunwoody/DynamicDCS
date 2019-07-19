/*
 * DDCS Licensed under AGPL-3.0 by Andrew "Drex" Finegan https://github.com/afinegan/DynamicDCS
 */

const	_ = require('lodash');
const constants = require('../constants');
const exec = require('child_process').exec;
const masterDBController = require('../db/masterDB');
const serverTimerController = require('../action/serverTimer');

exports.timeToRestart = 0;

// Create shutdown function
function shutdown(callback){
	exec('shutdown.exe /r /t 00', function(error, stdout, stderr){ callback(stdout); });
}

_.assign(exports, {
	checkTimeToRestart: (serverName) => {
		var nowTime = new Date().getTime();
		if(exports.timeToRestart !== 0) {
			exports.clearCampaignTables(serverName);
			if(nowTime > exports.timeToRestart) {
				exports.restartServer(serverName);
			}
		}
	},
	clearCampaignTables: (serverName) => {
		console.log('clearTables');
		masterDBController.cmdQueActions('removeall', serverName, {})
			.catch(function (err) {
				console.log('line 29: ', err);
			})
		;
		masterDBController.staticCrateActions('removeall', serverName, {})
			.catch(function (err) {
				console.log('line 34: ', err);
			})
		;
		masterDBController.unitActions('removeall', serverName, {})
			.catch(function (err) {
				console.log('line 39: ', err);
			})
		;
	},
	restartServer: (serverName) => {
		console.log('ALL TABLES CLEARED OFF, restart');
		if(_.get(constants, 'config.fullServerRestartOnCampaignWin', false)) {
			shutdown(function(output){
				console.log(output);
			});
		} else {
			serverTimerController.restartServer(serverName);
		}
	}
});
