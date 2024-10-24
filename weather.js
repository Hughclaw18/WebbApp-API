// Your OpenWeatherMap API key
const apiKey = '333d33c356f6c26a51a4734fcf4cb4cf';
let isCelsius = true;  // Default unit

// Function to fetch weather data
function getWeather(city, units = 'metric') {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                // Update HTML with fetched data
                document.getElementById('city-name').innerText = data.name;
                document.getElementById('weather-desc').innerText = data.weather[0].description;
                const temperature = data.main.temp;
                document.getElementById('temp').innerText = temperature;
                document.getElementById('humidity').innerText = data.main.humidity;
                document.getElementById('wind-speed').innerText = data.wind.speed;
                document.getElementById('sunrise').innerText = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
                document.getElementById('sunset').innerText = new Date(data.sys.sunset * 1000).toLocaleTimeString();

                // Change header/footer color based on time of day in location
                changeTimeTheme();

                // Fetch and display AQI
                getAQI(data.coord.lat, data.coord.lon);

                // Display weather tips
                displayTips(data.weather[0].main);

                // Change video background based on weather description
                changeWeatherVideo(data.weather[0].main);
            } else {
                alert('City not found!');
            }
        })
        .catch(error => console.log('Error fetching data:', error));
}

// Fetch Air Quality Index (AQI)
function getAQI(lat, lon) {
    const aqiUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    
    fetch(aqiUrl)
        .then(response => response.json())
        .then(data => {
            const aqi = data.list[0].main.aqi;
            document.getElementById('aqi').innerText = aqi;
        })
        .catch(error => console.log('Error fetching AQI:', error));
}

// Change header and footer color based on time of day
function changeTimeTheme() {
    const header = document.getElementById('header');
    const footer = document.getElementById('footer');
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    const currentDateNum = currentDate.getDate();

    // Reset to default color
    header.className = '';
    footer.className = '';

    if (currentHour >= 6 && currentHour < 9) {
        header.classList.add('early-morning');
        footer.classList.add('early-morning');
    } else if (currentHour >= 9 && currentHour < 11 || (currentHour === 11 && currentMinute <= 30)) {
        header.classList.add('morning');
        footer.classList.add('morning');
    } else if (currentHour >= 11 && currentMinute > 30 && currentHour < 15) {
        header.classList.add('midday');
        footer.classList.add('midday');
    } else if (currentHour >= 15 && currentHour < 17 || (currentHour === 17 && currentMinute <= 30)) {
        header.classList.add('afternoon');
        footer.classList.add('afternoon');
    } else if (currentHour >= 17 && currentHour < 18 || (currentHour === 18 && currentMinute <= 30)) {
        if (currentDateNum % 2 === 0) {
            header.classList.add('evening-even');
            footer.classList.add('evening-even');
        } else {
            header.classList.add('evening-odd');
            footer.classList.add('evening-odd');
        }
    } else if (currentHour >= 18 && currentHour < 23) {
        header.classList.add('late-evening');
        footer.classList.add('late-evening');
    } else if (currentHour >= 23 && currentHour < 1) {
        header.classList.add('late-night');
        footer.classList.add('late-night');
    } else {
        header.classList.add('night');
        footer.classList.add('night');
    }
}

// Change background video based on weather conditions
function changeWeatherVideo(weatherCondition) {
    const videoSource = document.getElementById('video-source');
    switch (weatherCondition) {
        case 'Clear':
            videoSource.src = 'sunny.mp4';
            break;
        case 'Clouds':
            videoSource.src = 'cloudy.mp4';
            break;
        case 'Rain':
            videoSource.src = 'rainy.mp4';
            break;
        case 'Mist':
            videoSource.src = 'misty.mp4';
            break;
        case 'Haze':
            videoSource.src = 'haze.mp4';
            break;
        case 'Snow':
            videoSource.src = 'snowy.mp4';
            break;
        case 'Thunderstorm':
            videoSource.src = 'thunderstorm.mp4';
            break;
        default:
            videoSource.src = 'default.mp4';
            break;
    }
    document.getElementById('weather-video').load();
}

// Toggle temperature units
function toggleUnits() {
    isCelsius = !isCelsius;
    const city = document.getElementById('city-input').value;
    if (city) {
        getWeather(city, isCelsius ? 'metric' : 'imperial');
        document.getElementById('temp-unit').innerText = isCelsius ? 'C' : 'F';
        document.getElementById('unit-toggle').innerText = isCelsius ? 'Switch to Fahrenheit' : 'Switch to Celsius';
    }
}

// Search for the city
function searchCity() {
    const city = document.getElementById('city-input').value;
    if (city) {
        getWeather(city);
    }
}

// Display weather tips based on weather type
function displayTips(weatherType) {
    let tips = '';
    switch (weatherType) {
        case 'Clear':
            tips = 'It\'s a beautiful day! Perfect for outdoor activities.';
            break;
        case 'Clouds':
            tips = 'Might be a bit gloomy, but still a good day for a walk.';
            break;
        case 'Rain':
            tips = 'Don\'t forget your umbrella!';
            break;
        case 'Snow':
            tips = 'Perfect day for a snowball fight!';
            break;
        case 'Thunderstorm':
            tips = 'Stay indoors and stay safe!';
            break;
        default:
            tips = 'Weather conditions are variable.';
            break;
    }
    document.getElementById('weather-tips').innerText = tips;
}
