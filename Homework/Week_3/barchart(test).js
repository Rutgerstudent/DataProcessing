// Rutger van Heijningen
// 10272224
// Data Processing, week 2
// barchart.js

// Barchart without external data

// Dataset
var dataset = [ 500, 200, 700, 600, 300, 400, 900, 800, 900 ];
var years =   [ 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999 ];

// Header, name, etc..
d3.select("body").append("h2").text("D3 Barchart");
d3.select("body").append("h4").text("Rutger van Heijningen, 10272224");

// Width and height
var margin = {top: 50, right: 50, bottom: 50, left:50};
var w = 800 - margin.right - margin.left;
var h = 450 - margin.top - margin.bottom;

// Other variables
var barPadding = 1;
var padding = 0;
var formatPercent = d3.format(".0%");

// Creating SVG element
var svg = d3.select("body")
            .append("svg")
            .attr("width", w + margin.right + margin.left)
            .attr("height", h + margin.top + margin.bottom)
            .append("g")
            .attr("transform","translate(" + margin.left + "," + margin.right + ")");

// Creating a scale
var scale = d3.scale.linear()
                    .domain([dataset[0], dataset[dataset.length - 1]])
                    .range([10, 50]);

// Creating tooltip
var tip = d3.tip()
  .attr("class", "d3-tip")
  .offset([-10, 0])
  .html(function(d) {
    return d;
  });

// Tooltip
svg.call(tip);

// Creating bars
svg.selectAll("bar")
   .data(dataset)
   .enter()
   .append("rect")
   .attr("class", "bar")
   .attr("x", function(d, i) {
    return i * (w / dataset.length);
    })
    .attr("y", function(d) {
     return h - scale(d * 4);
    })
   .attr("width", w / dataset.length - barPadding)
   .attr("height", function(d) {
    return scale(d * 4);
    })
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide);

// Creating labels
svg.selectAll("text")
   .data(dataset)
   .enter()
   .append("text")
   .text(function(d) {
        return d;
   })
   .attr("font-family", "sans-serif")
   .attr("font-size", "11px")
   .attr("fill", "black")
   .attr("text-anchor", "middle")
   .attr("x", function(d, i) {
        return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2;
    })
   .attr("y", function(d) {
        return h - scale(d * 4) + 14;
    });

// X & Y scale
var x_scale = d3.scale.ordinal()
    .domain(d3.range(years[0], years[years.length - 1]))
    .rangeBands([0, w]);

var y_scale = d3.scale.linear()
    .domain([])
    .range([h, 0]);

// Define X & Y axis
var xAxis = d3.svg.axis()
                  .scale(x_scale)
                  .orient("bottom")

var yAxis = d3.svg.axis()
                  .scale(y_scale)
                  .orient("left")

// Create X & Y axis
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis)
    .append("text")
    .attr("x", w - 25)
    .attr("y", 38)
    .attr("dx", ".71em")
    .style("text-anchor", "end")
    .text("Year");

svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Amount");

// Explanatory paragraph
d3.select("body").append("p").text("Interactive graph showing an amount each year.");
