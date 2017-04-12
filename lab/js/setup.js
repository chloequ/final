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
  $('#bikeNumber').val("Number of Available Bikes: " + properties.bikesavailable);
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
  var filterLayer;
  var min;
  var max;
  var minFeature;
  var maxFeature;
  var theSelected;

var general=function(){
  app.jsonClient.execute("SELECT SUM(total_num_rides) FROM cleandata_all_geom_new")
    .done(function(data) {
      $('#total').val("Total Indego Rides in 2016: " + data.rows[0].sum);
    });
  app.jsonClient.execute("SELECT AVG(total_num_rides) FROM cleandata_all_geom_new")
    .done(function(data) {
      $('#mean').val("Average Annual Rides Per Station: " + data.rows[0].avg);
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
};
general();

  var setDefault = function(){
    app.map.setView([39.957042, -75.175922], 13);
    app.geojsonClient.execute("SELECT * FROM cleandata_all_geom_new") // 'LIMIT' should be added to the end of this line
      .done(function(data) {
        defaultLayer=L.geoJson(data, {
          pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng,
              numStyle(feature)
              // { radius: 6,
              //   color: '#9ba1aa',
              //   weight: 5,
              //   opacity: 0,
              //   fillColor: '#9ba1aa',
              //   fillOpacity: 0.5,
              //   popupAnchor:[-100,-100] }
              );
          },
          onEachFeature: function(feature, layer) {
            if (feature.properties.total_num_rides===min){
              minFeature=feature;
            }
            if (feature.properties.total_num_rides===max){
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
                  // popupAnchor:[-100,-100]
                });
                // layer.bindPopup(layer.feature.properties.station_id).openPopup();
              }

            });
            layer.on('mouseout', function(l){
              if (theSelected===undefined || theSelected._leaflet_id!==l.target._leaflet_id) {
                layer.setStyle(numStyle(feature));
              }

              //   {radius: 6,
              //    color: '#9ba1aa',
              //    weight: 5,
              //    opacity: 0,
              //    fillColor: '#9ba1aa',
              //    fillOpacity: 0.5,
              // //  popupAnchor:[-100,-100]
              //   }
            });
            layer.on('click', function(l) {
              if (theSelected !== undefined)
              fillForm(feature.properties);
              layer.setStyle(selectedStyle);
              console.log("the L", l);
              console.log("last L", theSelected);
              if (theSelected) {
                if (l.target._leaflet_id === theSelected._leaflet_id) { layer.setStyle(numStyle(feature));}
                else {theSelected.setStyle(numStyle(theSelected.feature));}
                theSelected = undefined;
                return;
              }
              theSelected = l.target;
              // if (theSelected) {theSelected.setStyle(numStyle(feature));}
              // app.map.setView([feature.properties.station_lat, feature.properties.station_lon],15);
            });
          }
        });
        defaultLayer.addTo(app.map);});
        // .error(function(filterNumber) {if(filterNumber === undefined || typeof(filterNumber)!== Number){
        //   alert("Please input an integer to filter displayed stations!");
        // }});
  };
  var setFilter = function(){
    // $('#filter').click(function(e){
    //   execution = "SELECT * FROM cleandata_geom WHERE num_rides>"+$('#filter').val();
    // });
    app.geojsonClient.execute(execution) // 'LIMIT' should be added to the end of this line
      .done(function(data) {
        // L.geoJson(data, {
        //   pointToLayer: function(feature, latlng) {
        //     return L.circleMarker(latlng, numStyle(feature));
        //   },
      filterLayer=L.geoJson(data, {
          pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, numStyle(feature));
          },
          onEachFeature: function(feature, layer) {
            layer.on('click', function() {
              fillForm(feature.properties);
              app.map.setView([feature.properties.station_lat, feature.properties.station_lon],15);
            });
            layer.on('mouseover', function() {
              layer.setStyle({
                radius: 15,
                color: '#9ba1aa',
                weight: 5,
                opacity: 0,
                fillColor: '#9ba1aa',
                fillOpacity: 0.8,
              });
              // layer.bindPopup(layer.feature.properties.station_id).openPopup();
            });
            layer.on('mouseout', function(){
              layer.setStyle(numStyle(feature));
            });
          }
        });
        filterLayer.addTo(app.map);})
        .error(function(lowFilterNumber) {if(lowFilterNumber === undefined || typeof(lowFilterNumber)!== Number || hiFilterNumber === undefined || typeof(hiFilterNumber)!== Number){
          alert("Please input integers to create a filter range!");
        }});


        // L.tooltip({sticky: true},myStations).addTo(app.map);
        // myStations.bindTooltip("my tooltip").openTooltip();

        // L.geoJson(data, {
        //   onEachFeature: function(feature, layer) {
        //     layer.on('click', function() {
        //       fillForm(feature.properties);
        //       app.map.setView([feature.properties.station_lat, feature.properties.station_lon],15);
        //     });
        //     feature.bindPopup('mytooltip').openPopup();
        //   }
        // }).addTo(app.map);
  };

  $(document).ready(function(){
    $('#option1').click(function(e){
      $('#dropdownMenu1').text($('#option1').text());
    });
    $('#option2').click(function(e){
      $('#dropdownMenu1').text($('#option2').text());
    });
    $('#option3').click(function(e){
      $('#dropdownMenu1').text($('#option3').text());
    });
  });

  setDefault();

  $('#min').click(function(e){
    if(filterLayer !== undefined) {
      defaultLayer.addTo(app.map);
    }
    fillForm(minFeature.properties);
    app.map.setView([minFeature.properties.station_lat, minFeature.properties.station_lon],15);
  });

  $('#max').click(function(e){
    if(filterLayer !== undefined) {
      defaultLayer.addTo(app.map);
    }
    fillForm(maxFeature.properties);
    app.map.setView([maxFeature.properties.station_lat, maxFeature.properties.station_lon],15);
  });

  $('#filter').click(function(e){
    app.map.removeLayer(defaultLayer);
    if(filterLayer!==undefined){
      app.map.removeLayer(filterLayer);
    }
    app.map.setView([39.957042, -75.175922], 13);
    lowFilterNumber=$('#low_num_rides').val();
    hiFilterNumber=$('#high_num_rides').val();
    execution="SELECT * FROM cleandata_all_geom_new WHERE total_num_rides>"+lowFilterNumber+"AND total_num_rides<"+hiFilterNumber;
    setFilter();
  });

  $('#reset').click(function(e){
    if(filterLayer!==undefined){
      app.map.removeLayer(filterLayer);
    }
    app.map.removeLayer(defaultLayer);
    setDefault();
  });

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

  var mystart;
  var myend;
  var mylocation;
  var myObject;
  var myJSON;
  var myURL;
  var routeResponse;
  var myCoordinates;
  var myRoute;


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
