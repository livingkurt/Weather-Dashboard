// Global Variables
var APIKey = "e2a4adc7df9c811b491a471a203cda9d";

// Assigning Elements to Variables
var search_i_e = $("#search_i")
var search_b_e = $("#search_b")
var city_name_date_h2_e = $("#city_name_date_h2")
var temp_l_e = $("#temp_l")
var humidity_l_e = $("#humidity_l")
var wind_speed_l_e = $("#wind_speed_l")
var uv_index_l_e = $("#uv_index_l")
var city_row_e = $("#city_row")
var cities_e = $(".cities")
var cities_b_e = $("#cities_b")
var city_row_e = $(".city_row")
var screen_size = $( document ).width();

// Get Todays Date
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = mm + '/' + dd + '/' + yyyy;


getLocation();

// Ask User if you can recieve location information
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
    // return [lat, lon];
    get_city_from_coord(lat, lon);
  }

function get_city_from_coord(lat, lon) {
  var search_city = search_city
  var queryURL = "https://nominatim.openstreetmap.org/reverse?format=json&lat=" + lat + "&lon=" + lon
  print(queryURL)

  $.ajax({url: queryURL,method: "GET"}).then(function(response) {
      var city = response.address.city
      print(city)
      get_todays_weather(city)

  })  
}




// Get Current Weather
function get_todays_weather(search_city) {
    var search_city = search_city
    // Set up URL
    var queryURL = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?" + "q=" + search_city + "&units=imperial&appid=" + APIKey;
    // Do an AJAX Request
    $.ajax({url: queryURL,method: "GET"}).then(function(response) {
        // Assign Variables to Request
        var name_data = response.name
        var temp_data = response.main.temp 
        temp_data = temp_data + "°F";
        var humidity_data = response.main.humidity + "%"
        var wind_data = response.wind.speed + " mph"
        var long = response.coord.lon;
        var lat = response.coord.lat;
        get_todays_uv_index(lat, long)

        // Update Elements with Information from API
        city_name_date_h2_e.text(name_data + " (" + today + ")");
        temp_l_e.text("Temperature: " + temp_data);
        humidity_l_e.text("Humidity: " + humidity_data);
        wind_speed_l_e.text("Wind Speed: " + wind_data); 
        get_5_day_forcast(search_city);
        
        
    })  
}
function get_5_day_forcast(search_city){
    // Day 1
    get_forcast(search_city, 1, 9, 1);
    // Day 2
    get_forcast(search_city, 10, 17, 2);
    // Day 3
    get_forcast(search_city, 18, 25, 3);
    // Day 4
    get_forcast(search_city, 26, 33, 4);
    // Day 5
    get_forcast(search_city, 34, 39, 5);
}


// Separate request for uv index
function get_todays_uv_index(lat, long) {
    // Set up URL
    var uvqueryURL = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + long + "&units=imperial&appid=" + APIKey;
    // Do an AJAX Request
    $.ajax({url: uvqueryURL,method: "GET"}).then(function(response) {
      // Get UV index from response
      var uv_data = response.value
      // Update Element with Information from API
      uv_index_l_e.text("UV Index: " + uv_data)

  })  
}
// Get info for 5 day forcast
function get_forcast(search_city, start, end, num) {
  // Set up URL
  var forcastqueryURL = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast?q=" + search_city + "&units=imperial&appid=" + APIKey;
  // Do an AJAX Request
  $.ajax({url: forcastqueryURL,method: "GET"}).then(function(response) {
    // Get Date from Request
    get_forcast_date(response, start, num);
    // Get weather conditions from Request
    get_forcast_weather(response, start, end, num);
    // Get high temp from Request
    get_forcast_max_temp(response, start, end, num);
    // Get low temp from Request
    get_forcast_min_temp(response, start, end, num);
    // Get humidity from Request
    get_forcast_humidity(response, start, end, num);
    }) 
}
// Get Date from Request
function get_forcast_date(response, start, num) {
  // Date
  for (var i = 1; i < 6; i++){
    // Get Specific response
    var date = response.list[start].dt_txt
    // Slice the day from the date string
    var dd = date.slice(8, 10);
    // Slice the month from the date string
    var mm = date.slice(5, 7);
    // Slice the year from the date string
    var yyyy = date.slice(2,4);
    // Combine the slices into the format you like
    date = mm + '/' + dd + '/' + yyyy;
    // Assign element to variable
    var forcast_date_e = $("#date_" + num)
    // Update Element with Information from API
    forcast_date_e.text(date);
  }

}

