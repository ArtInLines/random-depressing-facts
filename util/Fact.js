const path = require('path');
const fs = require('fs');

// TODO: Add Documentation

const updateFile = (fpath, cb = (str) => str, ...params) => {
	let data = '';
	if (fs.existsSync(fpath)) data = fs.readFileSync(fpath, { encoding: 'utf-8' });
	data = cb(data, ...params);
	fs.writeFileSync(fpath, data, { encoding: 'utf-8' });
};

const updateJSON = (fpath, cb = (val) => val, ...params) => {
	updateFile(fpath, (data) => {
		data = JSON.parse(data);
		data = cb(data, ...params);
		return JSON.stringify(data);
	});
};

const currentDate = () => new Date(Date.now());
module.exports.currentDate = currentDate;
const currentDateStr = () => currentDate().toDateString();
module.exports.currentDateStr = currentDateStr;

// All facts of one year stored together
// ID-List holding the filename in which the fact of that ID is

const factFNameRegex = /^\d\d\d\d.json$/;
module.exports.factFNameRegex = factFNameRegex;

const meta_dir = path.join(__dirname, '../', 'data/');
const PATHS = {
	meta_dir,
	fact_dir: path.join(meta_dir, '/facts/'),
	id_list: path.join(meta_dir, 'id_list.json'),
	tag_list: path.join(meta_dir, 'tag_list.json'),
};
module.exports.PATHS = PATHS;

//
// Methods
//

// TAG
const getTags = (...{ amount = null }) => {
	let list = JSON.parse(fs.readFileSync(PATHS.tag_list));
	if (amount) list = list.slice(0, amount);
	return list;
};

const saveTag = (tag) => {
	updateJSON(PATHS.tag_list, (data) => {
		data[tag.value] = tag.name; // Both allowed
		return data;
	});
};

const updateTag = (old_tag, new_tag) => {
	updateJSON(PATHS.tag_list, (data) => {
		delete data[old_tag.value];
		data[new_tag.value] = new_tag.name;
		return data;
	});
};

module.exports.tag = { get: getTags, save: saveTag, update: updateTag };

// FACT

// TODO: Better method to create a unique ID needed
const getID = () => Date.now().toString();
module.exports.getID = getID;

const isReleased = (fact) => {
	if (fact.released <= Date.now()) return true;
	return false;
};
module.exports.isReleased = isReleased;

const getFactFilePath = (id) => {
	id = id?.id; // in case the whole Fact object is inputted
	const idList = JSON.parse(fs.readFileSync(PATHS.id_list, { encoding: 'utf-8' }));
	if (!idList.hasOwnProperty(id)) return null;
	return path.join(PATHS.fact_dir, idList[id]);
};

const isValid = (fact, ...{ mutate = false }) => {
	// Title
	if (typeof fact.title !== 'string') return false;
	// Text
	if (typeof fact.text !== 'string') {
		if (!Array.isArray(fact.text)) return false;
		fact.text.forEach((val) => {
			if (typeof val !== 'string') return false;
		});
	}
	// Sources
	if (!Array.isArray(fact.sources)) {
		if (typeof fact.sources !== 'string') return false;
		if (mutate) fact.sources = [fact.sources];
	}
	// Notes
	if (!Array.isArray(fact.notes)) {
		if (typeof fact.notes !== 'string') return false;
		if (mutate) fact.notes = [fact.notes];
	}
	// Tags
	if (!Array.isArray(fact.tags)) {
		if (typeof fact.tags !== 'string') return false;
		if (mutate) fact.tags = [fact.tags];
	}
	// Dates
	[fact.date.added, fact.date.released]
		.forEach((date) => {
			if (isNaN(new Date(date).getDate())) return false;
		})
		.map((val) => {
			if (mutated) return new Date(val);
			return val;
		});

	return true;
};
module.exports.isValid = isValid;

const createFact = (...{ title = '', text = '', sources = [], notes = [], tags = [], dateAdded = currentDate(), dateReleased = currentDate() }) => {
	return { id: getID(), title, text, sources, notes, tags, date: { dateAdded, dateReleased } };
};
module.exports.createFact = createFact;

const saveFact = (fact) => {
	const releaseYear = fact.date.dateReleased.getUTCFullYear();
	const fname = `${releaseYear}.json`;
	const fpath = path.join(PATHS.fact_dir, fname);
	// Add raw data
	updateJSON(fpath, (file) => {
		file[fact.id] = fact;
		return file;
	});
	// Add to id_list
	updateJSON(PATHS.id_list, (file) => {
		file[fact.id] = fname;
		return file;
	});
};
module.exports.saveFact = saveFact;

const add = (fact, ...{ isFact = false }) => {
	if (!isFact) fact = createFact(fact);
	if (!isValid(fact, { mutate: true })) throw new Error('Invalid Fact Data');
	saveFact(fact);
	return fact;
};
module.exports.add = add;

const findById = (id) => JSON.parse(fs.readFileSync(getFactFilePath(id), { encoding: 'utf-8' }))[id];
module.exports.findById = findById;

const find = (max_amount = 50, filter = {}) => {
	const filterKeys = Object.keys(filter);
	const filterObj = (obj) => {
		filterKeys.forEach((key) => {
			if (obj?.[key] !== filter[key]) return false;
		});
		return true;
	};

	const filtered = [];

	const dirents = fs.readdirSync(PATHS.fact_dir, { encoding: 'utf-8', withFileTypes: true });
	for (let i = 0; filtered.length < max_amount && i < dirents.length; i++) {
		const dirent = dirents[i];
		if (dirent.isFile() && factFNameRegex.test(dirent.name)) {
			module.exports.factFNameRegex = factFNameRegex;

			// check if it is a FactFile
			const fpath = path.join(PATHS.fact_dir, dirent.name);
			const file = JSON.parse(fs.readFileSync(fpath, { encoding: 'utf-8' }));
			Object.keys(file).forEach((id) => {
				if (filterObj(file[id])) filtered.push(file[id]);
			});
		}
	}

	return filtered;
};
module.exports.find = find;

const updateID = (old_id, new_id) => {
	// TODO
};
module.exports.updateID = updateID;

const updateById = (id, body, ...{ addNewKeys = false }) => {
	const fpath = getFactFilePath(id);
	updateJSON(fpath, (data) => {
		const fact = data[id];
		Object.keys(body).forEach((key) => {
			if (key === 'id') updateID(id, key);
			else if (addNewKeys || fact.hasOwnProperty(key)) fact[key] = body[key];
		});
		return fact;
	});
};
module.exports.updateById = updateById;

const deleteById = (id) =>
	[getFactFilePath(id), PATHS.id_list].forEach((fpath) =>
		updateJSON(fpath, (data) => {
			delete data[id];
			return data;
		})
	);
module.exports.deleteById = deleteById;
