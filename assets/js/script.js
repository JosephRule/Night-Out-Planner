function getETAInfo(start, end) {
    var proxyurl = "https://cors-anywhere.herokuapp.com/";
    var directionInfo = fetch("https://maps.googleapis.com/maps/api/directions/json?origin=" + start + "&destination=" + end + "&key=" + "AIzaSyCmFDQf58ZuTf-R93Rkrlxk5HEeNe2XmjY");
    directionInfo.then(directionInfo => {
        console.log(directionInfo);
        // var distance = directionInfo.routes.legs[0].distance.text;
        // var duration = directionInfo.routes.legs[0].duration.text;
    })
}

getETAInfo("Disneyland","Universal+Studios+Hollywood");