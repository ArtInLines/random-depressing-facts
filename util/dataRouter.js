const router = require('express').Router();
const Fact = require('./Fact');

/**
 * Respond data from an API call - Helper Function
 * @param {Response} res Response object
 * @param {(Function | *)} cb Callback function, which returns the data to respond with. Alternatively the value to be returned itself too.
 * @param  {...any} params Parameters to input to `cb`
 */
const respond = (res, cb, ...params) => {
	try {
		const data = typeof cb === 'function' ? cb(...params) : cb;
		res.status(200).send({ success: true });
	} catch (err) {
		res.status(400).send({ success: false, err });
	}
};

const DEFAULT_AMOUNT = 50;
router
	.route('/')
	.get((req, res) => respond(res, Fact.find(DEFAULT_AMOUNT)))
	.post((req, res) => respond(res, Fact.find(req.body.amount || DEFAULT_AMOUNT, req.body.filter || DEFAULT_AMOUNT)));

router.route('/add').post((req, res) => respond(res, Fact.add(req.body, { isFact: false })));

router
	.route('/tags')
	.get((req, res) => respond(res, Fact.tag.get()))
	.put((req, res) => respond(res, Fact.tag.update(req.body)))
	.post((req, res) => respond(res, Fact.tag.save(req.body)));

router
	.route('/:dataID')
	.get((req, res) => respond(res, Fact.findById(req.params.dataID)))
	.put((req, res) => respond(res, Fact.updateById(req.params.dataID, req.body.data)))
	.delete((req, res) => respond(res, Fact.deleteById(req.params.dataID)));

module.exports = router;
