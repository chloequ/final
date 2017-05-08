// $('#top').on('mouseover',function(e){
//   $('#thintop').fadeIn("slow");
// });
$('#startMap').click(function(e){
  $('#modal').fadeToggle("slow");
});

$('#menuUp').on('click',function(e){
  $('#top').fadeToggle();
  $('#thintop').fadeToggle();
  $('.sidebar').css("top","30px");
});
$('#menuDown').on('click',function(e){
  $('#top').fadeToggle();
  $('#thintop').fadeToggle();
  $('.sidebar').css("top","55px");
  // $('menuDown').css("color","white");
});

$('#refresh').on('mouseover',function(){
  $('#refresh').css("background-color","rgb(239, 239, 239)");
});
$('#refresh').on('mouseout',function(){
  $('#refresh').css("background-color","rgb(255, 255, 255)");
});

var state0=0;
var state1=0;
var state2=0;
// var state3=0;

$('#mapping').click(function(e){
  $('.sidebar').css("top","55px");
  state1=0;
  state2=0;
  if (state0===1){
    $('#leftbar').fadeToggle();
    state0=0;
    $('#map > div.leaflet-control-container > div.leaflet-top.leaflet-left').css("left","20px");
    $('#refresh').css("left","30px");
    $('.legend').css("left","30px");
    $('.discription').hide();
  }
  else{
    $('#maps').fadeIn();
    $('#mapsChoice').fadeIn();
    $('#macroStats').hide();
    // $('#indivStats').hide();
    $('#stationInfo').hide();
    // $('#popularOD').hide();
    $('#leftbar').fadeIn();
    state0=1;
    $('#map > div.leaflet-control-container > div.leaflet-top.leaflet-left').css("left","360px");
    $('#refresh').css("left","370px");
    $('.legend').css("left","370px");
  }
});

$('#mapsChoice1').click(function(e){
  $('#discription1').fadeToggle();
  $('#gradient1').fadeIn();
  $('#gradient2').fadeOut();
  $('.legendText').fadeIn();
  $('#discription2').hide();
  $('#sizing').fadeOut();
  // $('#map > div.leaflet-control-container > div.leaflet-top.leaflet-left').css("top","80px");
  // $('#refresh').css("top","200px");
});
$('#mapsChoice2').click(function(e){
  $('#discription2').fadeToggle();
  $('#gradient2').fadeIn();
  $('#gradient1').fadeOut();
  $('.legendText').fadeIn();
  $('#discription1').hide();
  $('#sizing').fadeOut();
  // $('#map > div.leaflet-control-container > div.leaflet-top.leaflet-left').css("top","80px");
  // $('#refresh').css("top","200px");
});

$('#firstButton').click(function(e){
  // $('#top').fadeToggle();
  // $('#thintop').fadeToggle();
  $('.sidebar').css("top","55px");
  state0=0;
  state2=0;
  if (state1===1){
    $('#leftbar').fadeToggle();
    state1=0;
    $('#map > div.leaflet-control-container > div.leaflet-top.leaflet-left').css("left","20px");
    $('#refresh').css("left","30px");
    $('.legend').css("left","30px");
  }
  else{
    $('#macroStats').fadeIn();
    // $('#indivStats').hide();
    $('#stationInfo').hide();
    $('#maps').hide();
    // $('#popularOD').hide();
    $('#leftbar').fadeIn();
    state1=1;
    $('#map > div.leaflet-control-container > div.leaflet-top.leaflet-left').css("left","360px");
    $('#refresh').css("left","370px");
    $('.legend').css("left","370px");
    $('.discription').hide();
  }
});

$('#min').on('mouseover',function(e){
  $('#min').css(hoverStyle);
});
$('#max').on('mouseover',function(e){
  $('#max').css(hoverStyle);
});

$('#min').on('mouseout',function(e){
  $('#min').css(defaultStyle);
});
$('#max').on('mouseout',function(e){
  $('#max').css(defaultStyle);
});

$('#secondButton').click(function(e){
  // $('#top').fadeToggle();
  // $('#thintop').fadeToggle();
  $('.sidebar').css("top","55px");
  state1=0;
  state0=0;
  if (state2===1){
    $('#leftbar').fadeToggle();
    state2=0;
    $('#map > div.leaflet-control-container > div.leaflet-top.leaflet-left').css("left","20px");
    $('#refresh').css("left","30px");
    $('.legend').css("left","30px");
  }
  else{
    $('#macroStats').hide();
    $('#maps').hide();
    $('#stationInfo').fadeIn();
    $('#info1').hide();
    $('#info2').hide();
    $('#leftbar').fadeIn();
    state2=1;
    $('#map > div.leaflet-control-container > div.leaflet-top.leaflet-left').css("left","360px");
    $('#refresh').css("left","370px");
    $('.legend').css("left","370px");
    $('.discription').hide();
  }
});

