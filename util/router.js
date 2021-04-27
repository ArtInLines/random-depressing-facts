const express = require('express');
const router = express.Router({});
const { join: joinPaths } = require('path');
const publicPath = joinPaths(__dirname, '../', '/public');

router.route('/').get((req, res) => res.sendFile(joinPaths(publicPath, 'index.html')));
router.route('/assets/:fname').get((req, res) => res.sendFile(joinPaths(publicPath, req.params.fname)));
router.route('/add').get((req, res) => res.sendFile(joinPaths(publicPath, 'add.html')));

router.route('/download').get((req, res) => {
	const fs = require('fs');
	const Fact = require('./Fact');

	const allFpath = joinPaths(Fact.PATHS.meta_dir, 'all.json');
	const wStream = fs.createWriteStream(allFPath);

	const dirents = fs.readdirSync(Fact.PATHS.fact_dir, { encoding: 'utf-8', withFileTypes: true });
	for (let i = 0; i < dirents.length; i++) {
		const dirent = dirents[i];
		const fpath = joinPaths(Fact.PATHS.fact_dir, dirent.name);
		if (dirent.isFile() && Fact.factFNameRegex.test(dirent.name)) {
			const fname = dirent.name.slice(0, -5); // Slice the last 5 characters, cause the filename ends in '.json'
			wStream.write(`"${fname}": {\n${fs.readFileSync(fpath)}\n}`);
			if (i < dirents.length - 1) wStream.write(',\n');
		}
	}
	res.download(allFpath);
});

const dataRouter = require('./dataRouter');
router.use('/data', dataRouter);

module.exports = router;
