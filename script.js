var map = L.map('map').setView([40.75,-73.89], 12);

var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
  attribution: 'WiFi Data &copy; <a href="http://www1.nyc.gov/site/doitt/index.page">DoITT</a> Map Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors, Map Tiles &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});

map.addLayer(layer);

var neighborhoodsGeoJSON;
var wifiGeoJSON;
var subwayLinesGeoJSON;

$.getJSON( "geojson/NYC_neighborhood_data.geojson", function( data ) {
    var neighborhoods = data;

    var incomeStyle = function (feature){
        var value = feature.properties.MedHouInco;
        var fillColor = null;
        if(value >= 0 && value <=30000){
          fillColor = "#fee5d9";
        }
        if(value >30000 && value <=60000){
          fillColor = "#fcbba1";
        }
        if(value >60000 && value<=90000){
          fillColor = "#fc9272";
        }
        if(value > 90000 && value <=120000){
          fillColor = "#fb6a4a";
        }
        if(value > 120000 && value <=150000) {
          fillColor = "#de2d26";
        }
        if(value > 150000) {
          fillColor = "#a50f15"
        }
        var style = {
          weight: 1,
          opacity: 0.5,
          color: 'white',
          fillOpacity: 0.8,
          fillColor: fillColor
        };
        return style;
    }

    var incomeClick = function (feature, layer) {
        var percent = feature.properties.MedHouInco;
        percent = percent.toFixed(0);
        layer.bindPopup("<strong>Neighborhood:</strong> " + feature.properties.NYC_NEIG + "<br /><strong>Median Household Income: </strong>$" + percent);
    }

    neighborhoodsGeoJSON = L.geoJson(neighborhoods, {
        style: incomeStyle,
        onEachFeature: incomeClick
    }).addTo(map);

});

$.getJSON( "geojson/MTA_subway_lines.geojson", function( data ) {
    // ensure jQuery has pulled all data out of the geojson file
    var subwayLines = data;

    // style for subway lines
    var subwayStyle = {
        "color": "#a5a5a5",
        "weight": 2,
        "opacity": 0.80
    };

    // function that binds popup data to subway lines
    var subwayClick = function (feature, layer) {
        // let's bind some feature properties to a pop up
        layer.bindPopup(feature.properties.Line);
    }

    // using L.geojson add subway lines to map
    subwayLinesGeoJSON = L.geoJson(subwayLines, {
        style: subwayStyle,
        onEachFeature: subwayClick
    }).addTo(map);

});

$.getJSON("geojson/wifi_hotspot.geojson", function( data ) {
    // ensure jQuery has pulled all data out of the geojson file
    var wifi = data;
    var wifiPointToLayer = function (feature, latlng){
      var value = feature.properties.provider;
      console.log(value);
      var fillColor = null;
      if (value == "Transit Wireless") {
        fillColor = "green";
      }
      if(value == "AT&T") {
        fillColor = "orange";
      }
      if(value == "Cablevision") {
        fillColor = "red";
      }
      if (value == "QPL") {
        fillColor = "purple";
      }
      if (value == "Time Warner Cable") {
        fillColor = "black";
      }
      if (value == "Harlem") {
        fillColor = "hotpink";
      }
      if (value == "Chelsea") {
        fillColor = "brown";
      }
      if (value == "Manhattan Down Alliance") {
        fillColor = "yellow";
      }
      if (value == "Downtown Brooklyn") {
        fillColor = "darkCyan";
      }
      var wifiMarker = L.circleMarker(latlng, {
        radius: 3,
        fillOpacity: 1,
        fillColor: fillColor,
        stroke: false
      });
      return wifiMarker;
    }
    var wifiClick = function (feature, layer) {
      var provider = feature.properties.provider;
      layer.bindPopup("<strong>Provider:</strong> " + provider);
    }
    wifiGeoJSON = L.geoJson(wifi, {
      pointToLayer: wifiPointToLayer,
      onEachFeature: wifiClick
    }).addTo(map);

    createLayerControls();
});

function createLayerControls(){

    var baseMaps = {
      "Positron": layer,
    };

    var overlayMaps = {
      "WiFI Hotspots": wifiGeoJSON,
      "Neighborhood Map": neighborhoodsGeoJSON
    };

    L.control.layers(baseMaps, overlayMaps).addTo(map);

};
