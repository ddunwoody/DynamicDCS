/*
 * DDCS Licensed under AGPL-3.0 by Andrew "Drex" Finegan https://github.com/afinegan/DynamicDCS
 */

const	_ = require('lodash');
const constants = require('../constants');
const masterDBController = require('../db/masterDB');
const minutesPlayedController = require('../action/minutesPlayed');
const groupController = require('../spawn/group');

_.assign(exports, {
	maintainPvEConfig: (serverName) => {
		var promiseStack = [];
		return exports.campaignStackTypes(serverName)
			.then(function (stackObj) {
				var lockedStack;
				_.forEach(_.get(constants, 'config.pveAIConfig', []), (pveConfig) => {
					lockedStack = false;
					_.forEach(_.get(pveConfig, 'config', []), (AIConfig) => {
						if(AIConfig.functionCall === 'fullAIEnabled') {
							exports.processAI(serverName, {underdog: 1}, AIConfig);
							exports.processAI(serverName, {underdog: 2}, AIConfig);
						} else {
							var sideStackedAgainst = _.get(stackObj, [AIConfig.functionCall], {});
							//get stats
							// console.log('mt: ', sideStackedAgainst.ratio, ' >= ', AIConfig.stackTrigger);
							if(sideStackedAgainst.ratio >= AIConfig.stackTrigger && !lockedStack) {
								lockedStack = true;
								// console.log('processing pveAI: ', AIConfig.desc);
								return exports.processAI(serverName, sideStackedAgainst, AIConfig);
							} else {
								return true;
							}
						}
					});
				});
				return Promise.all(promiseStack);
			})
			.catch(function (err) {
				console.log('err line24: ', err);
			})
		;
	},
	campaignStackTypes: (serverName) => {
		var promiseArray = [];
		var stackObj = {};
		promiseArray.push(minutesPlayedController.checkCurrentPlayerBalance(serverName)
			.then(function(sideStackedAgainst) {
				_.set(stackObj, 'fullCampaignStackStats', sideStackedAgainst);
			})
			.catch(function (err) {
				console.log('err line37: ', err);
			}))
		;
		return Promise.all(promiseArray)
			.then(function() {
				return stackObj;
			})
			.catch(function (err) {
				console.log('err line53: ', err);
			})
		;
	},
	processAI: (serverName, sideStackedAgainst, AIConfig) => {
		console.log('sideStackedAgainst: ', sideStackedAgainst);
		if (sideStackedAgainst.underdog > 0) {
			masterDBController.baseActions('read', serverName, {baseType: "MOB", side: sideStackedAgainst.underdog, enabled: true})
				.then(function (friendlyBases) {
					exports.checkBasesToSpawnConvoysFrom(serverName, friendlyBases, AIConfig);
				})
				.catch(function (err) {
					console.log('err line51: ', err);
				})
			;
		}
	},
	checkBasesToSpawnConvoysFrom: (serverName, friendlyBases, AIConfig) => {
		// console.log('convoyTest: ', serverName, AIConfig);
		_.forEach(friendlyBases,(base) => {
			_.forEach(_.get(base, ['polygonLoc', 'convoyTemplate']), (baseTemplate) => {
				//spawn ground convoys
				//1 point route is a non-transversable route for ground units
				if (AIConfig.AIType === 'groundConvoy' && _.get(baseTemplate, 'route', []).length > 1) {
					masterDBController.baseActions('read', serverName, {
						_id: _.get(baseTemplate, 'destBase'),
						side: _.get(constants, ['enemyCountry', _.get(base, 'side', 0)]),
						enabled: true
					})
						.then(function (destBaseInfo) {
							if (destBaseInfo.length > 0) {
								var curBase = _.first(destBaseInfo);
								//check if convoy exists first
								var baseConvoyGroupName = 'AI|' + AIConfig.name + '|' + _.get(baseTemplate, 'sourceBase') + '_' + _.get(baseTemplate, 'destBase') + '|';
								masterDBController.unitActions('read', serverName, {
									groupName: baseConvoyGroupName,
									isCrate: false,
									dead: false
								})
									.then(function (convoyGroup) {
										if (convoyGroup.length === 0) {
											//respawn convoy because it doesnt exist
											console.log('convoy ', _.get(base, 'name'), ' attacking ', _.get(curBase, 'name'));
											var mesg = 'C: A convoy just left ' + _.get(base, 'name') + ' is attacking ' + _.get(curBase, 'name');
											groupController.spawnConvoy(serverName, baseConvoyGroupName, _.get(base, 'side', 0), baseTemplate, AIConfig, mesg);
										}
									})
									.catch(function (err) {
										console.log('err line94: ', err);
									})
								;
							}
						})
						.catch(function (err) {
							console.log('err line100: ', err);
						})
					;
				}
				if ( AIConfig.AIType === 'CAPDefense' ) {
					masterDBController.baseActions('read', serverName, {
						_id: _.get(baseTemplate, 'destBase'),
						side: _.get(constants,['enemyCountry', _.get(base, 'side', 0)]),
						enabled: true
					})
						.then(function (destBaseInfo) {
							if(destBaseInfo.length > 0) {
								var curBase = _.first(destBaseInfo);
								//check if convoy exists first
								var baseCapGroupName = 	'AI|' + AIConfig.name + '|' + _.get(base,'name') + '|';
								masterDBController.unitActions('read', serverName, {groupName: baseCapGroupName, isCrate: false, dead: false})
									.then(function(capGroup) {
										if(capGroup.length === 0) {
											console.log('RESPAWNCAP: ', baseCapGroupName, capGroup.length);
											//respawn convoy because it doesnt exist
											var mesg = 'C: A CAP Defense spawned at ' + _.get(base,'name');
											//console.log('capSpawn: ', serverName, baseConvoyGroupName, _.get(base, 'side', 0), baseTemplate, AIConfig, mesg);
											groupController.spawnCAPDefense(serverName, baseCapGroupName, _.get(base, 'side', 0), base, AIConfig, mesg);
										} else {
											console.log('SKIPCAP: ', baseCapGroupName, capGroup.length);
										}
									})
									.catch(function (err) {
										console.log('err line94: ', err);
									})
								;
							}
						})
						.catch(function (err) {
							console.log('err line100: ', err);
						})
					;
				}
			});
		});
	}
});
