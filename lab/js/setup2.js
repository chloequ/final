/* =================================
Carto/JS Interaction Lab

We've looked at a lot of technologies in this class but we've yet to see
an application that takes full advantage of the analytic capabilities of SQL
and PostGIS. Luckily, Carto maintains a library which makes this all
relatively easy.


Task 1: Find a dataset you'd like to play with
Any interesting and realistic dataset will do, though dense point-based
datasets will work best for the tasks below.


Task 2: Wire up the application below to your account and dataset
You'll know you're successful when reloading the page renders data to the
map. Keep in mind that extremely large datasets will crush your browser. In
such instances, it might be useful to add `LIMIT 50` to your SQL (this will
limit the response to the first 50 records).

Remember to try your queries out in the SQL console first. Once you've got
something that looks good, you can just copy and paste it below.


Task 3: Choose interesting columns to represent on the navigation panel
The application is currently designed to display the 'cartodb_id' and 'name'
fields of the features returned from Carto. While every table will have an id,
'name' is by no means a required column.


Task 4: Add an input element (of your choice) to filter the returned SQL
If the filter can be expected to dramatically reduce response sizes, consider
removing any `LIMIT` statements you might have added in Task 2.

Again: test this out in the SQL console!


Task 5: Try to break your application.
Enter data into your input element that you expect to break things. Try your
best to characterize any bugs you encounter.


Task 6: Handle errors encountered in Task 5


Stretch goals
1. Use one of the UI frameworks seen in a previous class to style your application

2. Use leaflet draw to construct a geometry that can be used within a SQL query
(Obligatory reminder to try this out in the SQL console)

3. Try to get aggregate data based on the spatial filter you've constructed.
HINT: you'll need a client whose format is 'json' rather than 'geojson' because
the response you'll get will not have any spatial data. Ask for help if you get stuck
on this one for 10 or 15 minutes.
(Obligatory reminder to try this out in the SQL console)

4. Once you're confident you have a path from Leaflet Draw to a SQL query,
console.log the aggregate data to prove you can materialize it programmatically

5. Create a modal (or other means of representation) which will spawn upon completion
of a Leaflet Draw geometry. Get this modal to neatly display aggregate information
from the geometry you've drawn.

6. Think about performance.
- Only ask for the columns you're interested in (this means avoiding 'SELECT *' in favor of 'SELECT field_1, field2')
- Add an index on `the_geom` and the other column(s) you filter by to ensure that lookups happen as quickly as possible
- If not using points, geometric simplification can dramatically reduce JSON payload size

==================================*/


/** Notice the use of L.Map here. This is an extension of an organizational strategy we've already discussed. */
var app = {
  apikey: "d2d424a2bf6456078b621e67ffccb3647a159423",
  map: L.map('map', { center: [39.957042, -75.175922], zoom: 13 }),
  geojsonClient: new cartodb.SQL({ user: 'chloequ', format: 'geojson' }),
  jsonClient: new cartodb.SQL({ user: 'chloequ', format: 'json' }),
  drawnItems: new L.FeatureGroup()
};

L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(app.map);

// Automatically fill the form on the left from geojson response
var fillForm = function(properties) {
  $('#total_num_rides').val("Total Number of Rides: " + properties.total_num_rides);
  $('#std_rides').val("Standardized Number of Rides: " + properties.std_rides);
  $('#address').val("Address: " + properties.addressstreet);
  $('#zipcode').val("Zipcode: "+properties.addresszipcode);
  $('#dockNumber').val("Docking Capacity: " + properties.totaldocks);
  $('#tll_per').val("Percentage of All Indego Rides: " + properties.ttl_per);
  $('#station_id').val("Station ID: " + properties.station_id);
  $('#departure').val("Departure: " + properties.start_num_rides + " rides, " + properties.st_per_in + " of total");
  $('#arrival').val("Arrival: " + properties.end_num_rides + " rides, " + properties.ed_per_in + " of total");
};

