var APIkey = '4e0bdee39227f6f98449e66d282e5f70';
var cityLat = "";
var cityLon = "";
var cityName = "";
var stateCode = "";
var currentWeather = document.querySelector("#current-weather-container");
var forecast = document.querySelector("#forecast-container");
var searchBtn = document.querySelector(".btn");
var searchHistory = JSON.parse(localStorage.getItem("city-name")) || [];
var searchHistBtns = "";
var today = dayjs();
var currentDate = today.format("dddd, MMMM D YYYY, h:mm a")

//Display search history from local storage
function showSearchHistory() {
    searchHistBtns = document.querySelector("#search-history");
    for (let i=0; i<searchHistory.length; i++) {
        var searchHistBtn = document.createElement("button");
        searchHistBtn.setAttribute("class", "btn btn-secondary btn-lg p-2 m-1");
        searchHistBtn.textContent = searchHistory[i];
        searchHistBtns.appendChild(searchHistBtn);
    }
}
showSearchHistory();

//searches on click of button for previous searches
searchHistBtns.addEventListener("click", function(event){
    if (event.target.tagName === "BUTTON"){
        cityName = event.target.innerHTML;
        getCurrentWeather();
    }
})

//Get city name from user input 
searchBtn.addEventListener("click", function(event){
    event.preventDefault();
    cityName = document.querySelector("#city-search").value;
    console.log(cityName);
    storeSearchHistory();
    getCurrentWeather();
});

//uses the open weather API to grab current weather forecast and coordinates
function getCurrentWeather() {
    var locationUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + cityName + ',' + stateCode + '&appid=' + APIkey + '&units=imperial';
    fetch(locationUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) { 
        console.log(data)
        cityLat = data.coord.lat;
        cityLon= data.coord.lon;
        console.log(cityLat)
        console.log(cityLon)
        var currentWeatherHtml = `
        <div class="card mb-3" style="max-width: 540px;">
            <div class="row g-0">
                <div class="col-md-4">
                <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png" class="img-fluid rounded-start w-100 h-100" alt="...">
                </div>
                <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title">${data.name}; ${currentDate}</h5>
                    <p class="card-text">Tempurature: ${data.main.temp}°F</p>
                    <p class="card-text">Wind: ${data.wind.speed}mph</p>
                    <p class="card-text">Humidity: ${data.main.humidity}%</p>
                </div>
                </div>
            </div>
        `
        var htmlDiv = document.createElement("div")
        htmlDiv.innerHTML = currentWeatherHtml
        currentWeather.appendChild(htmlDiv);
      })
      .then(function (){
        getWeather()
      });
  }

//uses coordinates to get five-day weather forecast
function getWeather() {
    var weatherUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + cityLat + '&lon='+ cityLon + '&units=imperial&appid=' + APIkey + '&units=imperial';
    fetch(weatherUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        
        for (let i=0; i<data.list.length; i+=8){
            console.log(data.list[i]);
            var dateArray = data.list[i].dt_txt.split(" ")
            var fiveDayWeatherHtml = `
        <div class="card" style="width: 10rem;">
        <img src="https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png" class="w-28 h-28" alt="...">
        <div class="card-body">
            <h5 class="card-title">${dateArray[0]}</h5>
            <p class="card-text">Tempurature: ${data.list[i].main.temp}°F</p>
            <p class="card-text">Wind: ${data.list[i].wind.speed}mph</p>
            <p class="card-text">Humidity: ${data.list[i].main.humidity}%</p>
        </div>
        </div>
        `
        var htmlDiv = document.createElement("div")
        htmlDiv.innerHTML = fiveDayWeatherHtml
        forecast.appendChild(htmlDiv)
        }
 
      });
  }

//stores searched cities in local storage
function storeSearchHistory() {
    searchHistory.push(cityName);
    localStorage.setItem("city-name", JSON.stringify(searchHistory));
}