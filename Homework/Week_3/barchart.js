// Rutger van Heijningen
// 10272224
// Data Processing, week 2
// barchart.js

// Barchart with JSON input

// Width and height
var margin = {top: 100, right: 50, bottom: 100, left:50};
var width = 800 - margin.right - margin.left;
var height = 500 - margin.top - margin.bottom;

// X & Y scale
var x = d3.scale.ordinal()
    .rangeBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

// Define X & Y axis
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

// Creating SVG element
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Loading in data
d3.csv("huurverhoging.csv", function(error, data) {

data.forEach(function(d) {
      d.Perioden = d.Perioden;
      d.Huurverhoging = +d.Huurverhoging;
  });

// X & Y domain
x.domain(data.map(function(d) { return d.Perioden; }));
y.domain([0, d3.max(data, function(d) { return d.Huurverhoging; })]);

// Create X & Y axis
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("x", width - 25)
    .attr("y", 38)
    .attr("dx", ".71em")
    .style("text-anchor", "end")
    .text("Year");

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 5)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Huurverhoging (%)");

// Creating bars
svg.selectAll("bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.Perioden); })
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d.Huurverhoging); })
    .attr("height", function(d) { return height - y(d.Huurverhoging); })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);
});

// Creating tooltip
var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return d.Huurverhoging + "%";
  });

// Tooltip
svg.call(tip);

// Title
svg.append("g")
    .attr("class", "title")
    .append("text")
    .attr("x", 200)
    .attr("y", -80)
    .attr("dx", ".71em")
    .attr("font-size", "20px")
    .attr("font-weight", "bold")
    .text("Huurverhoging in procenten");

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
    .attr("x", width - 550)
    .attr("y", height + 80)
    .attr("dx", ".71em")
    .text("Interactieve grafiek van de procentueele huurverhoging ieder jaar in Nederland.");
