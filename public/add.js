// Require HTML Elements
const factFormEl = document.querySelector('#fact-form');
const titleEl = document.querySelector('#title-input');
const textEl = document.querySelector('#text-input');
const sourcesEl = document.querySelector('#sources-input');
const notesContainerEl = document.querySelector('#notes-container');
const tagsEl = document.querySelector('#tags-select');
const dateEl = document.querySelector('#date-input');
const addBtn = document.querySelector('#add-btn');
const tagFormEl = document.querySelector('#tag-form');
const tagNameEl = document.querySelector('#tag-name-input');
const tagValEl = document.querySelector('#tag-value-input');
const addTagBtn = document.querySelector('#add-tag-btn');

// Get & add Tags to tagsEl (select element)
fetch('/data/tags')
	.then((res) => res.json())
	.then((tags) => tags.forEach((tag) => tagsEl.insertAdjacentHTML('beforeend', `<option value="${tag.value}">${tag.name}</option>`)));

function post(path = '/', data = {}, method = 'POST') {
	return new Promise((resolve, reject) => {
		fetch(path, {
			method: method.toUpperCase(),
			headers: {
				'Content-Type': 'application/json',
			},
			referrerPolicy: 'no-referrer',
			body: JSON.stringify(data),
		})
			.then((val) => resolve(val))
			.catch((err) => reject(err));
	});
}

// Listen to Button Presses
addBtn.addEventListener(
	'click',
	post('/data/add', {
		title: titleEl.value,
		text: textEl.innerHTML,
		sources: sourcesEl.split(','),
		notes: notesContainerEl.childNodes.map((node) => node.value),
		tags: tagsEl.value,
		dateReleased: dateEl.value,
	})
);

addTagBtn.addEventListener('click', post('/data/tags', { value: tagValEl.value, name: tagNameEl.value }));
