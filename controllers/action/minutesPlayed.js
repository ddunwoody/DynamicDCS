/*
 * DDCS Licensed under AGPL-3.0 by Andrew "Drex" Finegan https://github.com/afinegan/DynamicDCS
 */

const	_ = require('lodash');
const masterDBController = require('../db/masterDB');
const constants = require('../constants');

//move to db eventually
var ratioToSendConvoys = 1.25; //:1

_.assign(exports, {
	checkCurrentPlayerBalance: (serverName) => {
		// set to 2:1 or worse
		return masterDBController.campaignsActions('readLatest', serverName, {})
			.then(function (latestCampaign) {
				let sideState = 0;
				let totalCampaignTime = new Date(_.get(latestCampaign, 'updatedAt')).getTime() - new Date(_.get(latestCampaign, 'createdAt')).getTime();
				// console.log('tct: ', totalCampaignTime);
				if (totalCampaignTime > _.get(constants, 'time.oneHour')) {
					console.log('STACK: Blue:', latestCampaign.totalMinutesPlayed_blue, ' Red:', latestCampaign.totalMinutesPlayed_red);
					if (_.get(latestCampaign, 'name')) {
						if((latestCampaign.totalMinutesPlayed_blue/latestCampaign.totalMinutesPlayed_red) >= ratioToSendConvoys) {
							sideState = 1;
						}
						if((latestCampaign.totalMinutesPlayed_red/latestCampaign.totalMinutesPlayed_blue) >= ratioToSendConvoys) {
							sideState = 2;
						}
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
							console.log('campaignUpdate: Blue: ', totalMinutesPlayed_blue, ' Red: ', totalMinutesPlayed_red);
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
						console.log('sessionUpdate: Blue: ', currentSessionMinutesPlayed_blue, ' Red: ', currentSessionMinutesPlayed_red);
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
		var totalMinsPerSide = {
			"1": 0,
			"2": 0
		};
		masterDBController.sessionsActions('readLatest', serverName, {})
			.then(function (latestSession) {
				var unitsNewThan = new Date().getTime() - _.get(constants, ['time', 'fourMins'], 0);
				// update only people who have played in the last 5 minutes
				masterDBController.srvPlayerActions('read', serverName, {
					sessionName: latestSession.name,
					updatedAt: {$gt: unitsNewThan}
				})
					.then(function (playerArray) {
						// console.log('playersInFiveMinutes: ', playerArray.length);
						var processPromise = [];
						_.forEach(playerArray, function (player) {
							// console.log('isPlayerTimeGreater: ', player.name, new Date(player.updatedAt).getTime() > unitsNewThan, new Date(player.updatedAt).getTime() - unitsNewThan);
							totalMinsPerSide[player.side] = totalMinsPerSide[player.side] + 5;
							processPromise.push(masterDBController.srvPlayerActions('addMinutesPlayed', serverName, {
								_id: player._id,
								minutesPlayed: 5,
								side: player.side
							}));
						});
						Promise.all(processPromise)
							.then(function() {
								exports.updateSession(serverName, latestSession);
							})
							.catch(function() {
								console.log('err line133: ', err);
							})
						;
						console.log('PlayerFiveMinCount: ', totalMinsPerSide);
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
							console.log('mins reset');
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
