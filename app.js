const apiKey = ; // Replace with your OpenWeatherMap API key

document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.querySelector(".search-form");
    const searchInput = document.getElementById("search");
    const weatherContainer = document.querySelector(".weather-container");

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const cityName = searchInput.value.trim();
        if (cityName !== "") {
            getWeatherData(cityName);
            searchInput.value = "";
        }
    });

    // Initial weather data for a default city (you can change this)
    getWeatherData("London");
});

async function getWeatherData(city) {
    const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    try {
        const [weatherResponse, forecastResponse] = await Promise.all([
            fetch(weatherUrl),
            fetch(forecastUrl)
        ]);

        if (!weatherResponse.ok || !forecastResponse.ok) {
            throw new Error("City not found");
        }

        const [weatherData, forecastData] = await Promise.all([
            weatherResponse.json(),
            forecastResponse.json()
        ]);

        updateWeatherUI(weatherData, forecastData);
    } catch (error) {
        console.error(error.message);
        // Display an error message to the user
        alert("City not found. Please enter a valid city name.");
    }
}

function updateWeatherUI(weatherData, forecastData) {
    const weatherInfo = document.querySelector(".weather-info");
    const temperature = document.querySelector(".temperature h2");
    const details = document.querySelector(".details");
    const forecastContainer = document.querySelector(".forecast");

    // Update current weather information
    const iconUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`;
    weatherInfo.innerHTML = `
        <img src="${iconUrl}" alt="Weather Icon">
        <div class="temperature">
            <h2>${Math.round(weatherData.main.temp - 273.15)} ℃</h2>
            <p>${weatherData.weather[0].description}</p>
        </div>
    `;

    // Update details
    details.innerHTML = `
        <p><i class="fas fa-map-marker-alt"></i> ${weatherData.name}, ${weatherData.sys.country}</p>
        <p><i class="fas fa-calendar-alt"></i> ${new Date().toLocaleString()}</p>
        <p><i class="fas fa-cloud"></i> ${weatherData.weather[0].description}</p>
    `;

    // Update forecast
    forecastContainer.innerHTML = `
        <h3>5-Day Forecast</h3>
        <!-- Add forecast content here -->
    `;
    // You can update the forecastContainer with the forecastData as needed
}
