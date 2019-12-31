var APIKey = "e2a4adc7df9c811b491a471a203cda9d";
var search_i_e = $("#search_i")
var search_b_e = $("#search_b")
var city_name_date_h2_e = $("city_name_date_h2")
var temp_l_e = $("#temp_l")
var humidity_l_e = $("#humidity_l")
var wind_speed_l_e = $("#wind_speed_l")
var uv_index_l_e = $("#uv_index_l")


// var city_name = "Austin,Texas"


// Here we are building the URL we need to query the database
// var queryURL = "https://api.openweathermap.org/data/2.5/weather?" + "q=" + city_name + "&units=imperial&appid=" + APIKey;

// Here we are building the URL we need to query the database


// function get_data(){

// }

function city_search() {
    var search_city = search_i_e.val();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?" + "q=" + search_city + "&units=imperial&appid=" + APIKey;
    

    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({url: queryURL,method: "GET"}).then(function(response) {
        var temp_data = response.main.temp 
        // temp_data = Number(temp_data.toFixed()).toFixed(2)
        // temp_data = temp_data.slice(0, -1)
        temp_data = temp_data + "°F";
        // var temp_data = Math.max( Math.round(number * 10) / 10, 2.8 ).toFixed(2);
        var humidity_data = response.main.humidity + "%"
        var wind_data = response.wind.speed + " mph"
        var long = response.coord.lon;
        var lat = response.coord.lat;

        temp_l_e.text("Temperature: " + temp_data);
        humidity_l_e.text("Humidity: " + humidity_data);
        wind_speed_l_e.text("Wind Speed: " + wind_data);

        var uvqueryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + long + "&units=imperial&appid=" + APIKey;
        // temp_l_e.html("Temperature " + response.main.temp);
        $.ajax({url: uvqueryURL,method: "GET"}).then(function(response) {
            console.log(response.value)
            var uv_data = response.value
            uv_index_l_e.text("UV Index: " + uv_data)
            // console.log(response.main.humidity)
            // console.log(response.wind.speed)
            // console.log(response.wind.speed)
            // $(".city").html("<h1>" + response.name + " Weather Details</h1>");
            // $(".wind").text("Wind Speed: " + response.wind.speed);
            // $(".humidity").text("Humidity: " + response.main.humidity);
            // temp_l_e.html("Temperature " + response.main.temp);
    
        })  

    })  
    
    

    // return city_search;
}

search_b_e.on("click",city_search);
document.addEventListener("keypress", function (e) {
    if (e.key === 'Enter') {
        console.log("enter")
        // next_question();
        city_search();
      }
})


