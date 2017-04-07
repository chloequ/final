var parsed;
var stationMarkers = [];
$(document).ready(function() {
  downloadData.done(function(data){
    console.log(data);
    parsed = data.features;
    console.log(parsed);
    // parsed = parseData(data);
    // stationMarkers = makeStation(parsed);
    makeStation(parsed);
    console.log(stationMarkers);
    plotStation(stationMarkers);
  });
});
