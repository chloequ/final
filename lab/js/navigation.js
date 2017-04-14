$('#firstButton').click(function(e){
  $('#macroStats').show();
  $('#indivStats').hide();
  $('#stationInfo').hide();
  $('#leftbar').show();
});

$('#secondButton').click(function(e){
  $('#macroStats').hide();
  $('#indivStats').show();
  $('#stationInfo').show();
  $('#leftbar').show();
});

$('#thirdButton').click(function(e){
  $('#rightbar').show();
});

$('#hideIt1').click(function(e){
  $('#macroStats').hide();
  $('#leftbar').hide();
});

$('#hideIt2').click(function(e){
  $('#indivStats').hide();
  $('#stationInfo').hide();
  $('#leftbar').hide();
});

$('#hideIt3').click(function(e){
  $('#rightbar').hide();
});

var dest;
var getDest;
var locationMarker;
$('#explore').click(function(e){
  dest=$('#destination').val();
  getDest = "https://search.mapzen.com/v1/search?text=" + dest +  "&boundary.circle.lon=-75.157929&boundary.circle.lat=39.984400&boundary.circle.radius=50&api_key=mapzen-bE4GcSs&size=1";
  geocoding = $.ajax(getDest).done(function(data){
    console.log(data);
    app.map.setView([data.features[0].geometry.coordinates[1], data.features[0].geometry.coordinates[0]],15);
    locationMarker=L.circleMarker([data.features[0].geometry.coordinates[1], data.features[0].geometry.coordinates[0]]);
    locationMarker.addTo(app.map);
  });
});
$('#clear').click(function(e){
  $('#destination').val("");
  app.map.removeLayer(locationMarker);
});
