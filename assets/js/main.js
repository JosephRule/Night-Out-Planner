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
                    createEventCard(eventsList[i], i)
                }
            })
        }
        else {
            alert("Error, bad response")
        }
    })
};

function iniHomeHistory(){
    if (localStorage.getItem("home-address-history") != null) {
        var historyList = JSON.parse(localStorage.getItem("home-address-history"));
        for (var i = 0; i <historyList.length; i++){
            var historyButtonEl = $("<button>")
                .attr("value",historyList[i])
                .addClass("historyButton")
                .text(historyList[i]);
                $("#home-address-history").append(historyButtonEl);
        }
    }
}

function iniEventHistory(){
    if (localStorage.getItem("event-history") != null) {
        var historyList = JSON.parse(localStorage.getItem("event-history"));
        for (var i = 0; i <historyList.length; i++){
            var historyButtonEl = $("<button>")
                .attr("value",historyList[i])
                .addClass("eventButton")
                .text(historyList[i]);
                $("#event-location-history").append(historyButtonEl);
        }
    }
}

iniHomeHistory();
iniEventHistory();



var createEventCard = function(event,index) {
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
                        .attr("value",index)

    var eventinfoEl = $("<div>")
                        .addClass("eventinfo")
                        .attr("id", "eventinfo-" + index)
    

    cardContentEl.append(eventNameEl, eventDateEl, eventPriceEl, eventVenueEl)
    eventActionEl.append(eventLinkEl, directionsEl)
    eventCardStacked.append(cardContentEl, eventActionEl)
    cardImageEl.append(ImageEl)
    eventCardEl.append(cardImageEl, eventCardStacked)
    $("#right-side-results").append(eventCardEl)
    $("#right-side-results").append(eventinfoEl)


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


function calcRoute(start, end, index) {
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
            var targetDiv = $("#eventinfo-" + index);
            targetDiv.html("");
            targetDiv.append("<div>From: "+ start + "</div>");
            targetDiv.append("<div>To: " + end + "</div>");
            targetDiv.append("<div>Distance: "+ distance +"</div>");
            targetDiv.append("<div>Duration: "+ duration +"</div>");
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
    if (localStorage.getItem("home-address-history") === null){
        var historyList = [];
        historyList.push(address);
        localStorage.setItem("home-address-history",JSON.stringify(historyList));
      } else{
        var historyList = JSON.parse(localStorage.getItem("home-address-history"));
        if (!historyList.includes(address)) {
          historyList.push(address);
        }
        localStorage.setItem("home-address-history",JSON.stringify(historyList));
    }

    if (localStorage.getItem("event-history") === null){
        var eventList = [];
        eventList.push(eventCity);
        localStorage.setItem("event-history",JSON.stringify(eventList));
      } else{
        var eventList = JSON.parse(localStorage.getItem("event-history"));
        if (!eventList.includes(eventCity)) {
          eventList.push(eventCity);
        }
        localStorage.setItem("event-history",JSON.stringify(eventList));
    }

    getEventsList(eventCity, eventDate)
})

$(document).on("click", ".event-button", function(){
    calcRoute(address, $(this).attr("venue") + eventCity, $(this).attr("value"))
})
