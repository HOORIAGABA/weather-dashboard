document.getElementById('search-button').addEventListener('click', getWeather);

function getWeather() {
    const city = document.getElementById('city-input').value;
    if (city) {
        fetchWeatherData(city);
    }
}

function fetchWeatherData(city) {
    const apiKey = 'YOUR_API_KEY';
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => displayCurrentWeather(data))
        .catch(error => console.error('Error fetching current weather:', error));

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => displayForecast(data))
        .catch(error => console.error('Error fetching forecast:', error));
}
function displayCurrentWeather(data) {
    const currentWeatherDiv = document.getElementById('current-weather');
    currentWeatherDiv.innerHTML = `
        <h2>Current Weather in ${data.name}</h2>
        <img class="weather-icon" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <p>Condition: ${data.weather[0].description}</p>
        <button id="add-favorite">Add to Favorites</button>
    `;
    localStorage.setItem('lastCity', data.name);
    document.getElementById('add-favorite').addEventListener('click', () => addFavoriteCity(data.name));
}
function displayForecast(data) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = '<h2>5-Day Forecast</h2>';

    const forecastList = data.list.filter(item => item.dt_txt.includes('12:00:00'));
    forecastList.forEach(day => {
        const forecastDay = document.createElement('div');
        forecastDay.className = 'forecast-day';
        forecastDay.innerHTML = `
            <p>${new Date(day.dt_txt).toLocaleDateString()}</p>
            <img class="weather-icon" src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="${day.weather[0].description}">
            <p>${day.main.temp}°C</p>
            <p>${day.weather[0].description}</p>
        `;
        forecastDiv.appendChild(forecastDay);
    });
}
document.addEventListener('DOMContentLoaded', () => {
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
        fetchWeatherData(lastCity);
    }
});
function fetchWeatherData(city) {
    const apiKey = 'e2deff93ee266c1b93e7a28dce0d4cac';
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => displayCurrentWeather(data))
        .catch(error => {
            console.error('Error fetching current weather:', error);
            alert('City not found. Please try again.');
        });

    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => displayForecast(data))
        .catch(error => {
            console.error('Error fetching forecast:', error);
        });
}
function addFavoriteCity(city) {
    let favorites = JSON.parse(localStorage.getItem('favoriteCities')) || [];
    if (!favorites.includes(city)) {
        favorites.push(city);
        localStorage.setItem('favoriteCities', JSON.stringify(favorites));
        displayFavoriteCities();
    }
}

function displayFavoriteCities() {
    const favoritesList = document.getElementById('favorites-list');
    favoritesList.innerHTML = '';
    const favorites = JSON.parse(localStorage.getItem('favoriteCities')) || [];
    favorites.forEach(city => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';  // This makes the text appear as a clickable link
        a.textContent = city;
        a.addEventListener('click', (event) => {
            event.preventDefault();  // Prevent the default link behavior
            fetchWeatherData(city);
        });
        li.appendChild(a);
        favoritesList.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', displayFavoriteCities);