// The initial query by which we map the geojson representation of a table
// app.geojsonClient.execute("SELECT * FROM cleandata_geom") // 'LIMIT' should be added to the end of this line
//   .done(function(data) {
//     L.geoJson(data, {
//       onEachFeature: function(feature, layer) {
//         layer.on('click', function() { fillForm(feature.properties); });
//       }
//     }).addTo(app.map);
//   })
//   .error(function(errors) {
//   });

  var execution;
  var lowFilterNumber;
  var hiFilterNumber;
  var defaultLayer;
  var setLayer;
  var filterLayer;
  var min;
  var max;
  var avg;
  var avgRound;
  var minFeature;
  var maxFeature;
  var theSelected;
  var minMarker;
  var maxMarker;

// variables for mapping routes
  var mystart;
  var myend;
  var mylocation;
  var myObject;
  var myJSON;
  var myURL;
  var routeResponse;
  var myCoordinates;
  var myStartRoute;
  var myEndRoute;
  // var myRoutes=[];
  var startMarker;
  // var startMarkers=[];
  var endMarker;
  // var endMakers=[];

//variables for mapping hottest pairs
  var pair;
  var top10s=[];

var general=function(){
  app.jsonClient.execute("SELECT SUM(total_num_rides) FROM cleandata_all_geom_new")
    .done(function(data) {
      $('#total').val("Total Indego Rides in 2016: " + data.rows[0].sum);
    });
  app.jsonClient.execute("SELECT AVG(total_num_rides) FROM cleandata_all_geom_new")
    .done(function(data) {
      $('#mean').val("Average Annual Rides Per Station: " + data.rows[0].avg);
      avg=data.rows[0].avg;
    });
  app.jsonClient.execute("SELECT MIN(total_num_rides) FROM cleandata_all_geom_new")
    .done(function(data) {
      $('#min').text("MIN: " + data.rows[0].min);
      min=data.rows[0].min;
    });
  app.jsonClient.execute("SELECT MAX(total_num_rides) FROM cleandata_all_geom_new")
    .done(function(data) {
      $('#max').text("MAX: " + data.rows[0].max);
      max=data.rows[0].max;
    });
  app.jsonClient.execute("SELECT AVG(per_round) FROM indego_combined")
    .done(function(data) {
      avgRound=data.rows[0].avg;
    });
};
general();

