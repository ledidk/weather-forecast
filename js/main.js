document.addEventListener('DOMContentLoaded', function () {
    Papa.parse('city_coordinates.csv', {
        download: true,
        header: true,
        complete: function (results) {
            const data = results.data;
            const dropdown = document.getElementById('options');

            data.forEach(cityData => {
                const option = document.createElement('option');
                option.value = JSON.stringify({ lat: cityData.latitude, lon: cityData.longitude });
                option.text = `${cityData.city}, ${cityData.country}`;
                dropdown.appendChild(option);
            });
        }
    });
});

document.getElementById('options').addEventListener('change', function () {
    const selectedData = this.value ? JSON.parse(this.value) : null;

    if (selectedData) {
        const latitude = selectedData.lat;
        const longitude = selectedData.lon;

        hideLoader();
        fetchWeatherData(latitude, longitude);
    } else {
        clearWeatherData();
    }
});

function fetchWeatherData(lat, lon) {
    const apiUrl = `https://www.7timer.info/bin/api.pl?lon=${lon}&lat=${lat}&product=meteo&output=json`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.dataseries) {
                displayWeatherData(data.dataseries);
            } else {
                clearWeatherData();
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            clearWeatherData();
        });
}

function displayWeatherData(forecastData) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = ''; // Clear previous content

    forecastData.forEach((forecast, index) => {
        if (index < 7) { // Limit to 7 days
            const date = new Date();
            date.setDate(date.getDate() + index); // Increment date for each forecast day

            const forecastElement = document.createElement('div');
            forecastElement.classList.add('forecast');

            forecastElement.innerHTML = `
                <h4 class="date">${date.toString().slice(0, 3)} ${date.toString().slice(4, 7)} ${date.getDate()}</h4>
                <div class="weather-image">
                    <img src="${getImagePath(forecast.cloudcover)}" alt="">
                </div>
                <div class="weather-forecast-data">
                    <h3 class="precipitation">${getPrecipitationType(forecast.prec_type)}</h3>
                    <p><span class="clouds">${getCloudCoverDescription(forecast.cloudcover)}</span></p>
                    <p>Temperature: <span class="temperature">${forecast.temp2m} °C</span></p>
                </div>
            `;
            forecastContainer.appendChild(forecastElement);
        }
    });

    document.querySelector('.weather-forecast').style.display = 'block';
}

function getImagePath(value) {
    switch (value) {
        case 1:
        case 2:
            return "images/clear.png";
        case 3:
        case 4:
        case 5:
            return "images/pcloudy.png";
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

function getPrecipitationType(value) {
    switch (value) {
        case 'snow':
            return 'Snow';
        case 'rain':
            return 'Rain';
        case 'none':
            return 'clear';
        default:
            return 'Unknown precipitation';
    }
}

function hideLoader() {
    document.querySelector('.loader-wrapper').style.display = 'none';
}

function clearWeatherData() {
    document.querySelector('.weather-forecast').style.display = 'none';
}
