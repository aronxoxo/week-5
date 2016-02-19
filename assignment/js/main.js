/* =====================
 Copy your code from Week 4 Lab 2 Part 2 part2-app-state.js in this space
===================== */
var map = L.map('map', {
   center: [39.9522, -75.1639],
   zoom: 11
 });
var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
   attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
   subdomains: 'abcd',
   minZoom: 0,
   maxZoom: 20,
   ext: 'png'
 }).addTo(map);

var myMarkers=[];

var phillySolarInstallationDataUrl = "https://raw.githubusercontent.com/CPLN690-MUSA610/datasets/master/json/philadelphia-solar-installations.json";
var phillyCrimeDataUrl = "https://raw.githubusercontent.com/CPLN690-MUSA610/datasets/master/json/philadelphia-crime-snippet.json";
var phillyBikeCrashesDataUrl = "https://raw.githubusercontent.com/CPLN690-MUSA610/datasets/master/json/philadelphia-bike-crashes-snippet.json";

var downloadSolar = $.ajax(phillySolarInstallationDataUrl);
var downloadCrime = $.ajax(phillyCrimeDataUrl);
var downloadBikeCrashes = $.ajax(phillyBikeCrashesDataUrl);

//Parse data according to the original data. Add new properties "newLat" and
//"newLng" to avoid writing three different makeMarkers() function
var parseData = function(data, type){
//Parse Solar Installation Data
  if(type === "Solar"){
    var parsed = JSON.parse(data);
     _.map(parsed,function(datum){
      datum.newLat = parseFloat(datum.Y);
      datum.newLng = parseFloat(datum.X);
    });
    return parsed;
  }
//Parse Crime Data, shamelessly borrowed the idea in the "example" folder
  else if(type === "Crime"){
    var parsed = _.filter(JSON.parse(data), function(datum){
      return typeof datum.Coordinates !== 'number';
    });
    _.map(parsed, function(datum){
      var latlongStrings = datum.Coordinates.replace('(', '').replace(')', '').replace(',', '').split(' ');
      datum.newLat = parseFloat(latlongStrings[0]);
      datum.newLng = parseFloat(latlongStrings[1]);
    });
    return parsed;
  }
//Parse Bike Crashes Data
  else if(type === "BikeCrashes"){
    var parsed = JSON.parse(data);
     _.map(parsed,function(datum){
      datum.newLat = parseFloat(datum.LAT);
      datum.newLng = parseFloat(datum.LNG);
    });
    return parsed;
  }
};

//Make markers using the two newly defined properties
var makeMarkers = function(array) {
  return _.map(array, function(obj){
    return L.marker([obj.newLat, obj.newLng]);
  });
};

//Plot the markers on the map
var plotMarkers = function(array1) {
  _.each(array1, function(array2){
    array2.addTo(map);
  });
};

//Remove the markers from the map
 var removeMarkers = function(obj1) {
   _.each(obj1, function(obj2){
     map.removeLayer(obj2);
   });
 };

 $(document).ready(function() {
   //Change the name of each filed of the form
   $('#text-label').text('Data Type');
   $('#lat-label').text('Latitude Key');
   $('#lng-label').text('Longitude Key');
   //Enable the display and input
   $('#text-input').prop('disabled', false);
   $('#lat-input').prop('disabled', false);
   $('#lng-input').prop('disabled', false);
   //Change the display value of Latitude and Longitude fields according to the URL data selection
   //Avoid user input, avoid errors. And it makes more sense to channge simultaneously and accordingly.
    $('#selectUrl').change(function(e){
      if($('#selectUrl').val() === "Blank"){
        $("#selectLat").empty();
        $("#selectLng").empty();
      }
      if($('#selectUrl').val() === "Solar"){
        $("#selectLat").empty();
        $("#selectLng").empty();
        $("#selectLat").append("<option value=\"Solar\">Solar installation Latitude</option>");
        $("#selectLng").append("<option value=\"Solar\">Solar installation Longitude</option>");
      }
      else if($('#selectUrl').val() === "Crime"){
        $("#selectLat").empty();
        $("#selectLng").empty();
        $("#selectLat").append("<option value=\"Crime\">Crime Latitude</option>");
        $("#selectLng").append("<option value=\"Crime\">Crime Longitude</option>");
      }
      else if($('#selectUrl').val() === "BikeCrashes"){
        $("#selectLat").empty();
        $("#selectLng").empty();
        $("#selectLat").append("<option value=\"BikeCrashes\">Bike Crashes Latitude</option>");
        $("#selectLng").append("<option value=\"BikeCrashes\">Bike Crashes Longitude</option>");
      }
    });
  //map different set of markers when users click the search button
   $('#btn-search-label').click(function(){
     removeMarkers(myMarkers);
     if($('#selectUrl').val() === "Solar"){
       downloadSolar.done(function(data){
         plotMarkers(myMarkers = makeMarkers(parseData(data, "Solar")));
       });
     }
     if($('#selectUrl').val() === "Crime"){
       downloadCrime.done(function(data){
         plotMarkers(myMarkers = makeMarkers(parseData(data, "Crime")));
       });
     }
     if($('#selectUrl').val() === "BikeCrashes"){
       downloadBikeCrashes.done(function(data){
         plotMarkers(myMarkers = makeMarkers(parseData(data, "BikeCrashes")));
       });
    }
   });
});
