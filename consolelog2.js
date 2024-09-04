function formatDate(timepoint) {
    // Create a new date object based on the timepoint in hours since the start of the day
    const date = new Date();
    date.setHours(date.getHours() + timepoint); // Adjust to the correct forecast date/time

    // Get the day of the week, month, and day of the month
    const options = { weekday: 'short', month: 'short', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
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

            // Format the date using the first forecast timepoint in the day's forecast
            const formattedDate = formatDate(dayForecasts[0].timepoint);

            console.log(`Day ${dayIndex} Forecast: ${formattedDate}`);
            dayForecasts.forEach((forecast) => {
                console.log(`Date/Time: ${forecast.timepoint}`);
                console.log(`Cloud Cover: ${forecast.cloudcover !== -9999 ? forecast.cloudcover : 'Data not available'}`);
                console.log(`High Cloud: ${forecast.highcloud !== -9999 ? forecast.highcloud : 'Data not available'}`);
                console.log(`Low Cloud: ${forecast.lowcloud !== -9999 ? forecast.lowcloud : 'Data not available'}`);
                console.log(`Temperature: ${forecast.temp2m !== -9999 ? forecast.temp2m + ' °C' : 'Data not available'}`);
                console.log(`Precipitation Type: ${forecast.prec_type !== 'none' ? forecast.prec_type : 'Clear'}`);
                console.log('--------------------------');
            });
        }
    });
}
