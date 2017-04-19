var state1=0;
var state2=0;
// var state3=0;
$('#firstButton').click(function(e){
  state2=0;
  if (state1===1){
    $('#leftbar').hide();
    state1=0;
    $('#map > div.leaflet-control-container > div.leaflet-top.leaflet-left').css("left","20px");
    $('#refresh').css("left","30px");
  }
  else{
    $('#macroStats').show();
    $('#indivStats').hide();
    $('#stationInfo').hide();
    $('#leftbar').show();
    state1=1;
    $('#map > div.leaflet-control-container > div.leaflet-top.leaflet-left').css("left","360px");
    $('#refresh').css("left","370px");
  }
});

$('#secondButton').click(function(e){
  state1=0;
  if (state2===1){
    $('#leftbar').hide();
    state2=0;
    $('#map > div.leaflet-control-container > div.leaflet-top.leaflet-left').css("left","20px");
    $('#refresh').css("left","30px");
  }
  else{
    $('#macroStats').hide();
    $('#indivStats').show();
    $('#stationInfo').show();
    $('#leftbar').show();
    state2=1;
    $('#map > div.leaflet-control-container > div.leaflet-top.leaflet-left').css("left","360px");
    $('#refresh').css("left","370px");
  }
});

$('#thirdButton').click(function(e){
  $('#rightbar').fadeToggle();
  // if (state3===1){
  //   $('#rightbar').hide();
  //   state3=0;
  // }
  // else{
  //   $('#rightbar').show();
  //   state3=1;
  // }
});

$('#fourthButton').click(function(e){
  $('#destination').fadeToggle();
  $('#explore').fadeToggle();
  $('#search').fadeToggle();
  $('#clear').fadeToggle();
});

$('#hideIt1').click(function(e){
  $('#macroStats').hide();
  $('#leftbar').hide();
  state1=0;
  $('#map > div.leaflet-control-container > div.leaflet-top.leaflet-left').css("left","20px");
  $('#refresh').css("left","30px");
});

$('#hideIt2').click(function(e){
  $('#indivStats').hide();
  $('#stationInfo').hide();
  $('#leftbar').hide();
  state2=0;
  $('#map > div.leaflet-control-container > div.leaflet-top.leaflet-left').css("left","20px");
  $('#refresh').css("left","30px");
});

// $('#hideIt3').click(function(e){
//   // state3=0;
// });

var dest;
var getDest;
var locationMarker;
var locationMarkers=[];
$('#explore').click(function(e){
  if($('#destination').val()===""){
    alert("Oops! Your forgot to input your destination!");
  }
  else{
    dest=$('#destination').val();
    getDest = "https://search.mapzen.com/v1/search?text=" + dest +  "&boundary.circle.lon=-75.157929&boundary.circle.lat=39.984400&boundary.circle.radius=15&api_key=mapzen-bE4GcSs&size=1";
    geocoding = $.ajax(getDest).done(function(data){
      console.log(data);
      app.map.setView([data.features[0].geometry.coordinates[1], data.features[0].geometry.coordinates[0]],15);
      locationMarker=L.circleMarker([data.features[0].geometry.coordinates[1], data.features[0].geometry.coordinates[0]]);
      locationMarkers.push(locationMarker);
      locationMarker.addTo(app.map);
    });
  }
});
$('#clear').click(function(e){
  if($('#destination').val()!==""){
    $('#destination').val("");
    _.each(locationMarkers,function(locationMarker){
      app.map.removeLayer(locationMarker);
    });
  }
});

var filterSelect;
$('#rough').click(function(e){
  $('#avgRange').fadeToggle("slow");
  $('#range').hide("slow");
  $('#customize').hide("slow");
  filterSelect=1;
});
$('#select').click(function(e){
  $('#range').fadeToggle("slow");
  $('#avgRange').hide("slow");
  $('#customize').hide("slow");
  filterSelect=2;
});
$('#input').click(function(e){
  $('#customize').fadeToggle("slow");
  $('#range').hide("slow");
  $('#avgRange').hide("slow");
  filterSelect=3;
});

$('#rough2').click(function(e){
  $('#avgRound').fadeToggle("slow");
  $('#rangeRound').hide("slow");
  filterSelect=4;
});
$('#select2').click(function(e){
  $('#rangeRound').fadeToggle("slow");
  $('#avgRound').hide("slow");
  filterSelect=5;
});
