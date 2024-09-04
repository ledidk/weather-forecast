document.addEventListener('DOMContentLoaded', function () {
    // Read and parse the CSV file
    Papa.parse('city_coordinates.csv', {
        download: true,
        header: true,
        complete: function(results) {
            const data = results.data;

            // Get the dropdown element
            const dropdown = document.getElementById('options');

            // Populate the dropdown with city and country names
            data.forEach(cityData => {
                const option = document.createElement('option');
                option.value = JSON.stringify({ lat: cityData.latitude, lon: cityData.longitude });
                option.text = `${cityData.city}, ${cityData.country}`;
                dropdown.appendChild(option);
            });
        }
    });
});

document.getElementById('options').addEventListener('change', function() {
    const selectedData = this.value ? JSON.parse(this.value) : null;
    showLoader();
    if (selectedData) {
        const latitude = selectedData.lat;
        const longitude = selectedData.lon;
        // Use latitude and longitude to fetch weather data
        fetchWeatherData(latitude, longitude);
    } else {
        // Clear weather data if no city is selected
        showMessage('No data available or an error occurred. Please try again later.');
        clearWeatherData();
        const timeoutId = setTimeout(() => {
            hideLoader();
            showMessage('No data available or an error occurred. Please try again later.');
        }, 60000); // 1 minute
    }
});

function showMessage(message) {
    const messageContainer = document.getElementById('message-container');
    messageContainer.style.display = 'block';
    messageContainer.innerHTML = `<p>${message}</p>`;
}

function fetchWeatherData(lat, lon) {
    const apiUrl = `http://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=meteo&output=json`; // Replace with desired product and output

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Fetched Weather Data:', data); // Log data to console
            if (data && data.dataseries) {
                displayWeatherData(data);
            } else {
                clearWeatherData();
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            clearWeatherData();
        });
}

function getImagePath(value) {
    switch (value) {
        case 1:
        case 2:
            return "/images/clear.png";
        case 3:
        case 4:
        case 5:
            return "/images/pcloudy.png";
        case 6:
        case 7:
            return "images/cloudy.png";
        default:
            return "images/mcloudy.png";
    }
}

function getCloudCoverDescription(value) {
    switch (value) {
        case 1:
        case 2:
            return "Clear";
        case 3:
        case 4:
        case 5:
            return "Partly Cloudy";
        case 6:
        case 7:
            return "Cloudy";
        default:
            return "Very Cloudy";
    }
}

function formatDate(timepoint) {
    const date = new Date();
    date.setHours(date.getHours() + timepoint);
    const options = { weekday: 'short', month: 'short', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
}

function displayWeatherData(data) {
    if (!data || !data.dataseries || data.dataseries.length === 0) {
        console.error('No weather data available');
        return;
    }

    // Get current date and time
    const now = new Date();
    const currentDay = now.getDate(); // Day of the month
    const currentHour = now.getHours(); // Current hour
    // Log the city and country
    console.log(`Selected City: ${city}`);
    console.log(`Selected Country: ${country}`);
    // Log the entire data object for reference
    console.log('Displaying Weather Data:', data);


    

    const forecastContainer = document.querySelector('.flex-container');
    forecastContainer.innerHTML = ''; // Clear existing forecasts

    // Loop through the first 7 days of the forecast
    for (let i = 0; i < 7; i++) {
        const forecast = data.dataseries[i];
        const forecastDate = formatDate(forecast.timepoint);

        // Create a forecast element
        const forecastElement = document.createElement('div');
        forecastElement.classList.add('forecast');

        // Populate the date
        const dateElement = document.createElement('h4');
        dateElement.classList.add('date');
        dateElement.textContent = forecastDate;
        forecastElement.appendChild(dateElement);

        // Populate the weather image
        const weatherImageElement = document.createElement('div');
        weatherImageElement.classList.add('weather-image');
        const imgElement = document.createElement('img');
        imgElement.src = getImagePath(forecast.cloudcover);
        imgElement.alt = getCloudCoverDescription(forecast.cloudcover);
        weatherImageElement.appendChild(imgElement);
        forecastElement.appendChild(weatherImageElement);

        // Populate weather forecast data
        const weatherForecastDataElement = document.createElement('div');
        weatherForecastDataElement.classList.add('weather-forecast-data');

        // Precipitation
        const precipitationElement = document.createElement('h3');
        precipitationElement.classList.add('precipitation');
        precipitationElement.textContent = forecast.prec_type !== 'none' ? forecast.prec_type : 'No precipitation';
        weatherForecastDataElement.appendChild(precipitationElement);

        // Clouds
        const cloudsElement = document.createElement('p');
        const cloudsSpan = document.createElement('span');
        cloudsSpan.classList.add('clouds');
        cloudsSpan.textContent = getCloudCoverDescription(forecast.cloudcover);
        cloudsElement.appendChild(cloudsSpan);
        cloudsElement.appendChild(document.createTextNode(' Very cloudy'));
        weatherForecastDataElement.appendChild(cloudsElement);

        // Temperature
        const temperatureElement = document.createElement('p');
        const temperatureSpan = document.createElement('span');
        temperatureSpan.classList.add('temperature');
        temperatureSpan.textContent = `${forecast.temp2m} °C`;
        temperatureElement.textContent = 'Temperature: ';
        temperatureElement.appendChild(temperatureSpan);
        weatherForecastDataElement.appendChild(temperatureElement);

        forecastElement.appendChild(weatherForecastDataElement);

        // Append forecast element to the container
        forecastContainer.appendChild(forecastElement);
    }
}

function showLoader() {
    document.querySelector('div.loader-wrapper').style.display = 'block';
    document.querySelector('div.weather-forecast').style.display = 'none';
}

function hideLoader() {
    document.querySelector('div.loader-wrapper').style.display = 'none';
    document.querySelector('div.weather-forecast').style.display = 'block';
}