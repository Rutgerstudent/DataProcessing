// Rutger van Heijningen
// 10272224
// Data Processing, week 5
// linkedviews.js
// Linked Views (Interactive map & pie chart)

// Load function when website loads
window.onload = function(){

// Map function
var unemployment = d3.map();

// Queue
d3.queue()
    .defer(d3.json, "https://d3js.org/us-10m.v1.json")
    .defer(d3.tsv, "unemployment.tsv", function(d) { unemployment.set(d.id, +d.rate); })
    // Load map function (piechart function is called by map function)
    .await(map);

// Function for generating the map
function map(error, us) {
  if (error) throw error;

  // Create SVG
  var svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height");

  // Create path (geographic path generator)
  var path = d3.geoPath();

  // Create x-scale
  var x = d3.scaleLinear()
      .domain([1, 10])
      .rangeRound([600, 860]);

  // Color variable
  var color = d3.scaleThreshold()
      .domain(d3.range(2, 10))
      .range(d3.schemeBlues[9]);

  // Create key class
  var g = svg.append("g")
      .attr("class", "key")
      .attr("transform", "translate(0,40)");

  // Create rect for axis
  g.selectAll("rect")
    .data(color.range().map(function(d) {
        d = color.invertExtent(d);
        if (d[0] == null) d[0] = x.domain()[0];
        if (d[1] == null) d[1] = x.domain()[1];
        return d;
      }))
    .enter().append("rect")
      .attr("height", 8)
      .attr("x", function(d) { return x(d[0]); })
      .attr("width", function(d) { return x(d[1]) - x(d[0]); })
      .attr("fill", function(d) { return color(d[0]); });

  // Create axis text
  g.append("text")
      .attr("class", "caption")
      .attr("x", x.range()[0])
      .attr("y", -6)
      .attr("fill", "#000")
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text("Unemployment rate");

  // Create axis for unemployment rate (%)
  g.call(d3.axisBottom(x)
      .tickSize(13)
      .tickFormat(function(x, i) { return i ? x : x + "%"; })
      .tickValues(color.domain()))
    .select(".domain")
      .remove();

  // Load page with education information, United States (start situation)
  piechart(00000);

  // Create counties
  svg.append("g")
      .attr("class", "counties")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
    .on("click", function(){
               // Call piechart function with county id
               self.piechart(d3.event.srcElement.__data__.id)
             })
      .attr("fill", function(d) { return color(d.rate = unemployment.get(d.id)); })
      .attr("d", path)
    .append("title")
      .text(function(d) { return d.rate + "%"; });

  // Create lines to visualize states
  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("class", "states")
      .attr("d", path);
  }
}

