var APIKey = "e2a4adc7df9c811b491a471a203cda9d";
var search_i_e = $("#search_i")
var search_b_e = $("#search_b")
var city_name_date_h2_e = $("#city_name_date_h2")
var temp_l_e = $("#temp_l")
var humidity_l_e = $("#humidity_l")
var wind_speed_l_e = $("#wind_speed_l")
var uv_index_l_e = $("#uv_index_l")

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;
console.log(today)
// var x = document.getElementById("demo");

geocoder = new google.maps.Geocoder();

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

getLocation();


function city_search() {
    var search_city = search_i_e.val();
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

        city_name_date_h2_e.text(name_data + " (" + today + ")");
        temp_l_e.text("Temperature: " + temp_data);
        humidity_l_e.text("Humidity: " + humidity_data);
        wind_speed_l_e.text("Wind Speed: " + wind_data);

        var uvqueryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + long + "&units=imperial&appid=" + APIKey;
        // temp_l_e.html("Temperature " + response.main.temp);
        $.ajax({url: uvqueryURL,method: "GET"}).then(function(response) {
            console.log(response.value)
        
            var uv_data = response.value
            uv_index_l_e.text("UV Index: " + uv_data)
    
        })  
    })  

}

search_b_e.on("click",city_search);
document.addEventListener("keypress", function (e) {
    if (e.key === 'Enter') {
        console.log("enter")
        // next_question();
        city_search();
      }
})


