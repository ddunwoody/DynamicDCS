/*
 * DDCS Licensed under AGPL-3.0 by Andrew "Drex" Finegan https://github.com/afinegan/DynamicDCS
 */

const mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// Schema defines how chat messages will be stored in MongoDB
const SessionsSchema = new Schema({
		_id: {
			type: String,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		campaignName: {
			type: String,
			required: true
		},
		startAbsTime: {
			type: Number
		},
		curAbsTime: {
			type: Number
		},
		totalMinutesPlayed_blue: {
			type: Number,
			default: 0
		},
		totalMinutesPlayed_red: {
			type: Number,
			default: 0
		}
	},
	{
		timestamps: true, // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
		upsert: true
	}
);

module.exports = SessionsSchema;
