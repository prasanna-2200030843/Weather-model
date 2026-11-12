// Get the search input
let homeCity = document.getElementById("homeCity");

// Get the search button
let homeSearchBtn = document.getElementById("homeSearchBtn");


// Search button event
homeSearchBtn.addEventListener("click", function () {

    let city = homeCity.value.trim();


    // Check empty input
    if (city === "") {

        alert("Please enter a city name.");

        return;
    }


    // Store selected city
    localStorage.setItem("selectedCity", city);


    // Open search page
    window.location.href = "search.html";

});


// Allow Enter key to search
homeCity.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {

        homeSearchBtn.click();

    }

});


// Display recent searches
displayRecentSearches();


function displayRecentSearches() {

    let container =
        document.getElementById("recentCities");


    // Get data from Local Storage
    let recent =
        JSON.parse(
            localStorage.getItem("recentCities")
        ) || [];


    container.innerHTML = "";


    // No searches
    if (recent.length === 0) {

        container.innerHTML =
            `<p class="no-recent">
                No recent searches yet.
            </p>`;

        return;
    }


    // Display every city
    recent.forEach(function (city) {

        let button =
            document.createElement("button");


        button.className = "recent-city";


        button.textContent =
            "📍 " + city;


        // Click recent city
        button.addEventListener("click", function () {

            localStorage.setItem(
                "selectedCity",
                city
            );


            window.location.href =
                "search.html";

        });


        container.appendChild(button);

    });

}