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

//varaibles to store data
var dataSolar = [];
var dataCrime = [];
var dataBikeCrashes = [];

//Variables to store markers
var markerSolar = [];
var markerCrime = [];
var markerBikeCrashes = [];

//Get, parse, and make markers from the begining
var dataGetParseMarker = function(){
    $.ajax("https://raw.githubusercontent.com/CPLN690-MUSA610/datasets/master/json/philadelphia-solar-installations.json").done(function(solar){
      dataSolar = _.chain(JSON.parse(solar)).map(function(datum){
        datum.coords = [parseFloat(datum.Y),parseFloat(datum.X)];
        markerSolar.push(datum.marker = L.marker(datum.coords));
        return datum;
      }).value();
    });
    $.ajax("https://raw.githubusercontent.com/CPLN690-MUSA610/datasets/master/json/philadelphia-crime-snippet.json").done(function(crime){
      dataCrime = _.chain(JSON.parse(crime)).filter(function(datum){
        return typeof datum.Coordinates !== 'number';
      }).map(function(datum) {
        var latlongStrings = datum.Coordinates.replace('(', '').replace(')', '').replace(',', '').split(' ');
        var latlong = _.map(latlongStrings, function(str) {
          return parseFloat(str);
        });
        datum.coords = latlong;
        markerCrime.push(datum.marker = L.marker(datum.coords));
        return datum;
      }).value();
    });
    $.ajax("https://raw.githubusercontent.com/CPLN690-MUSA610/datasets/master/json/philadelphia-bike-crashes-snippet.json").done(function(bike){
      dataBikeCrashes = _.chain(JSON.parse(bike)).map(function(datum){
        datum.coords = [parseFloat(datum.LAT), parseFloat(datum.LNG)];
        markerBikeCrashes.push(datum.marker = L.marker(datum.coords));
        return datum;
      }).value();
    });
};

//Call the above function
dataGetParseMarker();

//Remove the marker layer
var removeMarkers = function(data){
   _.chain(data).each(function(datum){
     map.removeLayer(datum);
   }).value();
};

//Plot markers
var plotMarkers = function(data){
  _.chain(data).each(function(datum){
  datum.addTo(map);
}).value();
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
   $('#selectUrl').change(function(){
      if($('#selectUrl').val() === "Blank"){
        $("#selectLat").empty();
        $("#selectLng").empty();
        removeMarkers(markerSolar);
        removeMarkers(markerCrime);
        removeMarkers(markerBikeCrashes);
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
    //Remove any previous marker layer, and add a selected data marker layer to the map, when the button is clicked
    $('#btn-search-label').click(function(){
      if($('#selectUrl').val() === "Solar"){
        removeMarkers(markerSolar);
        removeMarkers(markerCrime);
        removeMarkers(markerBikeCrashes);
        plotMarkers(markerSolar);
      }
      else if($('#selectUrl').val() === "Crime"){
        removeMarkers(markerSolar);
        removeMarkers(markerCrime);
        removeMarkers(markerBikeCrashes);
        plotMarkers(markerCrime);
      }
      else if($('#selectUrl').val() === "BikeCrashes"){
        removeMarkers(markerSolar);
        removeMarkers(markerCrime);
        removeMarkers(markerBikeCrashes);
        plotMarkers(markerBikeCrashes);
     }
    });
});
