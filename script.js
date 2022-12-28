const searchForm = document.querySelector('form');
const searchInp = searchForm.querySelector('[type="search"]');
const searchList = document.querySelector('.search-list');
const weatherBlocks = document.querySelector('.weather-blocks');
const currentDayTitle = document.querySelector('.current-day-title');
const currentDay = document.querySelector('.current-day');
const forecastTitle = document.querySelector('.forecast-title');
const forecast = document.querySelector('.forecast');
let city = ''
let searchListArray = JSON.parse(localStorage.getItem('searchListArray'));


searchForm.addEventListener('submit', (event) => {
	event.preventDefault();
	searchFunction(searchInp.value);
});

function searchFunction(cityFromSearch) {
	const value = cityFromSearch;
	if(!value) return false;
	city = value;
	getWeather();
	searchInp.value = '';
};

function clearBlock(data) {
	currentDayTitle.innerHTML = '';
	currentDay.innerHTML = '';
	forecastTitle.innerHTML = '';
	forecast.innerHTML = '';
	searchList.innerHTML = '';
}

function getWeather() {
	Promise.all([
		fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=4d99368c58b7cf902223902d21f3f86f`)
		.then(data => {
			return data.json()
		}),
		fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=4d99368c58b7cf902223902d21f3f86f`)
		.then(data => {
			return data.json()
		})
		])
	.then((data) => {
		if (data[0].cod !== '404') {clearBlock()}
		buildCurrentDay(data[0]);
		buildForecast(data[1]);
		localStorageWork(data[0]);
		buildSearchList(data[0]);

	})
	.catch(() => {
		alert('City not found');
		city = '';
		searchInp.value = '';
	})
};

function localStorageWork(objectCity) {
	searchListArray.unshift(objectCity);
	if (searchListArray.length > 10) {
		searchListArray.pop();
	}
	localStorage.setItem('searchListArray', JSON.stringify(searchListArray));
}

function buildSearchList(objectCity) {
	const searchListArrayFromLocalStorage = JSON.parse(localStorage.getItem('searchListArray'));
	searchListArrayFromLocalStorage.forEach((data, index) => {
		const searchListItem = new createElement('div', ['search-list-item', 'text-bg-primary', 'rounded', 'p-3', 'mt-3', 'me-2']).appendTo(searchList);
		const cityPlusButton = new createElement('div', ['city-plus-button', 'd-flex', 'justify-content-between']).appendTo(searchListItem);
		const cityName = new createElement('div', ['city-name'], null, `${data.name}`).appendTo(cityPlusButton);
		const buttonX = new createElement('button', ['delete-button-X', 'btn-close']).appendTo(cityPlusButton);
		const date = new createElement('div', ['mt-1'], null, `${(new Date(data.dt*1000)).toString().slice(4, -40)}`).appendTo(searchListItem);
		const imgPlusTemp = new createElement('div', ['img-plus-temp', 'd-flex', 'justify-content-between', 'align-items-center']).appendTo(searchListItem);
		const img = new createElement('div', ['img-block'], null, null, `<img class='weather-img' src="http://openweathermap.org/img/w/` + data.weather[0].icon + `.png "></img>`).appendTo(imgPlusTemp);
		const temp = new createElement('div', null, [{prop: 'id', value: 'temp'}], `${Math.floor(data.main.temp) - 273}°`).appendTo(imgPlusTemp);

		buttonX.addEventListener('click', (event) => {
			event.preventDefault();
			searchListArray.splice(index, 1);
			searchListItem.remove();
			localStorage.setItem('searchListArray', JSON.stringify(searchListArray));
		});
	})
}