// Function that creates a piechart with county id from click
function piechart(county){

// Variables
var width = 295
var height = 600
var radius = width / 2

// Legend labels
var labels = ["Adults with less than a high school diploma",
              "Adults with a high school diploma only",
              "Adults completing some college or associate's degree",
              "Adults with a bachelor's degree or higher"]

// Remove piechart, update function
d3.select("#pie_chart").remove();

// Create SVG
var svg = d3.select("body").append("svg")
    .attr("id","pie_chart")
    .attr("width", width)
    .attr("height", height);

// Load education.csv
d3.csv("education.csv", function(error, data) {
  if (error) throw error;

// Variable
var edu = []

// Load variables with certain county information
var less = +data.filter(function(d){return d.id == county})[0].less
var school = +data.filter(function(d){return d.id == county})[0].school
var college = +data.filter(function(d){return d.id == county})[0].college
var bachelor = +data.filter(function(d){return d.id == county})[0].bachelor

// Legend variable
var name = data.filter(function(d){return d.id == county})[0].name

// Make a array with specific data for a county
edu.push(less,school,college,bachelor)

// Variable for color
var color = d3.scaleOrdinal(d3.schemeBlues[4]);

// Create pie
var pie = d3.pie();

// Create arcs
var arc = d3.arc()
	.outerRadius(radius)
	.innerRadius(radius/2);

// Create container, specific place
var container = svg.append("g")
	.attr('transform',"translate(" + width / 2 + "," + (height - width / 2) + ")");

// Load data in pie
var stencil = pie(edu);

// Load data in arcs
var g = container.selectAll("g")
	.data(stencil)
	.enter()
	.append('g');

// Create arcs
g.append("path")
  .attr("d", arc)
  .style("fill", function(d,i){
  	return color(d.value);
  });

// Text on arc, percent
g.append("text")
      .attr("transform", function(d) {
      d.innerRadius = 0;
      d.outerRadius = radius;
      return "translate(" + arc.centroid(d) + ")";
      })
      .attr("text-anchor", "middle")
      .text(function(d, i) { return d.value + "%" });

// Text above legend, name of county
svg.append("text")
        .attr("x", (width / 2))
        .attr("y", (234))
        .attr("text-anchor", "middle")
        // .style("font-weight", "bold")
        .style("font-size", "17px")
        .text(function(d) {return name});

// Color variable
var color = d3.scaleOrdinal(d3.schemeBlues[4]);

// Create legend
var legendG = svg.selectAll(".legend")
  .data(pie(stencil))
  .enter().append("g")
  .attr("transform", function(d,i){
    return "translate(" + (8) + "," + (i * 15 + 240) + ")";})
  .attr("class", "legend");

// Create legend rectangle
legendG.append("rect")
  .attr("width", 10)
  .attr("height", 10)
  .attr("fill", function(d,i) {
    return color(labels[i]);
  });

// Create legend text
legendG.append("text")
  .text(function(d, i){
    return labels[i];
  })
  .style("font-size", 12)
  .attr("y", 10)
  .attr("x", 11);

////////// All text elements //////////

// Title
svg.append("g")
   .attr("class", "title")
   .append("text")
   .attr("text-anchor", "middle")
   .attr("x", (width / 2) - 20)
   .attr("y", 20)
   .attr("dx", ".71em")
   .attr("font-size", "20px")
   .attr("font-weight", "bold")
   .text("Unemployment vs. Education");

// Name & studentnumber
svg.append("g")
   .attr("class", "name")
   .append("text")
   .attr("text-anchor", "middle")
   .attr("x", (width / 2) - 20)
   .attr("y", 40)
   .attr("dx", ".71em")
   .text("Rutger van Heijningen, 10272224");

// Underline
svg.append("g")
.attr("class", "description")
.append("text")
.attr("text-anchor", "middle")
.style("font-size", "11.5px")
.attr("x", width / 2)
.attr("y", 52)
.text("_____________________________________________________");

// Description
svg.append("g")
  .attr("class", "description")
  .append("text")
  .attr("text-anchor", "middle")
  .style("font-size", "17px")
  .attr("x", width / 2)
  .attr("y", 75)
  .text("Description");

// Description, text #1
svg.append("g")
   .attr("class", "description")
   .append("text")
   .style("font-size", "11.5px")
   .attr("x", 0)
   .attr("y", 90)
   .text("The map shows the unemployment rate per county in America");

// Description, text #2
svg.append("g")
 .attr("class", "description")
 .append("text")
 .style("font-size", "11.5px")
 .attr("x", 0)
 .attr("y", 105)
 .text("The pie chart shows the average education levels per county");

// Description, text #3
svg.append("g")
 .attr("class", "description")
 .append("text")
 .style("font-size", "11.5px")
 .attr("x", 0)
 .attr("y", 130)
 .text("The idea of this data visualization is to show a connection");

// Description, text #4
svg.append("g")
  .attr("class", "description")
  .append("text")
  .style("font-size", "11.5px")
  .attr("x", 0)
  .attr("y", 145)
  .text("between education levels and unemployment rates in America");

// Instructions
svg.append("g")
  .attr("class", "instructions")
  .append("text")
  .attr("text-anchor", "middle")
  .style("font-size", "17px")
  .attr("x", width / 2)
  .attr("y", 175)
  .text("Instructions");

// Instructions, text #1
svg.append("g")
  .attr("class", "instructions")
  .append("text")
  .style("font-size", 12)
  .attr("x", 0)
  .attr("y", 190)
  .text("\u2219" + "Hold your cursor on a county to show unemployment rate");

// Instruction, text #2
svg.append("g")
  .attr("class", "instructions")
  .append("text")
  .style("font-size", 12)
  .attr("x", 0)
  .attr("y", 205)
  .text("\u2219" + "Click on a county to update education information");

// Source location, unemployment
svg.append("g")
 .attr("class", "link")
 .append("text")
 .attr("text-anchor", "middle")
 .style("font-size", 12)
 .style("fill", "blue")
 .style("text-decoration", "underline")
 .attr("x", width / 2)
 .attr("y", 440)
 .text("Unemployment data")
 .on("click", function() { window.open("https://www.census.gov/support/USACdataDownloads.html#EMN"); });

// Source location, education
svg.append("g")
 .attr("class", "link")
 .append("text")
 .attr("text-anchor", "middle")
 .style("font-size", 12)
 .style("fill", "blue")
 .style("text-decoration", "underline")
 .attr("x", width / 2)
 .attr("y", 460)
 .text("Education data")
 .on("click", function() { window.open("https://www.census.gov/support/USACdataDownloads.html#EDU"); });
})

}
