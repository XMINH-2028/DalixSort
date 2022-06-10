'use strict';

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const inputPeople = $('#input-people');
const btnPeople = $('#btn-people');
const table = $('table');
const data = getFromLocalStorage() ? getFromLocalStorage() : [];
const range = $('#range');
const line = $('#line');
const inputLine = $('#input-line');
const direction = $('#direction');
const btnSubmit = $('#btn-submit');
const checkbox = $$('input[type=checkbox]');
let select = 0;
let random, time;

renderData();

function saveToLocalStorage() {
	localStorage.data = JSON.stringify(data);
}

function getFromLocalStorage() {
	if (localStorage.data)
	return JSON.parse(localStorage.data);
}

function renderData() {
	table.innerHTML = '';
	data.forEach((value,index) => {
		const line = document.createElement('tr');
		line.innerHTML = `<td class="name">${value}</td>
				<td class="result"></td>
				<td class="delete"><button type="button" class="close" data-index="${index}">Xóa</button></td>`;
				table.appendChild(line);
	})
}

btnPeople.addEventListener('click', function () {
	const add = inputPeople.value.split(' ').filter(value => value !== '');
	add.forEach(value => data.push(value));
	saveToLocalStorage();
	renderData();
})

table.addEventListener('click', function (e) {
	if (!e.target.classList.contains('close')) return;
	const index = e.target.dataset.index;
	data.splice(index,1);
	renderData();
	saveToLocalStorage()
})

range.addEventListener('change',function() {
	if (range.value === 'follow-line') {
		if(!direction.classList.contains('hidden'))
			direction.classList.add('hidden');
		line.classList.remove('hidden');
		select = 1;
	} else if (range.value === 'follow-direction') {
		if(!line.classList.contains('hidden'))
			line.classList.add('hidden');
		direction.classList.remove('hidden');
		select = 2;
	} else {
		direction.classList.add('hidden');
		line.classList.add('hidden');
		select = 0;
	}
})

function lineRandom(value,index) {
	if (index === 1) {
		return Math.round(Math.random()*(value-1)) + 1;
	} else {
		return Math.round(Math.random()*value);
	}
	
}

function sort(string) {
	let sortArr = [];
	if (string === 'line') {
		for (let i = 0; i <= inputLine.value; i++) sortArr.push(String(i));
	} else {
		if (![...checkbox].filter(value => value.checked === true).length) {
			alert('Chọn hướng!');
			return;
		}
		if (checkbox[0].checked) {
			sortArr = ['0','Đông', 'Tây', 'Nam', 'Bắc'];
		} else {
			[,...sortArr] = [...checkbox];
			sortArr = sortArr.filter(value => value.checked === true).map(value => value.value);
			sortArr.unshift('0');
		}
	}
	let i = 0;
	let randomArr = [];
	let randomN;
	random = setInterval(() => {
		if (i < $$('.result').length) {
			if (sortArr.length - 1 >= $$('.result').length) {
				randomN = sortArr[lineRandom(sortArr.length - 1, 1)];
			} else {
				if ($$('.result').length - randomArr.length > sortArr.length - 1 - randomArr.filter(value => value !== 0).length) {
					randomN = sortArr[lineRandom(sortArr.length - 1, 0)];
				} else {
					randomN = sortArr[lineRandom(sortArr.length - 1, 1)];
				}
			}
			if (sortArr.indexOf(randomN) === 0) {
				$$('.result')[i].textContent = randomN;
			} else if (!randomArr.filter(value => value === sortArr.indexOf(randomN)).length) {
				$$('.result')[i].textContent = randomN;	
			}
		} else {
			clearInterval(time);
			clearInterval(random);
		}
	});
	time = setInterval(() => {
		if (i < $$('.result').length) {
			randomArr.push(sortArr.indexOf($$('.result')[i].textContent));
			i++;
		} else {
			clearInterval(time);
			clearInterval(random);
		}
	},1000);
}
 
btnSubmit.addEventListener('click',function() {
	$$('.result').forEach(value => value.textContent = '');
	clearInterval(time);
	clearInterval(random);
	if (data.length < 2) {
		alert('Hãy nhập thêm người!');
		return;
	}
	if (select === 0) {
		alert('Hãy chọn cách sắp xếp!');
		return;
	}
	if (select === 1) {
		if (Number(inputLine.value) < 1) {
			alert('Số tuyến phải lớn hơn 0!');
			return;
		} else {
			sort('line');
		}
	} else {
		sort('direction');
	}
})