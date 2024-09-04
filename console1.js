function getCloudCoverDescription(value) {
    switch (value) {
        case 1:
            return "Very Few Clouds (0%-6%)";
        case 2:
            return "Few Clouds (6%-19%)";
        case 3:
            return "Scattered Clouds (19%-31%)";
        case 4:
            return "Partly Cloudy (31%-44%)";
        case 5:
            return "Mostly Cloudy (44%-56%)";
        case 6:
            return "Cloudy (56%-69%)";
        case 7:
            return "Overcast (69%-81%)";
        case 8:
            return "Very Overcast (81%-94%)";
        case 9:
            return "Completely Overcast (94%-100%)";
        default:
            return "Unknown Cloud Cover";
    }
}

function displayWeatherData(data, city, country) {
    // Ensure data and dataseries are present
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

    // Define an array to store daily forecasts
    const dailyForecasts = [];
    const forecastsPerDay = 8; // Assumes there are 8 forecasts per day (every 3 hours)

    // Iterate through dataseries to collect daily forecasts
    data.dataseries.forEach((forecast) => {
        const timepoint = forecast.timepoint; // Assumes timepoint is in hours since start of the day

        // Determine the forecast's hour and day
        const forecastHour = timepoint % 24; // Assuming timepoint is in hours
        const forecastDay = Math.floor(timepoint / 24); // Assuming each timepoint represents a day

        if (forecastDay < 7) { // Collect forecasts for the next 7 days
            // Check if the forecast for this hour is for the current day or a future day
            if (forecastHour === 0 || forecastHour === 12) { // Adjust to your preferred times (e.g., midnight, noon)
                if (!dailyForecasts[forecastDay]) {
                    dailyForecasts[forecastDay] = [];
                }
                dailyForecasts[forecastDay].push(forecast);
            }
        }
    });

    // Log daily forecasts for the next 7 days
    dailyForecasts.forEach((dayForecasts, index) => {
        if (dayForecasts && dayForecasts.length > 0) {
            const dayIndex = index + 1; // Day 1 to Day 7
            console.log(`Day ${dayIndex} Forecast:`);
            dayForecasts.forEach((forecast) => {
                console.log(`Date/Time: ${forecast.timepoint}`);
                console.log(`Cloud Cover (Total): ${getCloudCoverDescription(forecast.cloudcover)}`);
                console.log(`High Cloud Cover: ${getCloudCoverDescription(forecast.highcloud)}`);
                console.log(`Low Cloud Cover: ${getCloudCoverDescription(forecast.lowcloud)}`);
                console.log(`Temperature: ${forecast.temp2m} °C`);
                console.log(`Precipitation Type: ${forecast.prec_type}`);
                console.log('--------------------------');
            });
        }
    });
}