$('#rideStats').click(function(e){
  $('#info1').fadeToggle();
  $('#info2').hide();
});

$('#od').click(function(e){
  $('#info2').fadeToggle();
  $('#info1').hide();
});

$('#rideStats').on('mouseover',function(e){
  $('#rideStats').css(hoverStyle);
});
$('#od').on('mouseover',function(e){
  $('#od').css(hoverStyle);
});
$('#rideStats').on('mouseout',function(e){
  $('#rideStats').css(defaultStyle);
});
$('#od').on('mouseout',function(e){
  $('#od').css(defaultStyle);
});

var fadeStyle={
  "background-color": "rgba(0, 0, 0, 0.4)",
  "color":"rgba(250, 235, 215,0.4)"
};
var defaultStyle={
  "background-color": "rgba(0, 0, 0, 0.4)",
  "color":"rgb(250, 235, 215)"
};

var hoverStyle={
  "background-color": "rgba(255, 255, 255, 0.9)",
  "color":"rgba(0, 0, 0, 0.8)"
};

$('#thirdButton').click(function(e){
  // $('#top').fadeToggle();
  // $('#thintop').fadeToggle();
  $('.sidebar').css("top","55px");
  $('#rightbar').fadeToggle();
  $('#filterSelection11').hide();
  $('#numberFilter').hide();
  $('#roundFilter').hide();
  $('#rough').hide();
  $('#select').hide();
  $('#input').hide();
  $('#rough2').hide();
  $('#select2').hide();
  $('#filterSelection22').hide();
  if(filterclick1%2!==0){
    filterclick1+=1;
  }
  if(filterclick2%2!==0){
    filterclick2+=1;
  }
  document.getElementById('filterSelection1').style.color="antiquewhite";
  document.getElementById('filterSelection1').style.backgroundColor="rgba(0, 0, 0, 0.4)";
  document.getElementById('filterSelection2').style.color="antiquewhite";
  document.getElementById('filterSelection2').style.backgroundColor="rgba(0, 0, 0, 0.4)";

  // if (state3===1){
  //   $('#rightbar').hide();
  //   state3=0;
  // }
  // else{
  //   $('#rightbar').fadeIn();
  //   state3=1;
  // }
});

var filterclick1=0;
var filterclick2=0;
// var filterclick;
var clickState1 = function(){
    $('#filterSelection11').fadeIn();
    $('#numberFilter').fadeToggle();
    filterclick1+=1;
};

var clickState2 = function(){
  $('#filterSelection22').fadeIn();
  $('#roundFilter').fadeToggle();
  filterclick2+=1;
};

$('#filterSelection1').click(function(e){
  clickState1();
  if(filterclick2%2!==0){
    clickState2();
  }
  $('#rough').fadeIn();
  $('#select').fadeIn();
  $('#input').fadeIn();
  $('#avgRound').hide();
  $('#rangeRound').fadeOut();
  $('#avgRange').fadeOut();
  $('#range').fadeOut();
  $('#customize').fadeOut();
});

$('#filterSelection2').click(function(e){
  clickState2();
  if(filterclick1%2!==0) {
    clickState1();
  }
  $('#rough2').fadeIn();
  $('#select2').fadeIn();
  $('#avgRange').fadeOut();
  $('#range').fadeOut();
  $('#customize').fadeOut();
  $('#avgRound').fadeOut();
  $('#rangeRound').fadeOut();
});

$('#filterSelection1').on('mouseover',function(e){
  if(filterclick2%2===0){
    $('#filterSelection1').css(hoverStyle);
  }
});

$('#filterSelection1').on('click',function(e){
  $('#filterSelection1').css(hoverStyle);
  $('#filterSelection2').css(fadeStyle);
  if(filterclick1%2===0){
    $('#filterSelection2').css(defaultStyle);
  }
});

$('#filterSelection1').on('mouseout',function(e){
  if(filterclick1%2===0&&filterclick2%2===0){
    $('#filterSelection1').css(defaultStyle);
  }
});

