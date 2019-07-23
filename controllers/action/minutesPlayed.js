/*
 * DDCS Licensed under AGPL-3.0 by Andrew "Drex" Finegan https://github.com/afinegan/DynamicDCS
 */

const	_ = require('lodash');
const masterDBController = require('../db/masterDB');
const constants = require('../constants');

_.assign(exports, {
	checkCurrentPlayerBalance: (serverName) => {
		masterDBController.sessionsActions('readLatest', serverName, {})
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
	updateLatestCampaign: (serverName) => {
		masterDBController.campaignsActions('readLatest', serverName, {})
			.then(function (campaign) {
				if (campaign) {
					masterDBController.sessionsActions('read', serverName, {campaignName: campaign.name})
						.then(function (campSessions) {
							let totalMinutesPlayed_blue = 0;
							let totalMinutesPlayed_red = 0;
							_.forEach(campSessions, (pa) => {
								totalMinutesPlayed_blue += _.get(pa, 'totalMinutesPlayed_blue', 0);
								totalMinutesPlayed_red += _.get(pa, 'totalMinutesPlayed_red', 0);
							});
							masterDBController.campaignsActions('update', serverName, {
								name: campaign.name,
								totalMinutesPlayed_blue: totalMinutesPlayed_blue,
								totalMinutesPlayed_red: totalMinutesPlayed_red
							});
						})
						.catch(function (err) {
							console.log('line54', err);
						})
					;
				}
			})
			.catch(function (err) {
				console.log('line60', err);
			})
		;
	},
	updateSession: (serverName, sessionName) => {
		masterDBController.srvPlayerActions('read', serverName, {sessionName: sessionName})
			.then(function (playerArray) {
				let currentSessionMinutesPlayed_blue = 0;
				let currentSessionMinutesPlayed_red = 0;
				_.forEach(playerArray, (pa) => {
					currentSessionMinutesPlayed_blue += _.get(pa, 'currentSessionMinutesPlayed_blue', 0);
					currentSessionMinutesPlayed_red += _.get(pa, 'currentSessionMinutesPlayed_red', 0);
				});
				masterDBController.sessionsActions('update', serverName, {
					name: sessionName,
					totalMinutesPlayed_blue: currentSessionMinutesPlayed_blue,
					totalMinutesPlayed_red: currentSessionMinutesPlayed_red
				})
					.then(function() {
						exports.updateLatestCampaign(serverName);
					})
					.catch(function (err) {
						console.log('err line49: ', err);
					})
				;
			})
			.catch(function (err) {
				console.log('err line17: ', err);
			})
		;
	},
	recordFiveMinutesPlayed: (serverName) => {
		masterDBController.sessionsActions('readLatest', serverName, {})
			.then(function (latestSession) {
				var unitsNewThan = new Date().getTime() - _.get(constants, ['time', 'fourMins'], 0);
				// update only people who have played in the last 5 minutes
				masterDBController.srvPlayerActions('read', serverName, {
					sessionName: latestSession.name,
					updatedAt: {$gt: unitsNewThan}
				})
					.then(function (playerArray) {
						console.log('playersInFiveMinutes: ', playerArray.length);
						_.forEach(playerArray, function (player) {
							console.log('isPlayerTimeGreater: ', player.name, new Date(player.updatedAt).getTime() > unitsNewThan, new Date(player.updatedAt).getTime() - unitsNewThan);
							masterDBController.srvPlayerActions('addMinutesPlayed', serverName, {
								_id: player._id,
								minutesPlayed: 5,
								side: player.side
							})
								.then(function() {
									exports.updateSession(serverName, latestSession);
								})
								.catch(function (err) {
									console.log('err line62: ', err);
								})
							;
						})
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
	resetMinutesPlayed: (serverName) => {
		masterDBController.sessionsActions('readLatest', serverName, {})
			.then(function (latestSession) {
				if (latestSession) {
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
				}
			})
			.catch(function (err) {
				console.log('err line89: ', err);
			})
		;
	}
});
