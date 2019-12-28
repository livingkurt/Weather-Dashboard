var APIKey = "e2a4adc7df9c811b491a471a203cda9d";
var search_i_e = $("#search_i")
var search_b_e = $("#search_b")


// var city_name = "Austin,Texas"

// Here we are building the URL we need to query the database
// var queryURL = "https://api.openweathermap.org/data/2.5/weather?" + "q=" + city_name + "&units=imperial&appid=" + APIKey;

// Here we are building the URL we need to query the database
var queryURL = "https://api.openweathermap.org/data/2.5/weather?" + "q=Bujumbura,Burundi&units=imperial&appid=" + APIKey;

// Here we run our AJAX call to the OpenWeatherMap API
$.ajax({url: queryURL,method: "GET"}).then(function(response) {
    // We store all of the retrieved data inside of an object called "response"
    // Log the queryURL
    console.log(queryURL);

    // Log the resulting object
    console.log(response);

})

function get_data(){

}

function city_search() {
    var search_city = search_i_e.val();
    console.log(search_city)
}

search_b_e.on("click",city_search);