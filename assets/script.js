var APIkey = '4e0bdee39227f6f98449e66d282e5f70';

var cityLat = "";
var cityLon = "";
var searchCity = "";
var cityName = "";
var stateCode = "";
var currentWeather = document.querySelector("#current-weather-container");
var forecast = document.querySelector("#forecast-container");
var searchBtn = document.querySelector(".btn");
var searchHistory = JSON.parse(localStorage.getItem("city-name")) || [];

//Display search history from local storage
function showSearchHistory() {
    var searchHistBtns = document.querySelector("#search-history");
    for (let i=0; i<searchHistory.length; i++) {
        var searchBtn = document.createElement("button");
        searchBtn.setAttribute("class", "btn btn-secondary btn-lg");
        searchBtn.innerHTML = searchHistory[i];
        searchHistBtns.appendChild(searchBtn);
    }
}
showSearchHistory();

//Get city name from user input 
searchBtn.addEventListener("click", function(event){
    event.preventDefault();
    searchCity = document.querySelector("#city-search").value;
    console.log(searchCity);
    var cityArray = searchCity.split(',')
    cityName = cityArray[0].trim();
    // stateCode = cityArray[1].trim();
    console.log(cityName);
    // console.log(stateCode);
    storeSearchHistory();
    getCurrentWeather();
});
//uses the open weather API to grab current weather forecast and coordinates
function getCurrentWeather() {
    var locationUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + cityName + ',' + stateCode + '&appid=' + APIkey;
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
        <div class="card" style="width: 50rem;">
        <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png" class="w-25" alt="...">
        <div class="card-body">
            <h5 class="card-title">City Name: ${data.name}</h5>
            <p class="card-text">Humidity: ${data.main.humidity}</p>
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


//uses coordinates to get weather with the OpenWeather API
function getWeather() {
    var weatherUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + cityLat + '&lon='+ cityLon + '&units=imperial&appid=' + APIkey;
    fetch(weatherUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        
        for (let i=0; i<data.list.length; i+=8){
            console.log(data.list[i]);
            var fiveDayWeatherHtml = `
        <div class="card" style="width: 10rem;">
        <img src="https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png" class="w-25" alt="...">
        <div class="card-body">
            <h5 class="card-title">City Name: ${data.list[i].name}</h5>
            <p class="card-text">Humidity: ${data.list[i].main.humidity}</p>
        </div>
        </div>
        `
        var htmlDiv = document.createElement("div")
        htmlDiv.innerHTML = fiveDayWeatherHtml
        forecast.appendChild(htmlDiv)
        }
 
      });
  }

function storeSearchHistory() {
    searchHistory.push(searchCity);
    localStorage.setItem("city-name", JSON.stringify(searchHistory));
}