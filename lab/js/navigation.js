var state1=0;
var state2=0;
var state3=0;
$('#firstButton').click(function(e){
  state2=0;
  // $('#firstButton').css("background-color","blue");
  if (state1===1){
    $('#leftbar').hide();
    state1=0;
    $('#map > div.leaflet-control-container > div.leaflet-top.leaflet-left').css("left","20px");
  }
  else{
    $('#macroStats').show();
    $('#indivStats').hide();
    $('#stationInfo').hide();
    $('#leftbar').show();
    state1=1;
    $('#map > div.leaflet-control-container > div.leaflet-top.leaflet-left').css("left","360px");
  }
});

$('#secondButton').click(function(e){
  state1=0;
  if (state2===1){
    $('#leftbar').hide();
    state2=0;
    $('#map > div.leaflet-control-container > div.leaflet-top.leaflet-left').css("left","20px");
  }
  else{
    $('#macroStats').hide();
    $('#indivStats').show();
    $('#stationInfo').show();
    $('#leftbar').show();
    state2=1;
    $('#map > div.leaflet-control-container > div.leaflet-top.leaflet-left').css("left","360px");
  }
});

$('#thirdButton').click(function(e){
  if (state3===1){
    $('#rightbar').hide();
    state3=0;
  }
  else{
    $('#rightbar').show();
    state3=1;
  }
});


$('#hideIt1').click(function(e){
  $('#macroStats').hide();
  $('#leftbar').hide();
  state1=0;
  $('#map > div.leaflet-control-container > div.leaflet-top.leaflet-left').css("left","20px");
});

$('#hideIt2').click(function(e){
  $('#indivStats').hide();
  $('#stationInfo').hide();
  $('#leftbar').hide();
  state2=0;
  $('#map > div.leaflet-control-container > div.leaflet-top.leaflet-left').css("left","20px");
});

$('#hideIt3').click(function(e){
  $('#rightbar').hide();
  state3=0;
});

var dest;
var getDest;
var locationMarker;
$('#explore').click(function(e){
  dest=$('#destination').val();
  getDest = "https://search.mapzen.com/v1/search?text=" + dest +  "&boundary.circle.lon=-75.157929&boundary.circle.lat=39.984400&boundary.circle.radius=20&api_key=mapzen-bE4GcSs&size=1";
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
