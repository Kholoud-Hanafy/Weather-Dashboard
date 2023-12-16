var searchbutton = document.querySelector(".search-btn");

var cityInput = document.querySelector(".cityinput");
var weatherCardsDiv =  document.querySelector(".weather-cards");
var API_KEY = "f58e339ad805d1bf5f42d2e1371badf1";
 var  createWeatherCard = (weatherItem) => {
    return ` <li class="card">
                    <h2>(${weatherItem.dt_txt})</h2>
                    <img class="weatherImg" src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
                    <h4>Temp : ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                    <h4>Wind :${weatherItem.wind.speed} M/S</h4>
                    <h4>Humidity :${weatherItem.main.humidity} %</h4>

                </li>`;
 }
var getWeatherDetails = (cityName, lon, lat) => {

var WETHER_API_URL =`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
   
     fetch(WETHER_API_URL).then(res => res.json()).then(data => {

        //filter the forecasts to get only one forecast per day

        var uniqueforecastDays =[];
      

         var fivedaysforcast = data.list.filter(forecast => {
          var forecastdate = new Date(forecast.dt_txt).toLocaleDateString();
          if(!uniqueforecastDays.includes(forecastdate)) {
           return uniqueforecastDays.push(forecastdate);
          }
       });
        console.log(fivedaysforcast);
        fivedaysforcast.forEach(weatherItem =>{
            weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(weatherItem));
            
        })
     }).catch(() => {

         alert("An error occurred while fetching the weather forecast!");
       });




}

var getcitycoordinates = () => {
 var cityName = cityInput.value.trim();

 if(!cityName) return;

 var GEOCODING_API_URL =`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
   fetch( GEOCODING_API_URL).then(res => res.json()).then(data => {
     if(!data.length) return alert(`No coordinates found for ${ cityName}!`);

     var {name, lon, lat } = data[0];
     getWeatherDetails(name, lon, lat);

   }).catch(() => {

    alert("An error occurred while fetching the coordinates!");
   });
}
searchbutton.addEventListener("click", getcitycoordinates);