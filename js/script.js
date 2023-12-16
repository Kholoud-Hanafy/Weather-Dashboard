var searchbutton = document.querySelector(".search-btn");
var locationButton = document.querySelector(".location-btn");
var cityInput = document.querySelector(".cityinput");
var weatherCardsDiv =  document.querySelector(".weather-cards");
var currentWeatherDiv =  document.querySelector(".current-weather");

var API_KEY = "f58e339ad805d1bf5f42d2e1371badf1";

var  createWeatherCard = (cityName ,weatherItem ,index) => {
   if(index==0){
      return ` <div class="details">
                     <h2>${cityName}(${weatherItem.dt_txt})</h2>
                     <h4>Tempretur : ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                     <h4>Wind :${weatherItem.wind.speed} M/S</h4>
                     <h4>Humidity :${weatherItem.main.humidity} %</h4>

               </div>
               <div class="icon">
               <img class="weatherImg" src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                     <h4>${weatherItem.weather[0].description}</h4>
               </div>`
   }else{
      return ` <li class="card">
                  <h2>(${weatherItem.dt_txt})</h2>
                  <img class="weatherImg" src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
                  <h4>Temp : ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                  <h4>Wind :${weatherItem.wind.speed} M/S</h4>
                  <h4>Humidity :${weatherItem.main.humidity} %</h4>
               </li>`;
   }
}
var getWeatherDetails = (cityName, lon, lat) => {

var WETHER_API_URL =`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
   
   fetch(WETHER_API_URL).then(res => res.json()).then(data => {

        //filter the forecasts to get only one forecast per day

      var uniqueforecastDays =[];
      

         var fivedaysforcast = data.list.filter(forecast => {
         var forecastdate = new Date(forecast.dt_txt).getDate();
         if(!uniqueforecastDays.includes(forecastdate)) {
         return uniqueforecastDays.push(forecastdate);
         }
         });
         
         createWeatherCard.innerHTML ="";
         cityInput.value = "";
         weatherCardsDiv.innerHTML = " ";
         currentWeatherDiv.innerHTML = "";

         console.log(fivedaysforcast);
         fivedaysforcast.forEach((weatherItem , index) =>{
            if(index === 0){
               currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName ,weatherItem ,index));
            } else {
               weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName ,weatherItem ,index));
         }
            
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
};

var getUsercoordinates= () =>{
   navigator.geolocation.getCurrentPosition(
      position => {
         var {latitude, longitude } = position.coords;
         var REVERSE_GEOCODING_URL =`http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=&appid=${API_KEY}`;
         fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
            var {name } = data[0];
            getWeatherDetails(name, latitude, longitude);
            }).catch(() => {
         
            alert("An error occurred while fetching the City!");
            });
      },

      error => {
         if(error.code === error.PERMISSION_DENIED){
            alert('Geolocation request deined. please reset location permission to grant access again.')
         }
      }
   );
}
searchbutton.addEventListener("click", getcitycoordinates);
locationButton.addEventListener("click", getUsercoordinates);
cityInput.addEventListener("keyup", function(e) {

   if( e.key === "Enter"){
      getcitycoordinates();
   };
});


