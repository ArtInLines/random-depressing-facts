const DATA_PATH = '/data';
const DEFAULT_ERR_MSG = 'Sorry, an Error occured...';
const SHOW_MSG_TIME = 1000 * 20; // in miliseconds = 20s

const loadingContainer = document.querySelector('.loading-container');
const loadingGif = document.querySelector('#loading');

const disableLoading = () => {
	loadingContainer.style.display = 'none';
};

const enableLoading = () => {
	loadingContainer.style.display = 'block';
};

const showMsg = (msg, presetClass) => {
	const div = document.createElement('div');
	div.classList.add(presetClass, 'msg');
	document.body.insertAdjacentElement('afterbegin', div);
	setTimeout(() => {
		div.remove();
	}, SHOW_MSG_TIME);
};

const addDataItem = (item) => {
	console.log(item);
};

const getData = () => {
	// Start Loading Animation
	enableLoading();
	// Get Data from Backend
	fetch(DATA_PATH)
		.then((res) => res.json())
		.then((data) => {
			// Stop Loading Animation
			disableLoading();
			// Show Data
			if (Array.isArray(data)) data.forEach((item) => addDataItem(item));
			else addDataItem(data);
		})
		.catch((err) => {
			// Show Error Message
			const message = err.msg || err.message || DEFAULT_ERR_MSG;
			showMsg(message, 'error');
		});
};

getData();
