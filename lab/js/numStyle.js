var numStyle = function (feature) {
  if (feature.properties.total_num_rides < 5000){
    return {
      radius: 2,
      color: '#87e5e0',
      weight: 5,
      opacity: 0,
      fillColor: '#87e5e0',
      fillOpacity: 0.5
    };
  }
  if (feature.properties.total_num_rides < 10000 && feature.properties.total_num_rides >= 5000){
    return {
      radius: 4,
      color: '#87e5e0',
      weight: 5,
      opacity: 0,
      fillColor: '#87e5e0',
      fillOpacity: 0.5
    };
  }
  if (feature.properties.total_num_rides < 15000 && feature.properties.total_num_rides >= 10000){
    return {
      radius: 6,
      color: '#87e5e0',
      weight: 5,
      opacity: 0,
      fillColor: '#87e5e0',
      fillOpacity: 0.5
    };
  }
  if (feature.properties.total_num_rides < 20000 && feature.properties.total_num_rides >= 15000){
    return {
      radius: 8,
      color: '#87e5e0',
      weight: 5,
      opacity: 0,
      fillColor: '#87e5e0',
      fillOpacity: 0.5
    };
  }
  if (feature.properties.total_num_rides < 25000 && feature.properties.total_num_rides >= 20000){
    return {
      radius: 10,
      color: '#87e5e0',
      weight: 5,
      opacity: 0,
      fillColor: '#87e5e0',
      fillOpacity: 0.6
    };
  }
  if (feature.properties.total_num_rides < 30000 && feature.properties.total_num_rides >= 25000){
    return {
      radius: 12,
      color: '#87e5e0',
      weight: 5,
      opacity: 0,
      fillColor: '#87e5e0',
      fillOpacity: 0.7
    };
  }
  else {
    return {
      radius: 14,
      color: '#87e5e0',
      weight: 5,
      opacity: 0,
      fillColor: '#87e5e0',
      fillOpacity: 0.85
    };
  }
};

var selectedStyle = {
  radius: 25,
  color: '#a7d6d3',
  weight: 5,
  opacity: 0.7,
  fillColor: '#728cd3',
  fillOpacity: 0.7
};

var endStyle = {
  radius: 20,
  color: '#728cd3',
  weight: 3,
  opacity: 0.7,
  fillColor: '#728cd3',
  fillOpacity: 0
};

var startStyle = {
  radius: 18,
  color: '#a7d6d3',
  weight: 3,
  opacity: 0.7,
  fillColor: '#a7d6d3',
  fillOpacity: 0
};

var top10Style = function(feature){
  if(feature.count>=1000 && feature.count<1500){
    return {
      color: rgba(113, 204, 210, 0.4),
      weight:5
    };
  }
  if(feature.count>=1500 && feature.count<2000){
    return {
      color: rgba(113, 204, 210, 0.6),
      weight:10
    };
  }
  if(feature.count>=2000 && feature.count<2500){
    return {
      color: rgba(113, 204, 210, 0.8),
      weight:15
    };
  }
  if(feature.count>2500){
    return {
      color: rgba(113, 204, 210, 0.8),
      weight:25
    };
  }
};