$('#filterSelection2').on('mouseover',function(e){
  if(filterclick1%2===0){
    $('#filterSelection2').css(hoverStyle);
  }
});

$('#filterSelection2').on('click',function(e){
  $('#filterSelection2').css(hoverStyle);
  $('#filterSelection1').css(fadeStyle);
  if(filterclick2%2===0){
    $('#filterSelection1').css(defaultStyle);
  }
});

$('#filterSelection2').on('mouseout',function(e){
  if(filterclick2%2===0&&filterclick1%2===0){
    $('#filterSelection2').css(defaultStyle);
  }
});

if(filterclick1%2===0){
  $('#filterSelection2').css(defaultStyle);
}
if(filterclick2%2===0){
  $('#filterSelection1').css(defaultStyle);
}

$('#fourthButton').click(function(e){
  $('#destination').fadeToggle();
  $('#explore').fadeToggle();
  $('#search').fadeToggle();
  $('#clear').fadeToggle();
});

$('#hideIt0').click(function(e){
  $('#maps').hide();
  $('#leftbar').fadeOut();
  state0=0;
  $('#map > div.leaflet-control-container > div.leaflet-top.leaflet-left').css("left","20px");
  $('#refresh').css("left","30px");
  $('.legend').css("left","30px");
  $('.discription').hide();
});

$('#hideIt1').click(function(e){
  $('#macroStats').hide();
  $('#leftbar').hide();
  state1=0;
  $('#map > div.leaflet-control-container > div.leaflet-top.leaflet-left').css("left","20px");
  $('#refresh').css("left","30px");
  $('.legend').css("left","30px");
});

$('#hideIt2').click(function(e){
  $('#indivStats').hide();
  $('#stationInfo').hide();
  $('#leftbar').hide();
  state2=0;
  $('#map > div.leaflet-control-container > div.leaflet-top.leaflet-left').css("left","20px");
  $('#refresh').css("left","30px");
  $('.legend').css("left","30px");
});

$('#hideIt3').click(function(e){
  $('#rightbar').fadeToggle();
  document.getElementById('filterSelection1').style.color="antiquewhite";
  document.getElementById('filterSelection1').style.backgroundColor="rgba(0, 0, 0, 0.4)";
  document.getElementById('filterSelection2').style.color="antiquewhite";
  document.getElementById('filterSelection2').style.backgroundColor="rgba(0, 0, 0, 0.4)";
});

$('#hideIt0').on('mouseover',function(e){
  $('#hideIt0').css("color","antiquewhite");
});
$('#hideIt0').on('mouseout',function(e){
  $('#hideIt0').css("color","rgba(250, 235, 215,0.5)");
});

$('#hideIt1').on('mouseover',function(e){
  $('#hideIt1').css("color","antiquewhite");
});
$('#hideIt1').on('mouseout',function(e){
  $('#hideIt1').css("color","rgba(250, 235, 215,0.5)");
});

$('#hideIt2').on('mouseover',function(e){
  $('#hideIt2').css("color","antiquewhite");
});
$('#hideIt2').on('mouseout',function(e){
  $('#hideIt2').css("color","rgba(250, 235, 215,0.5)");
});

$('#hideIt3').on('mouseover',function(e){
  $('#hideIt3').css("color","antiquewhite");
});
$('#hideIt3').on('mouseout',function(e){
  $('#hideIt3').css("color","rgba(250, 235, 215,0.5)");
});

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
  $('#avgRange').fadeToggle();
  $('#select').fadeToggle();
  $('#input').fadeToggle();
  $('#range').hide("slow");
  $('#customize').hide("slow");
  filterSelect=1;
});
$('#select').click(function(e){
  $('#range').fadeToggle();
  $('#rough').fadeToggle();
  $('#input').fadeToggle();
  $('#avgRange').hide("slow");
  $('#customize').hide("slow");
  filterSelect=2;
});
$('#input').click(function(e){
  $('#customize').fadeToggle();
  $('#rough').fadeToggle();
  $('#select').fadeToggle();
  $('#range').hide("slow");
  $('#avgRange').hide("slow");
  filterSelect=3;
});

$('#rough2').click(function(e){
  $('#avgRound').fadeToggle();
  $('#select2').fadeToggle();
  $('#rangeRound').hide("slow");
  filterSelect=4;
});
$('#select2').click(function(e){
  $('#rangeRound').fadeToggle();
  $('#rough2').fadeToggle();
  $('#avgRound').hide("slow");
  filterSelect=5;
});
