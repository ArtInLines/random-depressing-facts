const express = require('express');
const router = express.Router({});
const Fact = require('../models/Fact');
const path = require('path');
const publicPath = path.join(__dirname, '../', '/public');

router.route('/').get((req, res) => {
	res.sendFile(path.join(publicPath, 'index.html'));
});

router.route('/data').get(async (req, res) => {
	// TODO: Add methods to retrieve several items of data
});

router
	.route('/add')
	.get((req, res) => {
		res.sendFile(path.join(publicPath, 'add.html'));
	})
	.post(async (req, res) => {
		const data = await Fact.create(req.body.data);
		res.status(200).send({ success: true, data: data });
	});

router
	.route('/:dataID')
	.get(async (req, res) => {
		Fact.findById(req.params.dataID)
			.then((data) => res.status(200).send({ success: false, data }))
			.catch((err) => res.status(500).send({ success: false, err }));
	})
	.put(async (req, res) => {
		const body = req.body.data,
			id = req.params.dataID;
		await Fact.updateOne({ _id: id }, body, {}, (err, data) => {
			if (err) return res.status(500).send({ success: false, err });
			return res.status(200).send({ success: true, data });
		});
	})
	.delete(async (req, res) => {
		await Fact.findById(req.params.dataID).delete({}, (err) => {
			if (err) return res.stauts(500).send({ success: false, err });
			return res.status(200).send({ success: true });
		});
	});

module.exports = router;
