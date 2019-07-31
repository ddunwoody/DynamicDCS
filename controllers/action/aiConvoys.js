/*
 * DDCS Licensed under AGPL-3.0 by Andrew "Drex" Finegan https://github.com/afinegan/DynamicDCS
 */

const	_ = require('lodash');
const constants = require('../constants');
const masterDBController = require('../db/masterDB');
const minutesPlayedController = require('../action/minutesPlayed');
const groupController = require('../spawn/group');

_.assign(exports, {
	checkForServerImbalance: (serverName) => {
		return minutesPlayedController.checkCurrentPlayerBalance(serverName)
			.then(function(sideStackedAgainst) {
				console.log('sideStackedAgainst: ', sideStackedAgainst);
				if (sideStackedAgainst > 0) {
					masterDBController.baseActions('read', serverName, {baseType: "MOB", side: sideStackedAgainst, enabled: true})
						.then(function (friendlyBases) {
							// console.log('friendlyBases');
							exports.checkBasesToSpawnConvoysFrom(serverName, friendlyBases);
						})
						.catch(function (err) {
							console.log('err line26: ', err);
						})
					;
				}
			})
			.catch(function (err) {
				console.log('err line26: ', err);
			})
		;
	},
	checkBasesToSpawnConvoysFrom: (serverName, friendlyBases) => {
		_.forEach(friendlyBases,(base) => {
			_.forEach(_.get(base, ['polygonLoc', 'convoyTemplate']), (baseTemplate) => {
				masterDBController.baseActions('read', serverName, {_id: _.get(baseTemplate, 'destBase'), side: _.get(constants,['enemyCountry', _.get(base, 'side', 0)]), enabled: true})
					.then(function (destBaseInfo) {
						if(destBaseInfo.length > 0) {
							var curBase = _.first(destBaseInfo);
							//check if convoy exists first
							var baseConvoyGroupName = 	'AI|CONVOY|' + _.get(baseTemplate, 'sourceBase') + '_' + _.get(baseTemplate, 'destBase') + '|';
							masterDBController.unitActions('read', serverName, {groupName: baseConvoyGroupName, isCrate: false, dead: false})
								.then(function(convoyGroup) {
									if(convoyGroup.length === 0) {
										//respawn convoy because it doesnt exist
										console.log('convoy ', _.get(base,'name'), ' attacking ', _.get(curBase, 'name'));
										var mesg = 'C: A convoy just left ' + _.get(base,'name') + ' is attacking ' + _.get(curBase, 'name');
										groupController.spawnConvoy(serverName, baseConvoyGroupName, _.get(base, 'side', 0), baseTemplate, mesg);
									}
								})
								.catch(function (err) {
									console.log('err line26: ', err);
								})
							;
						}
					})
					.catch(function (err) {
						console.log('err line26: ', err);
					})
				;
			});
		});
	}
});
