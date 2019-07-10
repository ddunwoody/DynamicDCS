/*
 * DDCS Licensed under AGPL-3.0 by Andrew "Drex" Finegan https://github.com/afinegan/DynamicDCS
 */

const	_ = require('lodash');
const masterDBController = require('../db/masterDB');

_.assign(exports, {
	checkCurrentPlayerBalance: (serverName) => {
		masterDBController.statSessionActions('readLatest', serverName, {})
			.then(function (latestSession) {
				let sideState = 'balance';
				if (latestSession.name) {
					if((latestSession.totalMinutesPlayed_blue/latestSession.totalMinutesPlayed_red) < 2) {
						sideState = blueStack
					}
					if((latestSession.totalMinutesPlayed_red/latestSession.totalMinutesPlayed_blue) < 2) {
						sideState = redStack
					}
				}
				return sideState;
			})
			.catch(function (err) {
				console.log('err line26: ', err);
			})
		;
	},
	updateStatSession: (serverName, sessionName) => {
		masterDBController.srvPlayerActions('read', serverName, {sessionName: sessionName})
			.then(function (playerArray) {
				let currentSessionMinutesPlayed_blue = 0;
				let currentSessionMinutesPlayed_red = 0;
				_.forEach(playerArray, (pa) => {
					currentSessionMinutesPlayed_blue += _.get(pa, 'currentSessionMinutesPlayed_blue', 0);
					currentSessionMinutesPlayed_red += _.get(pa, 'currentSessionMinutesPlayed_red', 0);
				});
				masterDBController.statSessionActions('update', serverName, {
					name: sessionName,
					totalMinutesPlayed_blue: currentSessionMinutesPlayed_blue,
					totalMinutesPlayed_red: currentSessionMinutesPlayed_red
				});
			})
			.catch(function (err) {
				console.log('err line17: ', err);
			})
		;
	},
	recordFiveMinutesPlayed: (serverName) => {
		masterDBController.statSessionActions('readLatest', serverName, {})
			.then(function (latestSession) {
				masterDBController.srvPlayerActions('read', serverName, {sessionName: latestSession.name})
					.then(function (playerArray) {
						_.forEach(playerArray, function (player) {
							masterDBController.srvPlayerActions('addMinutesPlayed', serverName, {
								_id: player._id,
								minutesPlayed: 5,
								side: player.side
							});
						});
						exports.updateStatSession(serverName, latestSession);
					})
					.catch(function (err) {
						console.log('err line62: ', err);
					})
				;
			})
			.catch(function (err) {
				console.log('err line67: ', err);
			})
		;
	},
	resetHoursPlayed: (serverName) => {
		masterDBController.statSessionActions('readLatest', serverName, {})
			.then(function (latestSession) {
				masterDBController.srvPlayerActions('read', serverName, {sessionName: latestSession.name})
					.then(function (playerArray) {
						_.forEach(playerArray, function (player) {
							masterDBController.srvPlayerActions('resetMinutesPlayed', serverName, {
								_id: player._id,
								side: player.side
							});
						});
					})
					.catch(function (err) {
						console.log('err line84: ', err);
					})
				;
			})
			.catch(function (err) {
				console.log('err line89: ', err);
			})
		;
	}
});
