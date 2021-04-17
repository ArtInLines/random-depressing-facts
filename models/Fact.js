const { Schema, model } = require('mongoose');

const currentDate = () => new Date(Date.now());
const currentDateStr = () => currentDate().toDateString();

const Fact = {
	title: String,
	text: String || [String],
	source: String,
	references: String,
	dateAdded: {
		type: Date || String,
		default: currentDate(),
	},
	dateReleased: {
		type: Date || String,
		default: currentDate(),
	},
};

module.exports = model('Fact', new Schema(Fact));
