// Rutger van Heijningen
// 10272224
// Data Processing, week 4
// scatter.js
// Interactive Scatterplot

// Load api in variable
var first_api = "https://stats.oecd.org/SDMX-JSON/data/ANHRS/AUS+FRA+DEU+NLD+ESP.TE.A/all?startTime=2013&endTime=2016&dimensionAtObservation=allDimensions"
var second_api = "https://stats.oecd.org/SDMX-JSON/data/PDB_LV/AUS+FRA+DEU+NLD+ESP.T_GDPPOP.CPC/all?startTime=2013&endTime=2016&dimensionAtObservation=allDimensions"

// Variables
var hours = []
var gdp = []
var list_max_hours = []
var list_max_gdp = []
var list_countries = []
var data_2013 = []
var data_2014 = []
var data_2015 = []
var data_2016 = []

// Load function when website loads
window.onload = function(){
  d3.queue()
    .defer(d3.request, first_api)
    .defer(d3.request, second_api)
    .awaitAll(doFunction);
  }

// Function for making the scatterplot
function doFunction(error, response) {

  // Error if loading failed
  if (error) throw error;

  // Variables for storing raw data
  var first_raw = JSON.parse(response[0].responseText)
  var second_raw = JSON.parse(response[1].responseText)

  // Variables for years and countries
  var years = first_raw.structure.dimensions.observation[1].values
  var countries = first_raw.structure.dimensions.observation[0].values

  // Looping over every country
  for (var i = 0; i < countries.length; i++){

    var hours_worked = []
    var gdp_head = []

    // Looping over every year
    for (var j = 0; j < years.length; j++){
    hours_worked.push(first_raw.dataSets[0].observations[i + ":" + j + ":0:0"][0]);
    gdp_head.push(second_raw.dataSets[0].observations[i + ":0:0:" + j][0]);
    }

  // List of maximums per country
  list_max_hours.push(Math.max.apply(Math,hours_worked))
  list_max_gdp.push(Math.max.apply(Math,gdp_head))

  // Variable of maximum value
  var max_hours = Math.max.apply(Math,list_max_hours)
  var max_gdp = Math.max.apply(Math,list_max_gdp)

  // List with hours and gdp
  hours.push(hours_worked)
  gdp.push(gdp_head)

  // List of countries
  list_countries.push(countries[i]["name"])

  // Total list
  var dataset = d3.zip([hours, gdp]);
  }

// Seperate data for each year
for (var i = 0; i < countries.length; i++){
  data_2013.push([dataset[0][0][i][0], dataset[1][0][i][0]])
  data_2014.push([dataset[0][0][i][1], dataset[1][0][i][1]])
  data_2015.push([dataset[0][0][i][2], dataset[1][0][i][2]])
  data_2016.push([dataset[0][0][i][3], dataset[1][0][i][3]])
}

// Margin & width, height variables
var margin = {top: 100, right: 150, bottom: 150, left:50};
var width = 800 - margin.right - margin.left;
var height = 550 - margin.top - margin.bottom;

// X scale
var x = d3.scaleLinear()
    .domain([0, max_hours + 300])
    .range([0, width]);

// Y scale
var y = d3.scaleLinear()
    .domain([0, max_gdp + 9500])
    .range([height, 0]);

// Color variable
var color = ["#B8860B", "#0000FF", "#DC143C", "#FF8C00", "#228B22"]

// X-axis
var xAxis = d3.axisBottom()
    .scale(x);

// Y-axis
var yAxis = d3.axisLeft()
    .scale(y);

// Create SVG area
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Create x-axis
svg.append("g")
   .attr("class", "x axis")
   .attr("transform", "translate(0," + height + ")")
   .call(xAxis)

// Label x-axis
svg.append("text")
    .attr("x", width)
    .attr("y", 290)
    .style("font-size", "12px")
    .style("text-anchor", "end")
    .text("Average hours worked");

// Create y-axis
svg.append("g")
   .attr("class", "y axis")
   .call(yAxis)

// Label x-axis
svg.append("text")
   .attr("x", 0)
   .attr("y", 20)
   .attr("transform", "rotate(-90)")
   .style("font-size", "12px")
   .style("text-anchor", "end")
   .text("Average GDP per head ($)");

// Create a legend
var legend = svg.selectAll(".legend")
     .data(list_countries)
     .enter().append("g")
     .attr("class", "legend")
     .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

// Legend color
legend.append("rect")
   .attr("x", width + 20)
   .attr("width", 20)
   .attr("height", 20)
   .style("fill", function(d,i){
     return color[i]});

// Legend text
legend.append("text")
   .attr("x", width + 50)
   .attr("y", 9)
   .attr("dy", ".35em")
   .style("text-anchor", "begin")
   .text(function(d) { return d; });

// Title
svg.append("g")
   .attr("class", "title")
   .append("text")
   .attr("x", 215)
   .attr("y", -80)
   .attr("dx", ".71em")
   .attr("font-size", "20px")
   .attr("font-weight", "bold")
   .text("Hours worked vs. Salary");

// Name & studentnumber
svg.append("g")
   .attr("class", "name")
   .append("text")
   .attr("x", 215)
   .attr("y", -50)
   .attr("dx", ".71em")
   .text("Rutger van Heijningen, 10272224");

// Explanatory paragraph
svg.append("g")
   .attr("class", "x axis")
   .append("text")
   .attr("x", width - 650)
   .attr("y", height + 80)
   .attr("dx", ".71em")
   .text("Interactieve scatterplot van het gemiddelde aantal uren gewerkt per land versus het gemiddelde salaris per land.");

// Source location
d3.select("body")
  .append("text")
  .attr("class", "link")
  .html("<a href='http://stats.oecd.org/#'>Data source</a>");

// when the input range changes update value
d3.select("#nValue").on("input", function() {
  update(+this.value);
});

// Initial update value
update(2013);

var data = {
  2013: [
    {
      "country": AUS,
      value: 12
      hoursworked: 123
    },

  ],
  2014: [

  ]
}
// Update function
function update(nValue) {

  data_year = data[nValue];
  // Load the right data file
  if (nValue == 2013) {
    var data_year = data_2013;
  } else if (nValue ==  2014) {
    var data_year = data_2014;
  } else if (nValue == 2015) {
    var data_year = data_2015;
  } else {
    var data_year = data_2016;
  }

  // Remove circles
  svg.selectAll("circle").remove();

  // Plot circles for a certain year, with different colors (country)
  svg.selectAll("circle")
     .data(data_year)
     .enter()
     .append("circle")
     .attr("cx", function(d) {
     		return x(d[0]);
     })
     .attr("cy", function(d) {
     		return y(d[1]);
     })
     .attr("r", 5)
     .style("fill", function(d,i){
        return color[i]
      });
    }
};
