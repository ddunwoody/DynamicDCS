const _ = require('lodash');
const dbMapServiceController = require('../db/dbMapService');

_.set(exports, 'sendToAll', function (serverName, pData) {
	_.set(pData, 'serverName', _.toLower(serverName));
	for(var x=0; x <= '3'; x++) {
		_.set(pData, 'side', x);
		dbMapServiceController.webPushActions('save', serverName, pData)
			.catch(function (err) {
				console.log('line9: ', err);
			})
		;
	}
});

_.set(exports, 'sendToCoalition', function (serverName, pData) {
	var coalition = _.get(pData, ['payload', 'data', 'coalition']);
	var displaySide = _.get(pData, ['payload', 'data', 'displaySide']);
	if(coalition) {
		_.set(pData, 'side', coalition);
	} else if (displaySide) {
		_.set(pData, 'side', displaySide);
	} else {
		console.log('no sendToCoalition side for ', pData);
	}

	if (pData.payload.action === 'U') {
		console.log('U2', pData);
	}

	dbMapServiceController.webPushActions('save', serverName, pData)
		.catch(function (err) {
			console.log('line274: ', err);
		})
	;

	_.set(pData, 'side', 3);
	dbMapServiceController.webPushActions('save', serverName, pData)
		.catch(function (err) {
			console.log('line274: ', err);
		})
	;
});

_.set(exports, 'sendToIndividual', function (serverName, socketId, pData) {

});
