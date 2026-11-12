// ===============================
// GET HTML ELEMENTS
// ===============================

let cityInput =
    document.getElementById("cityInput");

let searchBtn =
    document.getElementById("searchBtn");

let error =
    document.getElementById("error");

let cityResults =
    document.getElementById("cityResults");



// ===============================
// SEARCH BUTTON
// ===============================

searchBtn.addEventListener("click", function () {

    searchCity();

});



// ===============================
// ENTER KEY
// ===============================

cityInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {

        searchCity();

    }

});



// ===============================
// SEARCH CITY
// ===============================

async function searchCity() {

    let city =
        cityInput.value.trim();


    // Empty input
    if (city === "") {

        error.textContent =
            "Please enter a city name.";

        cityResults.innerHTML = "";

        return;
    }


    error.textContent = "";

    cityResults.innerHTML =
        "<p>Searching...</p>";


    try {

        // ===============================
        // CITY SEARCH API
        // ===============================

        let response = await fetch(

            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=5&language=en&format=json`

        );


        let data =
            await response.json();


        // ===============================
        // CITY NOT FOUND
        // ===============================

        if (!data.results) {

            cityResults.innerHTML = "";

            error.textContent =
                "City not found. Please enter a valid city.";

            return;
        }


        // Clear old results
        cityResults.innerHTML = "";


        // ===============================
        // DISPLAY CITY OPTIONS
        // ===============================

        data.results.forEach(function (place) {

            let button =
                document.createElement("button");


            button.className =
                "city-option";


            let state =
                place.admin1
                    ? `, ${place.admin1}`
                    : "";


            button.textContent =
                `📍 ${place.name}${state}, ${place.country}`;


            // ===============================
            // CITY CLICK
            // ===============================

            button.addEventListener(
                "click",
                function () {

                    getWeather(place);

                }
            );


            cityResults.appendChild(button);

        });


    }
    catch (err) {

        console.log(err);

        cityResults.innerHTML = "";

        error.textContent =
            "Something went wrong. Please try again.";

    }

}



// ===============================
// GET WEATHER
// ===============================

async function getWeather(place) {

    let weatherDetails =
        document.getElementById(
            "weatherDetails"
        );


    try {

        // ===============================
        // WEATHER API
        // ===============================

        let response = await fetch(

            `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`

        );


        let data =
            await response.json();


        // ===============================
        // SHOW WEATHER SECTION
        // ===============================

        weatherDetails.classList.remove(
            "hidden"
        );


        cityResults.innerHTML = "";

        error.textContent = "";



        // ===============================
        // CITY NAME
        // ===============================

        document.getElementById(
            "cityName"
        ).textContent =
            `${place.name}, ${place.country}`;



        // ===============================
        // DATE
        // ===============================

        let date =
            new Date(data.current.time);


        document.getElementById(
            "date"
        ).textContent =
            date.toLocaleString();



        // ===============================
        // TEMPERATURE
        // ===============================

        document.getElementById(
            "temperature"
        ).textContent =
            Math.round(
                data.current.temperature_2m
            ) + "°C";



        // ===============================
        // HUMIDITY
        // ===============================

        document.getElementById(
            "humidity"
        ).textContent =
            data.current.relative_humidity_2m
            + "%";



        // ===============================
        // WIND SPEED
        // ===============================

        document.getElementById(
            "wind"
        ).textContent =
            data.current.wind_speed_10m
            + " km/h";



        // ===============================
        // FEELS LIKE
        // ===============================

        document.getElementById(
            "feels"
        ).textContent =
            Math.round(
                data.current.apparent_temperature
            ) + "°C";



        // ===============================
        // WEATHER CONDITION
        // ===============================

        let condition =
            getWeatherCondition(
                data.current.weather_code
            );


        document.getElementById(
            "condition"
        ).textContent =
            condition.text;


        document.getElementById(
            "weatherIcon"
        ).textContent =
            condition.icon;



        // ===============================
        // FORECAST
        // ===============================

        displayForecast(
            data.daily
        );



        // ===============================
        // LOCAL STORAGE
        // ===============================

        saveRecentSearch(
            place.name
        );


        localStorage.setItem(
            "selectedCity",
            place.name
        );



        // ===============================
        // SCROLL TO WEATHER
        // ===============================

        weatherDetails.scrollIntoView({
            behavior: "smooth"
        });


    }
    catch (err) {

        console.log(err);

        error.textContent =
            "Unable to get weather data.";

    }

}



// ===============================
// WEATHER CONDITION
// ===============================

function getWeatherCondition(code) {


    if (code === 0) {

        return {
            text: "Clear Sky",
            icon: "☀️"
        };

    }


    if (code >= 1 && code <= 3) {

        return {
            text: "Partly Cloudy",
            icon: "🌤️"
        };

    }


    if (code >= 45 && code <= 48) {

        return {
            text: "Foggy",
            icon: "🌫️"
        };

    }


    if (code >= 51 && code <= 67) {

        return {
            text: "Rain",
            icon: "🌧️"
        };

    }


    if (code >= 71 && code <= 77) {

        return {
            text: "Snow",
            icon: "❄️"
        };

    }


    if (code >= 80 && code <= 82) {

        return {
            text: "Rain Showers",
            icon: "🌦️"
        };

    }


    if (code >= 95) {

        return {
            text: "Thunderstorm",
            icon: "⛈️"
        };

    }


    return {
        text: "Unknown",
        icon: "🌤️"
    };

}



// ===============================
// DISPLAY FORECAST
// ===============================

function displayForecast(daily) {

    let container =
        document.getElementById(
            "forecastContainer"
        );


    container.innerHTML = "";


    for (
        let i = 0;
        i < 5;
        i++
    ) {


        let date =
            new Date(
                daily.time[i]
            );


        let day =
            date.toLocaleDateString(
                "en-US",
                {
                    weekday: "short"
                }
            );


        let condition =
            getWeatherCondition(
                daily.weather_code[i]
            );


        let card =
            document.createElement(
                "div"
            );


        card.className =
            "forecast-card";


        card.innerHTML = `

            <p class="day">
                ${day}
            </p>

            <div class="icon">
                ${condition.icon}
            </div>

            <p class="max">
                ${Math.round(
                    daily.temperature_2m_max[i]
                )}°C
            </p>

            <p class="min">
                ${Math.round(
                    daily.temperature_2m_min[i]
                )}°C
            </p>

        `;


        container.appendChild(card);

    }

}



// ===============================
// SAVE RECENT SEARCH
// ===============================

function saveRecentSearch(city) {

    let recent =
        JSON.parse(
            localStorage.getItem(
                "recentCities"
            )
        ) || [];


    // Remove duplicate
    recent =
        recent.filter(function (item) {

            return item.toLowerCase()
                !== city.toLowerCase();

        });


    // Add newest search
    recent.unshift(city);


    // Keep only 5
    recent =
        recent.slice(0, 5);


    // Save
    localStorage.setItem(
        "recentCities",
        JSON.stringify(recent)
    );

}



// ===============================
// LOAD SAVED CITY
// ===============================

let savedCity =
    localStorage.getItem(
        "selectedCity"
    );


if (savedCity) {

    cityInput.value =
        savedCity;

}