function getWeather() {
    const apiKey = '36bd841fc45875bdaa1abc2c85f1a796';
    const city = document.getElementById('city').value;
    if (!city) {
        alert('please enter a city');
        return;
    }
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('error fetching current weather data:', error);
            alert('error fetching current weather data. try again.');
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('error fetching hourly forecast data:', error);
            alert('error fetching hourly forecast data. try again.');
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const weatherForecastDiv = document.getElementById('hourly-forecast');
    
    weatherInfoDiv.innerHTML = '';
    weatherForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if(data.cod === '404'){
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    }else{
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        const temperatureHTML = `
        <p>${temperature}°C</p>
        `;
        const weatherHTML = `
            <p>${cityName}</p>
            <p>${description}</p>
        `;
        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHTML;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;
    }


    showImage();
}

function displayHourlyForecast(hourlyData){
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    const next24hours = hourlyData.slice(0, 8);
    hourlyForecastDiv.addEventListener('wheel', function(event){
        if(event.deltaY !== 0){
            hourlyForecastDiv.scrollLeft +=event.deltaY;
            event.preventDefault();
        }
    })
    next24hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHTML = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="hurly weather icon">
                <span>${temperature}°C</span>
            </div>
        `;
        hourlyForecastDiv.innerHTML += hourlyItemHTML;
    });

}

function showImage(){
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block';
}