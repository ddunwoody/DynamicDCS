/*
 * DDCS Licensed under AGPL-3.0 by Andrew "Drex" Finegan https://github.com/afinegan/DynamicDCS
 */

const mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// Schema defines how chat messages will be stored in MongoDB
const CmdQueSchema = new Schema({
		actionObj: {
			type: Schema.Types.Mixed,
			required: true
		},
		queName: {
			type: String,
			required: true
		},
		timeToExecute: {
			type: Number,
			default: 0,
			index: true
		}
	},
	{
		timestamps: true, // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
		upsert: true
	}
);

CmdQueSchema.static('findByName', function (name, callback) {
	return this.find({ name: name }, callback);
});

module.exports = CmdQueSchema;
