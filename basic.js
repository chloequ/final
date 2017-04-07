var state = {
  slideNumber: 0
};

var map = L.map('map', {
  center: [39.994334, -75.169636],
  zoom: 11
});

var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);

var downloadData = $.ajax("https://www.rideindego.com/stations/json/");

var makeStation = function(parsedData){
  _.each(parsedData, function(data){
    stationMarkers.push(L.circleMarker([data.geometry.coordinates[1], data.geometry.coordinates[0]]));
  });
};

var plotStation = function(markers){
  _.each(markers, function(marker){
    marker.addTo(map);
  });
};
