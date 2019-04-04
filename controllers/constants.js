/*
 * DDCS Licensed under AGPL-3.0 by Andrew "Drex" Finegan https://github.com/afinegan/DynamicDCS
 */

const _ = require('lodash');
const masterDBController = require('./db/masterDB');

_.assign(exports, {
	blueCountrys: [
		'AUSTRALIA',
		'AUSTRIA',
		'BELGIUM',
		'BULGARIA',
		'CANADA',
		'CROATIA',
		'CHEZH_REPUBLI',
		'DENMARK',
		'IRAQ',
		'GEORGIA',
		'GERMANY',
		'GREECE',
		'INDIA',
		'ITALY',
		'NORWAY',
		'POLAND',
		'SOUTH_KOREA',
		'SPAIN',
		'SWEDEN',
		'SWITZERLAND',
		'THE_NETHERLANDS',
		'SWITZERLAND',
		'UK',
		'USA',
		'KAZAKHSTAN',
		'UKRAINE',
		'INSURGENTS',
	],
	countryId: [
		'RUSSIA',
		'UKRAINE',
		'USA',
		'TURKEY',
		'UK',
		'FRANCE',
		'GERMANY',
		'AGGRESSORS',
		'CANADA',
		'SPAIN',
		'THE_NETHERLANDS',
		'BELGIUM',
		'NORWAY',
		'DENMARK',
		'ISRAEL',
		'GEORGIA',
		'INSURGENTS',
		'ABKHAZIA',
		'SOUTH_OSETIA',
		'ITALY',
		'AUSTRALIA',
		'SWITZERLAND',
		'AUSTRIA',
		'BELARUS',
		'BULGARIA',
		'CHEZH_REPUBLIC',
		'CHINA',
		'CROATIA',
		'EGYPT',
		'FINLAND',
		'GREECE',
		'HUNGARY',
		'INDIA',
		'IRAN',
		'IRAQ',
		'JAPAN',
		'KAZAKHSTAN',
		'NORTH_KOREA',
		'PAKISTAN',
		'POLAND',
		'ROMANIA',
		'SAUDI_ARABIA',
		'SERBIA',
		'SLOVAKIA',
		'SOUTH_KOREA',
		'SWEDEN',
		'SYRIA',
		'YEMEN',
		'VIETNAM',
		'VENEZUELA',
		'TUNISIA',
		'THAILAND',
		'SUDAN',
		'PHILIPPINES',
		'MOROCCO',
		'MEXICO',
		'MALAYSIA',
		'LIBYA',
		'JORDAN',
		'INDONESIA',
		'HONDURAS',
		'ETHIOPIA',
		'CHILE',
		'BRAZIL',
		'BAHRAIN',
		'THIRDREICH',
		'YUGOSLAVIA',
		'USSR',
		'ITALIAN_SOCIAL_REPUBLIC',
		'ALGERIA',
		'KUWAIT',
		'QATAR',
		'OMAN',
		'UNITED_ARAB_EMIRATES'
	],
	defCountrys: {
		1: 'RUSSIA',
		2: 'USA'
	},
	enemyCountry: {
		1: 2,
		2: 1
	},
	maxLifePoints: 18,
	redCountrys: [
		'ABKHAZIA',
		'BELARUS',
		'CHINA',
		'EGYPT',
		'FINLAND',
		'HUNGARY',
		'IRAN',
		'FRANCE',
		'ISRAEL',
		'JAPAN',
		'NORTH_KOREA',
		'PAKISTAN',
		'ROMANIA',
		'RUSSIA',
		'SAUDI_ARABIA',
		'SERBIA',
		'SLOVAKIA',
		'SOUTH_OSETIA',
		'SYRIA',
		'ALGERIA',
		'KUWAIT',
		'QATAR',
		'OMAN',
		'UNITED_ARAB_EMIRATES',
		'TURKEY',
		'AGGRESSORS'
	],
	seasons: [
		'Autumn',
		'Spring',
		'Summer',
		'Winter'
	],
	side: [
		"neutral",
		"red",
		"blue"
	],
	shortNames: {
		players: 'TR',
		friendly_fire: 'FF',
		self_kill: 'SK',
		connect: 'C',
		disconnect: 'D',
		S_EVENT_SHOT: 'ST',
		S_EVENT_HIT: 'HT',
		S_EVENT_TAKEOFF: 'TO',
		S_EVENT_LAND: 'LA',
		S_EVENT_CRASH: 'CR',
		S_EVENT_EJECTION: 'EJ',
		S_EVENT_REFUELING: 'SR',
		S_EVENT_DEAD: 'D',
		S_EVENT_PILOT_DEAD: 'PD',
		S_EVENT_REFUELING_STOP: 'RS',
		S_EVENT_BIRTH: 'B',
		S_EVENT_PLAYER_ENTER_UNIT: 'EU',
		S_EVENT_PLAYER_LEAVE_UNIT: 'LU'
	},
	time: {
		sec: 1000,
		twoSec: 2 * 1000,
		fifteenSecs: 15 * 1000,
		fiveMins: 5 * 60 * 1000,
		fiveSecs: 5 * 1000,
		oneHour: 60 * 60 * 1000,
		oneMin: 60 * 1000,
		thirtySecs: 30 * 1000,
		tenMinutes: 10 * 60 * 1000
	},
	getBases: function (serverName) {
		return masterDBController.baseActions('read', serverName)
			.then(function (bases) {
				return new Promise(function (resolve) {
					if (bases.length) {
						// console.log('bases: ', bases);
						resolve(bases);
					} else {
						console.log('Rebuilding Base DB');
						var actionObj = {actionObj: {action: "GETPOLYDEF"}, queName: 'clientArray'};
						masterDBController.cmdQueActions('save', serverName, actionObj)
							.catch(function (err) {
								console.log('erroring line790: ', err);
							})
						;
						resolve('rebuild base DB');
					}
				});
			})
			.catch(function (err) {
				console.log('err line110: ', err);
			})
			;
	},
	getServer: function ( serverName ) {
		return masterDBController.serverActions('read', {_id: serverName})
			.then(function (server) {
				return new Promise(function (resolve) {
					resolve(_.first(server));
				});
			})
			.catch(function (err) {
				console.log('err line101: ', err);
			})
			;
	},
	getStaticDictionary: function () {
		return masterDBController.staticDictionaryActions('read')
			.then(function (staticDic) {
				return new Promise(function (resolve) {
					resolve(staticDic);
				});
			})
			.catch(function (err) {
				console.log('err line297: ', err);
			})
			;
	},
	getUnitDictionary: function (curTimePeriod) {
		return masterDBController.unitDictionaryActions('read', {timePeriod: curTimePeriod})
			.then(function (unitsDic) {
				return new Promise(function (resolve) {
					resolve(unitsDic);
				});
			})
			.catch(function (err) {
				console.log('err line310: ', err);
			})
			;
	},
	getWeaponDictionary: function () {
		return masterDBController.weaponScoreActions('read')
			.then(function (weaponsDic) {
				return new Promise(function (resolve) {
					resolve(weaponsDic);
				});
			})
			.catch(function (err) {
				console.log('err line310: ', err);
			})
		;
	},
	initServer: function ( serverName ) {
		return exports.getServer(serverName)
			.then(function (server) {
				_.set(exports, 'config', server);
				return exports.getStaticDictionary()
					.then(function (staticDict) {
						_.set(exports, 'staticDictionary', staticDict);
						return exports.getUnitDictionary(_.get(server, 'timePeriod', 'modern'))
							.then(function (unitDict) {
								// console.log('UD: ', _.get(server, 'timePeriod', 'modern'), unitDict);
								_.set(exports, 'unitDictionary', unitDict);
								return exports.getWeaponDictionary()
									.then(function (weaponsDict){
										_.set(exports, 'weaponsDictionary', weaponsDict);
										return exports.getBases(serverName)
											.then(function (bases) {
												_.set(exports, 'bases', bases);
											})
											;
									})
									;
							})
							;
					})
					;
			})
		;
	}
});

