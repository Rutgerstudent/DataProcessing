// Rutger van Heijningen
// 10272224
// Data Processing, week 4
// scatter.js

// Interactive Scatterplot

var first_api = "https://stats.oecd.org/SDMX-JSON/data/ANHRS/AUS+FRA+DEU+NLD+ESP.TE.A/all?startTime=2013&endTime=2016&dimensionAtObservation=allDimensions"
var second_api = "https://stats.oecd.org/SDMX-JSON/data/PDB_LV/AUS+FRA+DEU+NLD+ESP.T_GDPPOP.CPC/all?startTime=2013&endTime=2016&dimensionAtObservation=allDimensions"
var hours = []
var gdp = []

window.onload = function(){
  d3.queue()
    .defer(d3.request, first_api)
    .defer(d3.request, second_api)
    .awaitAll(doFunction);
  }

function doFunction(error, response) {
  if (error) throw error;
  
  var first_raw = JSON.parse(response[0].responseText)
  var second_raw = JSON.parse(response[1].responseText)

  console.log(first_raw)
  console.log(second_raw);

  for (var i = 0; i < 5; i++){

    var hours_worked = []
    var gdp_head = []

    for (var j = 0; j < 4; j++){
    hours_worked.push(first_raw.dataSets[0].observations[i + ":" + j + ":0:0"][0]);
    gdp_head.push(second_raw.dataSets[0].observations[i + ":0:0:" + j][0]);

    // console.log(hours_worked)
    // console.log(gdp_head);
  }
  hours.push(hours_worked)
  gdp.push(gdp_head)
};

  console.log(hours[0][1])
  console.log(hours)
  console.log(gdp);

  // Use response
};

// // Creating tooltip
// var tip = d3.tip()
//   .attr('class', 'd3-tip')
//   .offset([-10, 0])
//   .html(function(d) {
//     return d.Huurverhoging + "%";
//   });
//
// // Tooltip
// svg.call(tip);
//
// var margin = {top: 20, right: 20, bottom: 30, left: 40},
//     width = 960 - margin.left - margin.right,
//     height = 500 - margin.top - margin.bottom;
//
// var x = d3.scale.linear()
//     .range([0, width]);
//
// var y = d3.scale.linear()
//     .range([height, 0]);
//
// var color = d3.scale.category10();
//
// var xAxis = d3.svg.axis()
//     .scale(x)
//     .orient("bottom");
//
// var yAxis = d3.svg.axis()
//     .scale(y)
//     .orient("left");
//
// var svg = d3.select("body").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
// d3.tsv("data.tsv", function(error, data) {
//   if (error) throw error;
//
//   data.forEach(function(d) {
//     d.sepalLength = +d.sepalLength;
//     d.sepalWidth = +d.sepalWidth;
//   });
//
//   x.domain(d3.extent(data, function(d) { return d.sepalWidth; })).nice();
//   y.domain(d3.extent(data, function(d) { return d.sepalLength; })).nice();
//
//   svg.append("g")
//       .attr("class", "x axis")
//       .attr("transform", "translate(0," + height + ")")
//       .call(xAxis)
//     .append("text")
//       .attr("class", "label")
//       .attr("x", width)
//       .attr("y", -6)
//       .style("text-anchor", "end")
//       .text("Sepal Width (cm)");
//
//   svg.append("g")
//       .attr("class", "y axis")
//       .call(yAxis)
//     .append("text")
//       .attr("class", "label")
//       .attr("transform", "rotate(-90)")
//       .attr("y", 6)
//       .attr("dy", ".71em")
//       .style("text-anchor", "end")
//       .text("Sepal Length (cm)")
//
//   svg.selectAll(".dot")
//       .data(data)
//     .enter().append("circle")
//       .attr("class", "dot")
//       .attr("r", 3.5)
//       .attr("cx", function(d) { return x(d.sepalWidth); })
//       .attr("cy", function(d) { return y(d.sepalLength); })
//       .style("fill", function(d) { return color(d.species); });
//       // .on('mouseover', tip.show)
//       // .on('mouseout', tip.hide);
//
//   var legend = svg.selectAll(".legend")
//       .data(color.domain())
//     .enter().append("g")
//       .attr("class", "legend")
//       .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
//
//   legend.append("rect")
//       .attr("x", width - 18)
//       .attr("width", 18)
//       .attr("height", 18)
//       .style("fill", color);
//
//   legend.append("text")
//       .attr("x", width - 24)
//       .attr("y", 9)
//       .attr("dy", ".35em")
//       .style("text-anchor", "end")
//       .text(function(d) { return d; });
// });
//
// // Title
// svg.append("g")
//     .attr("class", "title")
//     .append("text")
//     .attr("x", 200)
//     .attr("y", -80)
//     .attr("dx", ".71em")
//     .attr("font-size", "20px")
//     .attr("font-weight", "bold")
//     .text("Huurverhoging in procenten");
//
// // Name & studentnumber
// svg.append("g")
//     .attr("class", "name")
//     .append("text")
//     .attr("x", 215)
//     .attr("y", -50)
//     .attr("dx", ".71em")
//     .text("Rutger van Heijningen, 10272224");
//
// // Explanatory paragraph
// svg.append("g")
//     .attr("class", "x axis")
//     .append("text")
//     .attr("x", width - 550)
//     .attr("y", height + 80)
//     .attr("dx", ".71em")
//     .text("Interactieve grafiek van de procentueele huurverhoging ieder jaar in Nederland.");
