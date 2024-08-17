const apiKey = '15579c87e56b7db2f2bdc229b637818b';

document.getElementById('search-button').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    if (city) {
        getCoordinates(city);
    }
 });

function getCoordinates(city) {
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    fetch(geoUrl)
    .then(response => response.json())
    .then(data => {
        if (data.length > 0) {
            const { lat,lon } = data[0];
            getWeather(lat,lon,city);
        } else {
            alert('City not found');
        }
    });
}

function getWeather(lat,lon,city) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
    fetch(weatherUrl)
    .then(response => response.json())
    .then(data => {
        updateCurrentWeather(data,city);
        updateForecast(data);
        saveSearchHistory(city);
    });
}

function updateCurrentWeather(data,city) {
    const current = data.list[0];
    document.getElementById('city-name').textContent = `${city} (${new Date().toLocaleDateString()})`;
    document.getElementById('current-temp').textContent = current.main.temp;
    document.getElementById('current-wind').textContent = current.wind.speed;
    document.getElementById('current-humidity').textContent = current.main.humidity;
    document.getElementById('current-icon').src = `http://openweathermap.org/img/wn/${current.weather[0].icon}.png`;
}

function updateForecast(data) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';
    for (let i=1; i<data.list.length; i+=8) {
        const dayData = data.list[i];
        const forecastDay = document.createElement('div');
        forecastDay.classList.add('forecast-day');
        forecastDay.innerHTML = `
            <p>${new Date(dayData.dt_txt).toLocaleDateString()}</p>
            <img src="http://openweathermap.org/img/wn/${dayData.weather[0].icon}.png" alt="Weather Icon">
            <p>Temp: ${dayData.main.temp} °F</p>
            <p>Wind: ${dayData.wind.speed} MPH</p>
            <p>Humidity: ${dayData.main.humidity} %</p>
        `;
        forecastContainer.appendChild(forecastDay);
    }
}

function saveSearchHistory(city) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(history));
        updateSearchHistory();
    }
}

function updateSearchHistory(city) {
    const historyContainer = document.getElementById('search-history');
    historyContainer.innerHTML = '';
    let history = JSON.parse(localStorage.getItem('searcHistory')) || [];
    history.forEach(city => {
        const cityButton = document.createElement('button');
        cityButton.textContent = city;
        cityButton.addEventListener('click', () => getCoordinates(city));
        historyContainer.appendChild(cityButton);
    });
}

updateSearchHistory();