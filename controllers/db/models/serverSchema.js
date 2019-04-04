/*
 * DDCS Licensed under AGPL-3.0 by Andrew "Drex" Finegan https://github.com/afinegan/DynamicDCS
 */

const mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// Schema defines how chat messages will be stored in MongoDB
const ServerSchema = new Schema({
		_id: {
			type: String,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		theater: {
			type: String,
			required: true,
			default: 'Caucasus'
		},
		totalTicks: {
			type: Number
		},
		secsBwtTicks: {
			type: Number
		},
		defBaseSides: {
			type: Object
		},
		replenThresholdFARP: {
			type: Number
		},
		replenThresholdBase: {
			type: Number
		},
		replenTimer: {
			type: Number
		},
		minUnits: {
			type: Number
		},
		maxUnits: {
			type: Number
		},
		spwnLimitsPerTick: {
			type: Object
		},
		ip: {
			type: String,
			required: true,
			default: 'localhost'
		},
		dcsClientPort: {
			type: Number,
			required: true,
			default: 3001
		},
		dcsGameGuiPort: {
			type: Number,
			required: true,
			default: 3002
		},
		enabled: {
			type: Boolean,
			default: false
		},
		maxCrates: {
			type: Number,
			required: true,
			default: 10
		},
		maxTroops: {
			type: Number,
			required: true,
			default: 1
		},
		maxUnitsMoving: {
			type: Number,
			required: true,
			default: 7
		},
		startLifePoints: {
			type: Number,
			required: true,
			default: 12
		},
		inGameHitMessages: {
			type: Boolean,
			default: true
		},
		mapRotation: {
			type: Array,
			required: true
		},
		SRSFilePath: {
			type: String,
			required: true,
			default: 'C:/Program Files/DCS-SimpleRadio-Standalone/clients-list.json'
		},
		isDiscordAllowed: {
			type: Boolean,
			default: false
		},
        weaponRules: {
            type: Array,
            required: true,
			default: []
		},
		curTimer: {
			type: Number
		},
		isServerUp: {
			type: Boolean,
			default: false
		},
		isDiscordOnline: {
			type: Boolean,
			default: false
		},
		restartTime: {
			type: Number,
			required: true,
			default: 18000
		},
		canSeeUnits: {
			type: Boolean,
			default: false
		},
		curSeason: {
			type: String,
			required: true,
			default: 'Summer'
		},
		mapCount: {
			type: Number,
			required: true,
			default: 1
		},
		curFilePath: {
			type: String
		},
		timePeriod: {
			type: String,
			required: true,
			default: 'modern'
		}
	},
	{
		timestamps: true, // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
		upsert: true
	}
);

ServerSchema.static('findByName', function (name, callback) {
	return this.find({ name: name }, callback);
});

module.exports = ServerSchema;