function buildCurrentDay(data) {
	if (!data.name) {return}
	const city = new createElement('h1', null, [{prop: 'id', value: 'city'}], `${data.name}`).appendTo(currentDayTitle);
	const weatherBlock = new createElement('div', ['weather-block-current']).appendTo(currentDay);
	const date = new createElement('div', ['text-bg-primary', 'p-3', 'rounded'], null, `${(new Date(data.dt*1000)).toString().slice(4, -46)}`).appendTo(weatherBlock);
	const currentDayContent = new createElement('div', ['current-day-content', 'd-flex', 'text-bg-secondary', 'p-3', 'rounded', 'bg-opacity-75']).appendTo(weatherBlock);
	const timeAndImg = new createElement('div', ['time-and-img', 'col-4']).appendTo(currentDayContent);
	const time = new createElement('div', null, null, `${(new Date(data.dt*1000)).toString().slice(15, -40)}`).appendTo(timeAndImg);
	const img = new createElement('div', ['img-block'], null, null, `<img class='weather-img' src="http://openweathermap.org/img/w/` + data.weather[0].icon + `.png "></img>`).appendTo(timeAndImg);
	const tempAndDescriprion = new createElement('div', ['temp-and-description', 'col-8']).appendTo(currentDayContent);
	const temp = new createElement('div', null, [{prop: 'id', value: 'temp'}], `${Math.floor(data.main.temp) - 273}°`).appendTo(tempAndDescriprion);
	const description = new createElement('div', null, null, `${data.weather[0].description}`).appendTo(tempAndDescriprion);
}

function buildForecast(data) {
	if (!data.city.name) {return}
	const title = new createElement('h3', null, null, 'Forecast for 5 days').appendTo(forecastTitle);
	let forecastDay = (new Date(data.list[0].dt*1000)).toString().slice(4, -46);
	const blockDateFirst = new createElement('div', ['forecast-date', 'text-bg-primary', 'p-3', 'rounded'], null, `${(new Date(data.list[0].dt*1000)).toString().slice(4, -46)}`).appendTo(forecast);
	
	data.list
	.forEach((day, index, array) => {
		if (forecastDay !== (new Date(day.dt*1000)).toString().slice(4, -46)) {
			const blockDate = new createElement('div', ['forecast-date', 'text-bg-primary', 'p-3', 'col-12', 'rounded'], null, `${(new Date(day.dt*1000)).toString().slice(4, -46)}`).appendTo(forecast);
			forecastDay = (new Date(day.dt*1000)).toString().slice(4, -46);
		}
		const weatherBlock = new createElement('div', ['weather-block', 'd-flex', 'text-bg-secondary', 'p-3', 'rounded', 'bg-opacity-75']).appendTo(forecast);
		const timeAndImg = new createElement('div', ['time-and-img', 'col-4']).appendTo(weatherBlock);
		const time = new createElement('div', null, null, `${(new Date(day.dt*1000)).toString().slice(15, -40)}`).appendTo(timeAndImg);
		const img = new createElement('div', ['img-block'], null, null, `<img class='weather-img' src="http://openweathermap.org/img/w/` + day.weather[0].icon + `.png "></img>`).appendTo(timeAndImg);
		const tempAndDescriprion = new createElement('div', ['temp-and-description', 'col-8']).appendTo(weatherBlock);
		const temp = new createElement('div', null, [{prop: 'id', value: 'temp'}], `${Math.floor(day.main.temp) - 273}°`).appendTo(tempAndDescriprion);
		const description = new createElement('div', null, [{prop: 'id', value: 'date'}], `${day.weather[0].description}`).appendTo(tempAndDescriprion);
	})
}

class createElement {
	constructor(tag, classList, attributes, textContent, innerHTML) {
		this.element = document.createElement(tag);

		if (classList) {
			this.element.classList.add(...classList);
	 	}
  
		if (attributes?.length) {
			attributes.forEach(({ prop, value }) => {
				this.element.setAttribute(prop, value);
			});
	 	}
  
	 	if (textContent) {
			this.element.textContent = textContent;
	 	}

		if (innerHTML) {
			this.element.innerHTML = innerHTML;
	 	}
  	}
	
	appendTo(parent) {
	  	return parent.appendChild(this.element);
	}
	
}

buildSearchList();