// Get weather conditions from Request
function get_forcast_weather(response, start, end, num) {
  // Choose from in the middle of the day
  var start = start + 5
  // Get Specific response
  var weather_data = response.list[start].weather[0].main
  // Assign element to variable
  var forcast_icon_e = $("#icon_" + num)
  // Decide what icon to place per weather condintions
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
    forcast_icon_e.attr("class", "fas fa-cloud-showers-heavy weather_icon")
  }
  else if (weather_data === "Snow") {
    forcast_icon_e.attr("class", "fas fa-snowflake weather_icon")
  }
}

// Get high temp from Request
function get_forcast_max_temp(response, start, end, num) {
  // Create an empty list to compare all of the high temperatures for that day
  var max_temp_a = [];
  // Loop through all of the data from that day
  for (var i = start; i < end; i++){
    // Get Specific response
    var max_temp = response.list[i].main.temp_max
    // Add response to the array
    max_temp_a.push(max_temp);
  }
  // Assign element to variable
  var forcast_temp_max_e = $("#temp_" + num)
  // Change the text for specific element
  forcast_temp_max_e.text("Temperature");
  // Update Element with Information from API
  forcast_temp_max_e.append("<br /> High " + max_temp + " - ");
}

// Get low temp from Request
function get_forcast_min_temp(response, start, end, num) {
  // Create an empty list to compare all of the low temperatures for that day
  var min_temp_a = [];
  // Loop through all of the data from that day
  for (var i = start; i < end; i++){
    // Get Specific response
    var min_temp = response.list[i].main.temp_min
    // Add response to the array
    min_temp_a.push(min_temp);
  }
  var min_temp = Math.min(...min_temp_a)
  // Assign element to variable
  var forcast_temp_min_e = $("#temp_" + num)
  // Update Element with Information from API
  forcast_temp_min_e.append("Low " + min_temp);
}


// Get humidity from Request
function get_forcast_humidity(response, start, end, num) {
  // Choose from in the middle of the day
  var start = start + 5
  // Get Specific response
  var humidity = response.list[start].main.humidity
  // Assign element to variable
  var forcast_humidity_e = $("#humidity_" + num)
  // Update Element with Information from API
  forcast_humidity_e.text("Humidity " + humidity + "%");
}

// Major Cities functionality
function major_cities() {
    // Get the specific label that was clicked on, and get the data that was associated to it
    var search_city = this.dataset.city
    // Run this function with alternative city to normal search
    get_todays_weather(search_city);

}

// Simplified the console.log function to just be print like in python
function print(x){
  console.log(x)
}

// Show and hide major city labels from the button
function show_cities() {
  // If shown
  if (city_row.style.display === "flex") {
    // Hide
    city_row.style.display = "none";
  } 
  else {
    // If hidden
    // Show
    city_row.style.display = "flex";
  }
}


// Event Handlers

// Click on City Labels
cities_e.on("click",major_cities);
// Show Hide City Labels
cities_b_e.on("click",show_cities);
// Search API for weather data from button click
search_b_e.on("click",function () {
  var search_city = search_i_e.val();
  get_todays_weather(search_city);
});
// Search API for weather data from enter keypress
document.addEventListener("keypress", function (e) {
    if (e.key === 'Enter') {
        console.log("enter")
        // next_question();
        var search_city = search_i_e.val();
        get_todays_weather(search_city); 
      }
})




