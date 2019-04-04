/*
 * DDCS Licensed under AGPL-3.0 by Andrew "Drex" Finegan https://github.com/afinegan/DynamicDCS
 */

const mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// Schema defines how chat messages will be stored in MongoDB
const TheaterSchema = new Schema({
		_id: {
			type: String,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		lat: {
			type: String,
			required: true
		},
		lon: {
			type: String,
			required: true
		},
		zoom: {
			type: String,
			required: true
		},
		removeSideZone: {
			type: String,
			required: true
		}
	},
	{
		timestamps: true, // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
		upsert: true
	}
);

TheaterSchema.static('findByName', function (name, callback) {
	return this.find({ name: name }, callback);
});

module.exports = TheaterSchema;
