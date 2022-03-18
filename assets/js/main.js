var getEventsList = function(city, startDateTime) {
    var startDateTime = startDateTime + "T00:00:00Z"
    var eventUrl = "https://app.ticketmaster.com/discovery/v2/events.json?apikey="
                    + "EquftysZFTGWpA9E2cBh6SGULTHz8TYo"
                    + "&city=" + city
                    + "&startDateTime=" + startDateTime
                    + "&sort=date,asc"
    fetch(eventUrl)
        .then(response => {
        if (response.ok) {
            response.json().then(data =>{
                eventsList = data._embedded.events;
                $("#right-side-results").html("");
                for (var i = 0; i<eventsList.length; i++) {
                    createEventCard(eventsList[i])
                }
            })
        }
        else {
            alert("Error, bad response")
        }
    })
};

var createEventCard = function(event) {
    var eventCardEl = $("<div>").addClass("card horizontal")
    var cardImageEl = $("<div>").addClass("card-image")
    var ImageEl = $("<img>").attr("src", event.images[0].url)
    var eventCardStacked =$("<div>").addClass("card-stacked")
    var cardContentEl = $("<div>").addClass("card-content")
    var eventNameEl = $("<p>").text(event.name)
    var eventDateEl =$("<p>").text(event.dates.start.localDate)
    if (event.priceRanges){
        var eventPriceEl =$("<p>").text("Lowest Price: $" + event.priceRanges[0].min)
    }
    else {
        var eventPriceEl =$("<p>")
    }
    var eventVenueEl = $("<p>").text(event._embedded.venues[0].name)

    var eventActionEl = $("<div>").addClass("card-action")
    var eventLinkEl = $("<a>")
                        .attr("href", event.url)
                        .text("Buy Tickets")
    var directionsEl = $("<button>")
                        .addClass("event-button")
                        .attr("venue", event._embedded.venues[0].name)
                        .text("Get Directions")


    cardContentEl.append(eventNameEl, eventDateEl, eventPriceEl, eventVenueEl)
    eventActionEl.append(eventLinkEl, directionsEl)
    eventCardStacked.append(cardContentEl, eventActionEl)
    cardImageEl.append(ImageEl)
    eventCardEl.append(cardImageEl, eventCardStacked)
    $("#right-side-results").append(eventCardEl)

};


var initMap = function() {
    var directionsRenderer = new google.maps.DirectionsRenderer();
    var chicago = new google.maps.LatLng(41.850033, -87.6500523);
    var mapOptions = {
      zoom:7,
      center: chicago
    }
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);
    directionsRenderer.setMap(map);
};


function calcRoute(start, end) {
    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer();
    var map = new google.maps.Map(document.getElementById('map'));
    var request = {
        origin: start,
        destination: end,
        travelMode: "DRIVING"
    };
    directionsService.route(request, function(result, status){
        if (status == "OK"){
            var distance = result.routes[0].legs[0].distance.text;
            var duration = result.routes[0].legs[0].duration.text;
            $(".results-row").html("");
            $(".results-row").append("<div>From: "+ start + "</div>");
            $(".results-row").append("<div>To: " + end + "</div>");
            $(".results-row").append("<div>Distance: "+ distance +"</div>");
            $(".results-row").append("<div>Duration: "+ duration +"</div>");
            directionsRenderer.setDirections(result);
        }
    });
    directionsRenderer.setMap(map);
};

var address
var eventCity
var eventDate

window.addEventListener('load', function () {
    initMap();
});

$(document).on("click", "#search-button", function() {
    address = $("#home-address").val()
    eventDate = $("#date").val()
    eventCity = $("#city").val()

    getEventsList(eventCity, eventDate)
})

$(document).on("click", ".event-button", function(){
    calcRoute(address, $(this).attr("venue") + eventCity )
})
