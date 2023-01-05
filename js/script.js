const searchForm = document.querySelector('form');
const searchInp = searchForm.querySelector('[type="search"]');
const searchList = document.querySelector('.search-list');
const weatherBlocks = document.querySelector('.weather-blocks');
const currentDayTitle = document.querySelector('.current-day-title');
const currentDay = document.querySelector('.current-day');
const forecastTitle = document.querySelector('.forecast-title');
const forecast = document.querySelector('.forecast');
let city = ''
let searchListArray = [];
if (JSON.parse(localStorage.getItem('searchListArray'))) {searchListArray = JSON.parse(localStorage.getItem('searchListArray'))};