setLayer={
  pointToLayer: function(feature, latlng) {
    return L.circleMarker(latlng,numStyle2(feature));
  },
  onEachFeature: function(feature, layer) {
    if (feature.properties.total_num_rides===min) {
      minFeature=feature;
    }
    if (feature.properties.total_num_rides===max) {
      maxFeature=feature;
    }
    layer.on('mouseover', function(l) {
      if (theSelected===undefined || theSelected._leaflet_id!==l.target._leaflet_id) {
        layer.setStyle({
          radius: 15,
          color: '#9ba1aa',
          weight: 5,
          opacity: 0,
          fillColor: '#9ba1aa',
          fillOpacity: 0.8,
        });
        layer.bindTooltip("Station ID: "+layer.feature.properties.station_id,{opacity: 0.7, offset:[-10,0], direction:'left'}).openTooltip();
      }
      // layer.bindPopup(layer.feature.properties.station_id).openPopup();
    });
    layer.on('mouseout', function(l){
      if (theSelected===undefined || theSelected._leaflet_id!==l.target._leaflet_id) {
        layer.setStyle(numStyle2(feature));
      }
    });
    layer.on('click', function(l) {
      $('#map > div.leaflet-control-container > div.leaflet-top.leaflet-left').css("left","360px");
      $('#refresh').css("left","370px");
      //map out the possible most popular routes
      //as startstation
      app.jsonClient.execute("SELECT start_lat,start_lon,end_lat,end_lon,start_station_id,end_station_id,count(*) AS count FROM indego_all_clean WHERE start_station_id="+feature.properties.station_id+"GROUP BY 1,2,3,4,5,6 ORDER BY count DESC LIMIT 1")
      .done(function(data){
        mystart={"lat":data.rows[0].start_lat, "lon":data.rows[0].start_lon};
        myend={"lat":data.rows[0].end_lat,"lon":data.rows[0].end_lon};
        mylocation=[mystart,myend];
        myObject = {
          "locations": mylocation,
          "costing":"bicycle",
          "directions_options":{"units":"miles"}
        };
        myJSON = JSON.stringify(myObject);
        myURL =
        "https://matrix.mapzen.com/optimized_route?json=" + myJSON + "&api_key=mapzen-bE4GcSs";
        routeResponse = $.ajax(myURL);
        routeResponse.done(function(data){
          myCoordinates = decode(data.trip.legs[0].shape);
          if (myStartRoute!==undefined){
            app.map.removeLayer(myStartRoute);
          }
          myStartRoute=L.polyline(myCoordinates, {color: '#f4d142'});
          myStartRoute.addTo(app.map);
        });
        if (endMarker!==undefined){
          app.map.removeLayer(endMarker);
        }
        endMarker=L.circleMarker([data.rows[0].end_lat,data.rows[0].end_lon],endStyle);
        endMarker.addTo(app.map);
      });
      //as endstation
      app.jsonClient.execute("SELECT start_lat,start_lon,end_lat,end_lon,start_station_id,end_station_id,count(*) AS count FROM indego_all_clean WHERE end_station_id="+feature.properties.station_id+"GROUP BY 1,2,3,4,5,6 ORDER BY count DESC LIMIT 1")
      .done(function(data){
        mystart={"lat":data.rows[0].start_lat, "lon":data.rows[0].start_lon};
        myend={"lat":data.rows[0].end_lat,"lon":data.rows[0].end_lon};
        mylocation=[mystart,myend];
        myObject = {
          "locations": mylocation,
          "costing":"bicycle",
          "directions_options":{"units":"miles"}
        };
        myJSON = JSON.stringify(myObject);
        myURL =
        "https://matrix.mapzen.com/optimized_route?json=" + myJSON + "&api_key=mapzen-bE4GcSs";
        routeResponse = $.ajax(myURL);
        routeResponse.done(function(data){
          myCoordinates = decode(data.trip.legs[0].shape);
          if (myEndRoute!==undefined){
            app.map.removeLayer(myEndRoute);
          }
          myEndRoute=L.polyline(myCoordinates, {color: '#f4d142'});
          myEndRoute.addTo(app.map);
        });
        if (startMarker!==undefined){
          app.map.removeLayer(startMarker);
        }
        startMarker=L.circleMarker([data.rows[0].start_lat,data.rows[0].start_lon],startStyle);
        startMarker.addTo(app.map);
      });
        // });
      //ends here
      fillForm(feature.properties);
      $('#leftbar').show();
      $('#stationInfo').show();
      $('#indivStats').show();
      $('#macroStats').hide();
      layer.setStyle(selectedStyle);
      if (theSelected) {
        if (l.target._leaflet_id === theSelected._leaflet_id) { layer.setStyle(numStyle2(feature));}
        else {theSelected.setStyle(numStyle2(theSelected.feature));}
        // theSelected = undefined;
        // // return;
      }
      theSelected = l.target;
      // if (theSelected) {theSelected.setStyle(numStyle(feature));}
      // app.map.setView([feature.properties.station_lat, feature.properties.station_lon],15);
    });
  }
};
  var filterState=0;
  var setDefault = function(){
    app.map.setView([39.957042, -75.175922], 13);
    app.geojsonClient.execute("SELECT * FROM indego_combined").done(function(data) {
        defaultLayer=L.geoJson(data, setLayer);
        defaultLayer.addTo(app.map);
      });
  };
  var setFilter = function(){
    if(filterSelect===2){
      switch(option){
        case 1:
          execution="SELECT * FROM cleandata_all_geom_new WHERE total_num_rides<5000";
          break;
        case 2:
          execution="SELECT * FROM cleandata_all_geom_new WHERE total_num_rides>=5000 AND total_num_rides<10000";
          break;
        case 3:
          execution="SELECT * FROM cleandata_all_geom_new WHERE total_num_rides>=10000 AND total_num_rides<15000";
          break;
        case 4:
          execution="SELECT * FROM cleandata_all_geom_new WHERE total_num_rides>=15000 AND total_num_rides<20000";
          break;
        case 5:
          execution="SELECT * FROM cleandata_all_geom_new WHERE total_num_rides>=20000 AND total_num_rides<25000";
          break;
        case 6:
          execution="SELECT * FROM cleandata_all_geom_new WHERE total_num_rides>=25000 AND total_num_rides<30000";
          break;
        case 7:
          execution="SELECT * FROM cleandata_all_geom_new WHERE total_num_rides>=30000";
          break;
        default:
          execution="SELECT * FROM cleandata_all_geom_new";
          break;
      }
    }
    if(filterSelect===3){
      execution="SELECT * FROM cleandata_all_geom_new WHERE total_num_rides>"+lowFilterNumber+"AND total_num_rides<"+hiFilterNumber;
    }
    if(filterSelect===1){
      execution=roughExecution;
    }
    if(filterSelect===4){
      execution=roughExecution2;
    }
    if(filterSelect===5){
      switch(option){
        case 8:
          execution="SELECT * FROM indego_combined WHERE per_round<0.05";
          break;
        case 9:
          execution="SELECT * FROM indego_combined WHERE per_round>=0.05 AND per_round<0.15";
          break;
        case 10:
          execution="SELECT * FROM indego_combined WHERE per_round>=0.15 AND per_round<0.25";
          break;
      }
    }
    app.geojsonClient.execute(execution) // 'LIMIT' should be added to the end of this line
      .done(function(data) {
        // L.geoJson(data, {
        //   pointToLayer: function(feature, latlng) {
        //     return L.circleMarker(latlng, numStyle(feature));
        //   },
      filterLayer=L.geoJson(data, setLayer);
      filterLayer.addTo(app.map);})
      .error(function() {if(filterState===0){
        if(typeof(lowFilterNumber)!==Number || typeof(hiFilterNumber)!==Number){
          alert("Please select a filter range or input integers to create a customized filter range!");
          setDefault();
        }
      }});
  };

  // var getTop10= function(){
  //     app.jsonClient.execute("SELECT start_lat, start_lon, end_lat, end_lon,start_station_id, end_station_id, COUNT(*)AS count FROM indego_all_clean GROUP BY 1,2,3,4,5,6 ORDER BY count DESC LIMIT 10")
  //     .done(function(data){
  //       console.log(data);
  //       _.each(data.rows,function(coordinates){
  //        pair=L.polyline([[coordinates.start_lat,coordinates.start_lon],[coordinates.end_lat,coordinates.end_lon]], top10Style);
  //        pair.addTo(app.map);
  //        top10s.push(pair);
  //      });
  //     });
  // };
  // getTop10();

  var option;
  var roughExecution;
  var roughExecution2;
  var refresh;
  refresh=function(){
    if(filterLayer!==undefined){
      app.map.removeLayer(filterLayer);
    }
    if(minMarker!==undefined){
      app.map.removeLayer(minMarker);
    }
    if(maxMarker!==undefined){
      app.map.removeLayer(maxMarker);
    }
    if(myStartRoute!==undefined){
      app.map.removeLayer(myStartRoute);
    }
    if(myEndRoute!==undefined){
      app.map.removeLayer(myEndRoute);
    }
    if(endMarker!==undefined){
      app.map.removeLayer(endMarker);
    }
    if(startMarker!==undefined){
      app.map.removeLayer(startMarker);
    }
    app.map.removeLayer(defaultLayer);
    setDefault();
  };

  $(document).ready(function(){
    $('#option1').click(function(e){
    $('#option0').click(function(e){
      $('#dropdownMenu1').html("Select filter range for rides count"+' <span class="caret"></span>');
      filterState=0;
    });
      $('#dropdownMenu1').html($('#option1').text()+' <span class="caret"></span>');
      filterState=1;
      option=1;
    });
    $('#option2').click(function(e){
      $('#dropdownMenu1').html($('#option2').text()+' <span class="caret"></span>');
      filterState=1;
      option=2;
    });
    $('#option3').click(function(e){
      $('#dropdownMenu1').html($('#option3').text()+' <span class="caret"></span>');
      filterState=1;
      option=3;
    });
    $('#option4').click(function(e){
      $('#dropdownMenu1').html($('#option4').text()+' <span class="caret"></span>');
      filterState=1;
      option=4;
    });
    $('#option5').click(function(e){
      $('#dropdownMenu1').html($('#option5').text()+' <span class="caret"></span>');
      filterState=1;
      option=5;
    });
    $('#option6').click(function(e){
      $('#dropdownMenu1').html($('#option6').text()+' <span class="caret"></span>');
      filterState=1;
      option=6;
    });
    $('#option7').click(function(e){
      $('#dropdownMenu1').html($('#option7').text()+' <span class="caret"></span>');
      filterState=1;
      option=7;
    });
    $('#option00').click(function(e){
      $('#dropdownMenu2').html("Select your filter range"+' <span class="caret"></span>');
      filterState=0;
    });
    $('#option8').click(function(e){
      // $('#dropdownMenu2').text($('#option8').text());
      $('#dropdownMenu2').html($('#option8').text()+' <span class="caret"></span>');
      filterState=1;
      option=8;
    });
    $('#option9').click(function(e){
      // $('#dropdownMenu2').text($('#option9').text());
      $('#dropdownMenu2').html($('#option9').text()+' <span class="caret"></span>');
      filterState=1;
      option=9;
    });
    $('#option10').click(function(e){
      // $('#dropdownMenu2').text($('#option10').text());
      $('#dropdownMenu2').html($('#option10').text()+' <span class="caret"></span>');
      filterState=1;
      option=10;
    });
    $('#below').click(function(e){
      roughExecution="SELECT * FROM cleandata_all_geom_new WHERE total_num_rides<"+avg;
    });
    $('#above').click(function(e){
      roughExecution="SELECT * FROM cleandata_all_geom_new WHERE total_num_rides>"+avg;
    });
    $('#below2').click(function(e){
      roughExecution2="SELECT * FROM indego_combined WHERE per_round<"+avgRound;
    });
    $('#above2').click(function(e){
      roughExecution2="SELECT * FROM indego_combined WHERE per_round>"+avgRound;
    });
  });

  setDefault();

  $('#min').click(function(e){
    minMarker=L.circleMarker([minFeature.properties.station_lat,minFeature.properties.station_lon],
    { radius:25,
      color: '#9ba1aa',
      weight: 5,
      opacity: 0.5,
      fillColor: '#9ba1aa',
      fillOpacity: 0.1 });
    minMarker.addTo(app.map);
    minMarker.on('mouseover', function(l){
      minMarker.setStyle( {radius: 15,
        color: '#9ba1aa',
        weight: 5,
        opacity: 0,
        fillColor: '#9ba1aa',
        fillOpacity: 0.8});
    });
    minMarker.on('mouseout', function(l){
      minMarker.setStyle( {radius:25,
        color: '#9ba1aa',
        weight: 5,
        opacity: 0.5,
        fillColor: '#9ba1aa',
        fillOpacity: 0.1});
    });
    fillForm(minFeature.properties);
    app.map.setView([minFeature.properties.station_lat, minFeature.properties.station_lon],15);
    if(filterLayer !== undefined) {
      defaultLayer.addTo(app.map);
    }

  });

  $('#max').click(function(e){
    maxMarker=L.circleMarker([maxFeature.properties.station_lat,maxFeature.properties.station_lon],
    { radius:25,
      color: '#9ba1aa',
      weight: 5,
      opacity: 0.5,
      fillColor: '#9ba1aa',
      fillOpacity: 0.1 });
    maxMarker.addTo(app.map);
    maxMarker.on('mouseover', function(l){
      maxMarker.setStyle( {radius: 15,
        color: '#9ba1aa',
        weight: 5,
        opacity: 0,
        fillColor: '#9ba1aa',
        fillOpacity: 0.8});
    });
    maxMarker.on('mouseout', function(l){
      maxMarker.setStyle( {radius:25,
        color: '#9ba1aa',
        weight: 5,
        opacity: 0.5,
        fillColor: '#9ba1aa',
        fillOpacity: 0.1});
    });
    fillForm(maxFeature.properties);
    app.map.setView([maxFeature.properties.station_lat, maxFeature.properties.station_lon],15);
    if(filterLayer !== undefined) {
      defaultLayer.addTo(app.map);
    }
  });

  $('#filter').click(function(e){
    app.map.removeLayer(defaultLayer);
    if(filterLayer!==undefined){
      app.map.removeLayer(filterLayer);
    }
    app.map.setView([39.957042, -75.175922], 13);
    lowFilterNumber=$('#low_num_rides').val();
    hiFilterNumber=$('#high_num_rides').val();
    // console.log(execution);
    // console.log($('#dropdownMenu1').text()==="Under 5000");
    setFilter();
  });

  $('#reset').click(function(e){
    refresh();
  });

  $('#refresh').click(function(e){
    refresh();
  });

  // var mystart;
  // var myend;
  // var mylocation;
  // var myObject;
  // var myJSON;
  // var myURL;
  // var routeResponse;
  // var myCoordinates;
  // var myRoute;

  // app.jsonClient.execute("SELECT start_lat, start_lon, end_lat, end_lon,start_station_id, end_station_id, COUNT(*)AS count FROM indego_all_clean WHERE NOT start_station_id=end_station_id GROUP BY 1,2,3,4,5,6 ORDER BY count DESC LIMIT 1")
  // .done(function(data){
  //   console.log(data);
  //       _.each(data.rows,function(latlon){
  //         mystart={"lat":latlon.start_lat, "lon":latlon.start_lon};
  //         myend={"lat":latlon.end_lat,"lon":latlon.end_lon};
  //         mylocation=[mystart,myend];
  //         console.log(mylocation);
  //         myObject = {
  //           "locations": mylocation,
  //           "costing":"bicycle",
  //           "directions_options":{"units":"miles"}
  //         };
  //         myJSON = JSON.stringify(myObject);
  //         myURL =
  //         "https://matrix.mapzen.com/optimized_route?json=" + myJSON + "&api_key=mapzen-bE4GcSs";
  //         routeResponse = $.ajax(myURL);
  //         routeResponse.done(function(data){
  //           myCoordinates = decode(data.trip.legs[0].shape);
  //           myRoute=L.polyline(myCoordinates, {color: '#f4d142'});
  //           myRoute.addTo(app.map);
  //         });
  //       });
  // });
  // app.geojsonClient.execute("SELECT * FROM bike_network") // 'LIMIT' should be added to the end of this line
  //   .done(function(data) {
  //     L.geoJson(data,{
  //       style: function(geoJsonFeature) {
  //         return {color:'#526d0f', weight: 2, opacity:0.5};
  //       }
  //     }).addTo(app.map);
  //   })
  //   .error(function(errors) {
  //   });

  // app.geojsonClient.execute(execution) // 'LIMIT' should be added to the end of this line
  //   .done(function(data) {
  //     L.geoJson(data, {
  //       onEachFeature: function(feature, layer) {
  //         layer.on('click', function() { fillForm(feature.properties); });
  //       }
  //     }).addTo(app.map);
  //   })
  //   .error(function(errors) {
  //   });

  // var mystart;
  // var myend;
  // var mylocation;
  // var myObject;
  // var myJSON;
  // var myURL;
  // var routeResponse;
  // var myCoordinates;
  // var myRoute;


  // app.jsonClient.execute("SELECT start_lat, start_lon, end_lat, end_lon FROM indego_all_clean WHERE NOT start_lat=end_lat OR NOT start_lon=end_lon LIMIT 2")
  //   .done(function(data) {
  //     _.each(data.rows,function(latlon){
  //       mystart={"lat":latlon.start_lat, "lon":latlon.start_lon};
  //       myend={"lat":latlon.end_lat,"lon":latlon.end_lon};
  //       mylocation=[mystart,myend];
  //       console.log(mylocation);
  //       myObject = {
  //         "locations": mylocation,
  //         "costing":"bicycle",
  //         "directions_options":{"units":"miles"}
  //       };
  //       myJSON = JSON.stringify(myObject);
  //       myURL =
  //       "https://matrix.mapzen.com/optimized_route?json=" + myJSON + "&api_key=mapzen-bE4GcSs";
  //       routeResponse = $.ajax(myURL);
  //       routeResponse.done(function(data){
  //         myCoordinates = decode(data.trip.legs[0].shape);
  //         myRoute=L.polyline(myCoordinates, {color: '#f4d142'});
  //         myRoute.addTo(app.map);
  //       });
  //     });
  //   });


// Leaflet draw setup
app.map.addLayer(app.drawnItems);

// Initialise the draw control and pass it the FeatureGroup of editable layers
app.map.addControl(
  new L.Control.Draw({
    edit: {
      featureGroup: app.drawnItems
    },
    draw: {
      rectangle: false,
      polyline: false,
      polygon: false,
      marker: false,
      circle: false
    }
  })
);

// Handling the creation of Leaflet.Draw layers
// Note the use of drawnLayerID - this is the way you should approach remembering and removing layers
var drawnLayerID;
app.map.on('draw:created', function (e) {
  var type = e.layerType;
  var layer = e.layer;
  console.log('draw created:', e);
});
