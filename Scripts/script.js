var APIKey = "e2a4adc7df9c811b491a471a203cda9d";
var search_i_e = $("#search_i")
var search_b_e = $("#search_b")
var city_name_date_h2_e = $("#city_name_date_h2")
var temp_l_e = $("#temp_l")
var humidity_l_e = $("#humidity_l")
var wind_speed_l_e = $("#wind_speed_l")
var uv_index_l_e = $("#uv_index_l")
var city_row_e = $("#city_row")
var cities_e = $(".cities")

// var date_1_e = $("#date_1")
// var date_1_e = $("#date_2")
// var date_1_e = $("#date_3")
// var date_1_e = $("#date_4")
// var date_1_e = $("#date_5")

var today = new Date();
// console.log(today)
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;
console.log(today)
// var x = document.getElementById("demo");

// geocoder = new google.maps.Geocoder();

function getLocation() {
    // Make sure browser supports this feature
    if (navigator.geolocation) {
      // Provide our showPosition() function to getCurrentPosition
      navigator.geolocation.getCurrentPosition(showPosition);
    } 
    else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  // This will get called after getCurrentPosition()
  function showPosition(position) {
    // Grab coordinates from the given object
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    console.log("Your coordinates are Latitude: " + lat + " Longitude " + lon);

  }

// getLocation();
// var search_city = search_i_e.val();

function get_todays_weather(search_city) {
    var search_city = search_city
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?" + "q=" + search_city + "&units=imperial&appid=" + APIKey;

    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({url: queryURL,method: "GET"}).then(function(response) {

        var name_data = response.name
        var temp_data = response.main.temp 
        temp_data = temp_data + "°F";
        var humidity_data = response.main.humidity + "%"
        var wind_data = response.wind.speed + " mph"
        var long = response.coord.lon;
        var lat = response.coord.lat;
        get_todays_uv_index(lat, long)

        city_name_date_h2_e.text(name_data + " (" + today + ")");
        temp_l_e.text("Temperature: " + temp_data);
        humidity_l_e.text("Humidity: " + humidity_data);
        wind_speed_l_e.text("Wind Speed: " + wind_data); 
        get_forcast(search_city, 1, 9, 1);
        get_forcast(search_city, 10, 17, 2);
        get_forcast(search_city, 18, 25, 3);
        get_forcast(search_city, 26, 33, 4);
        get_forcast(search_city, 34, 39, 5);
        
    })  
}

function get_todays_uv_index(lat, long) {
    var uvqueryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + long + "&units=imperial&appid=" + APIKey;
    $.ajax({url: uvqueryURL,method: "GET"}).then(function(response) {
      var uv_data = response.value
      uv_index_l_e.text("UV Index: " + uv_data)

  })  
}

function get_forcast(search_city, start, end, num) {
  var forcastqueryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + search_city + "&units=imperial&appid=" + APIKey;
  $.ajax({url: forcastqueryURL,method: "GET"}).then(function(response) {
    // console.log(response.list)
    // var num = 0;
    get_forcast_date(response, start, num);
    get_forcast_weather(response, start, end, num);
    get_forcast_max_temp(response, start, end, num);
    get_forcast_min_temp(response, start, end, num);
    // var num = 0
    get_forcast_humidity(response, start, end, num);
    // var weather_data = response[0]
    // console.log(weather_data)
    
    
    }) 
}

function get_forcast_date(response, start, num) {
  // Date
  
  for (var i = 1; i < 6; i++){
    // num++
    var date = response.list[start].dt_txt
    // console.log(date)
    var dd = date.slice(8, 10);
    var mm = date.slice(5, 7);
    var yyyy = date.slice(2,4);
    date = mm + '/' + dd + '/' + yyyy;
    // console.log(date)
    var forcast_date_e = $("#date_" + num)
    forcast_date_e.text(date);
    // print(forcast_date_e)
    
    
  }

}

function print(x){
  console.log(x)
}

function get_forcast_weather(response, start, end, num) {
  var start = start + 5
  var weather_data = response.list[start].weather[0].main
  console.log(weather_data)
  var forcast_icon_e = $("#icon_" + num)
  if (weather_data === "Clear"){
    forcast_icon_e.attr("class", "fas fa-sun weather_icon")
  }
  else if (weather_data === "Clouds"){
    forcast_icon_e.attr("class", "fas fa-cloud weather_icon")
  }
  else if (weather_data === "Thunderstorm"){
    forcast_icon_e.attr("class", "fas fa-bolt weather_icon")
  }
  else if (weather_data === "Rain" || weather_data === "Drizzle" ){
    // forcast_icon_e.classList.remove("mystyle")
    forcast_icon_e.attr("class", "fas fa-cloud-showers-heavy weather_icon")
  }
  else if (weather_data === "Snow") {
    forcast_icon_e.attr("class", "fas fa-snowflake weather_icon")
    

  }

}

function get_forcast_max_temp(response, start, end, num) {
  // Max Temp
  var max_temp_a = [];
  for (var i = start; i < end; i++){
    var max_temp = response.list[i].main.temp_max
    max_temp_a.push(max_temp);
  }
  var forcast_temp_max_e = $("#temp_" + num)
  forcast_temp_max_e.text("Temperature");
  forcast_temp_max_e.append("<br /> High " + max_temp + " - ");
  // print(forcast_temp_max_e)
}

function get_forcast_min_temp(response, start, end, num) {
  // Mim Temp
  var min_temp_a = [];
  for (var i = start; i < end; i++){
    var min_temp = response.list[i].main.temp_min
    min_temp_a.push(min_temp);
    // console.log(min_temp_a)
  }
  var min_temp = Math.min(...min_temp_a)
  var forcast_temp_min_e = $("#temp_" + num)
  forcast_temp_min_e.append("Low " + min_temp);
  // print(forcast_temp_min_e)
}



function get_forcast_humidity(response, start, end, num) {
  var start = start + 5
  var humidity = response.list[start].main.humidity
  console.log(humidity)
  print(num)
  var forcast_humidity_e = $("#humidity_" + num)
  forcast_humidity_e.text("Humidity " + humidity + "%");
  // var forcast_humidity_e = $("#humidity_" + num)
  // forcast_humidity_e.text(humidity + "%");
  print(forcast_humidity_e)
}


function major_cities() {
    console.log(this.dataset.city)
    var search_city = this.dataset.city
    get_todays_weather(search_city);

}




// Event Handlers

cities_e.on("click",major_cities);
search_b_e.on("click",function () {
  var search_city = search_i_e.val();
  get_todays_weather(search_city);
});
document.addEventListener("keypress", function (e) {
    if (e.key === 'Enter') {
        console.log("enter")
        // next_question();
        var search_city = search_i_e.val();
        get_todays_weather(search_city); 
      }
})




