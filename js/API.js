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
		buildSearchList();
	})
	.catch(() => {
		alert('City not found');
		city = '';
		searchInp.value = '';
	})
};