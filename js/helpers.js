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

function localStorageWork(objectCity) {
	searchListArray.unshift(objectCity);
	if (searchListArray.length > 10) {
		searchListArray.pop();
	}
	localStorage.setItem('searchListArray', JSON.stringify(searchListArray));
}