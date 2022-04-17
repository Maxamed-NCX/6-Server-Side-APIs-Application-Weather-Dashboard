var cities = [];

let cityFormElement=document.querySelector("#city-search-form");
let cityInputElement=document.querySelector("#city");
let weatherContainerEl=document.querySelector("#current-weather-block");
let citySearchInputEl = document.querySelector("#searched-city");
let forecastTitleEl = document.querySelector("#forecast");
let forecastContainerEl = document.querySelector("#five-day-container");
let pastSearchBtnElement = document.querySelector("#past-search-buttons");


var saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};

const getCityWeather = function(city){
  if(city){
    const apiKey = "35314a510b32c680a9a42823749ad9a0"
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayWeather(data, city);
        });
    });
  }
};


let displayWeather = function(weather, searchCity){
   //clear old weather content
   weatherContainerEl.textContent= "";  
   citySearchInputEl.textContent=searchCity;
   

   //console.log(weather);

   //create date element column
   let currentDate = document.createElement("span")
   currentDate.textContent=" (" + moment(weather.dt.value).format("dddd, MMMM D, YYYY, h:mm a") + ") ";
   citySearchInputEl.appendChild(currentDate);

   //create an image element for icon displayed
   let weatherIcon = document.createElement("img");
   weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
   citySearchInputEl.appendChild(weatherIcon);

   //create a span element to for temperature data
   let tempElement = document.createElement("span");
   tempElement.textContent = "Current Temp: " + weather.main.temp + " °F";
   tempElement.classList = "list-group-item"
  
   //create a span element to for Humidity data
   let humidityEl = document.createElement("span");
   humidityEl.textContent = "Level Humidity: " + weather.main.humidity + " %";
   humidityEl.classList = "list-group-item"

   //create a span element to for Wind data
   let windSpeedEl = document.createElement("span");
   windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
   windSpeedEl.classList = "list-group-item"

   //append to temp container
   weatherContainerEl.appendChild(tempElement);

   //append to humidity container
   weatherContainerEl.appendChild(humidityEl);

   //append to wind speed container
   weatherContainerEl.appendChild(windSpeedEl);

   let lat = weather.coord.lat;
   let lon = weather.coord.lon;
   getUvIndex(lat,lon)
}

const getUvIndex = function(lat,lon){
    const apiKey = "35314a510b32c680a9a42823749ad9a0"
   
    const apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayUvIndex(data)
           // console.log(data)
        });
    });
    //console.log(lat); console.log(lon);
}
 
//append to UV Index container
let displayUvIndex = function(index){
    let uvIndexElement = document.createElement("div");
    uvIndexElement.textContent = "UV Index Scale: "
    uvIndexElement.classList = "list-group-item"

    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = index.value

    if(index.value <=3){
        uvIndexValue.classList = "favorable"
    }else if(index.value >3 && index.value<=8){
        uvIndexValue.classList = "moderate "
    }
    else if(index.value >8){
        uvIndexValue.classList = "severe"
    };

    uvIndexElement.appendChild(uvIndexValue);

    //append index to current weather
    weatherContainerEl.appendChild(uvIndexElement);
}



//append 5-day forcast
const get5Day = function(city){
  if(city){
    const apiKey = "35314a510b32c680a9a42823749ad9a0"
    const apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
           display5Day(data);
        });
    });
  }
};

const display5Day = function(weather){
    forecastContainerEl.textContent = " "
    forecastTitleEl.textContent = "5-Day Forecast:";
    forecastContainerEl.classList = "d-flex justify-content-between";
  
    

    const forecast = weather.list;
        for(var i=5; i < forecast.length; i=i+8){
       const dailyForecast = forecast[i];
        
       
       var forecastEl=document.createElement("div");
       forecastEl.classList = "d-flex card bg-secondary text-white mr-2 ml-1";
       
       //console.log(dailyForecast)

       //create date element
       let forecastDate = document.createElement("h5")
       forecastDate.textContent= moment.unix(dailyForecast.dt).format("MM/ D/ YY");
       forecastDate.classList = "card-header text-center bg-primary"
       forecastEl.appendChild(forecastDate);

       
       //create an image icon element
       let weatherIcon = document.createElement("img")
       weatherIcon.classList = "card-body text-center";
       weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  

       //append to forecast card
       forecastEl.appendChild(weatherIcon);
       
       //create temperature span
       var forecastTempEl=document.createElement("span");
       forecastTempEl.classList = "card-body text-center bg-info";
       forecastTempEl.textContent = dailyForecast.main.temp + " °F";

        //append to forecast card
        forecastEl.appendChild(forecastTempEl);

      //create humidity span
       var forecastHumidityEl=document.createElement("span");
       forecastHumidityEl.classList = "card-body text-center";
       forecastHumidityEl.textContent = dailyForecast.main.humidity + "  %";

       //append to forecast card
       forecastEl.appendChild(forecastHumidityEl);
       

        // create wind span
       var forecastWindspeedEl=document.createElement("span");
       forecastWindspeedEl.classList = "card-body text-center bg-info";
       forecastWindspeedEl.textContent = dailyForecast.wind.speed + " MPH";

       //append to forecast card
       forecastEl.appendChild(forecastWindspeedEl);

        console.log(forecastEl);
       //append to five day container
        forecastContainerEl.appendChild(forecastEl);
    }

}

var pastSearch = function(pastSearch){
 
    // console.log(pastSearch)

    pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
    pastSearchEl.setAttribute("data-city",pastSearch)
    pastSearchEl.setAttribute("type", "submit");

    pastSearchBtnElement.prepend(pastSearchEl);
}


var pastSearchHandler = function(event){
    // pastSearchBtnElement.innerHTML= " ";
    var city = event.target.getAttribute("data-city");
    console.log('event.target', event.target);
    if(city){
        getCityWeather(city);
        get5Day(city);
    }
}

// Clearing past log and forcast)
var formSumbitAction = function(event){
  event.preventDefault();
  var city = cityInputElement.value.trim();
  if(city){
      getCityWeather(city);
      get5Day(city);
      cities.unshift({city});
      cityInputElement.value = "";
      saveSearch();
      pastSearch(city);
  } else{
      alert("Please enter a City Name!");
  }
 
}

// Clearing past log and forcast)
cityFormElement.addEventListener("submit", formSumbitAction);
pastSearchBtnElement.addEventListener("click", pastSearchHandler);

var clearPastSearch = function(){
      forecastContainerEl.innerHTML=""
      pastSearchBtnElement.innerHTML=""
      forecastTitleEl.innerHTML=""
      weatherContainerEl.innerHTML=""
      citySearchInputEl.innerHTML=""
}
document.getElementById("clearCity").addEventListener("click", clearPastSearch)

