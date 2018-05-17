// Rutger van Heijningen
// 10272224
// Data Processing, week 5
// linkedviews.js
// Linked Views

// Load function when website loads
// window.onload = function(){

var unemployment = d3.map();

d3.queue()
    .defer(d3.json, "https://d3js.org/us-10m.v1.json")
    .defer(d3.tsv, "unemployment.tsv", function(d) { unemployment.set(d.id, +d.rate); })
    .await(map);

function map(error, us) {
  if (error) throw error;

  var svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height");

  var path = d3.geoPath();

  var x = d3.scaleLinear()
      .domain([1, 10])
      .rangeRound([600, 860]);

  var color = d3.scaleThreshold()
      .domain(d3.range(2, 10))
      .range(d3.schemeBlues[9]);

  var g = svg.append("g")
      .attr("class", "key")
      .attr("transform", "translate(0,40)");

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

  g.append("text")
      .attr("class", "caption")
      .attr("x", x.range()[0])
      .attr("y", -6)
      .attr("fill", "#000")
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text("Unemployment rate");

  g.call(d3.axisBottom(x)
      .tickSize(13)
      .tickFormat(function(x, i) { return i ? x : x + "%"; })
      .tickValues(color.domain()))
    .select(".domain")
      .remove();

  svg.append("g")
      .attr("class", "counties")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
    .on("click", function(){
               self.piechart(d3.event.srcElement.__data__.id)
             })
      .attr("fill", function(d) { return color(d.rate = unemployment.get(d.id)); })
      .attr("d", path)
    .append("title")
      .text(function(d) { return d.id + ", " + d.rate + "%"; });

  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("class", "states")
      .attr("d", path);

}

function piechart(county){
  console.log(county)

var width = 275
var height = 600
var radius = width / 2
var labels = ["Adults with less than a high school diploma",
              "Adults with a high school diploma only",
              "Adults completing some college or associate's degree",
              "Adults with a bachelor's degree or higher"]

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// Title
svg.append("g")
   .attr("class", "title")
   .append("text")
   .attr("x", 0)
   .attr("y", 30)
   .attr("dx", ".71em")
   .attr("font-size", "20px")
   .attr("font-weight", "bold")
   .text("Unemployment vs. Education");

// Name & studentnumber
svg.append("g")
   .attr("class", "name")
   .append("text")
   .attr("x", 20)
   .attr("y", 50)
   .attr("dx", ".71em")
   .text("Rutger van Heijningen, 10272224");

d3.csv("education.csv", function(error, data) {
  if (error) throw error;

var edu = []
var less = +data.filter(function(d){return d.id == county})[0].less
var school = +data.filter(function(d){return d.id == county})[0].school
var college = +data.filter(function(d){return d.id == county})[0].college
var bachelor = +data.filter(function(d){return d.id == county})[0].bachelor
var name = data.filter(function(d){return d.id == county})[0].name

edu.push(less,school,college,bachelor)
console.log(labels)
console.log(edu)

var color = d3.scaleOrdinal(d3.schemeCategory20c);

var pie = d3.pie();

var arc = d3.arc()
	.outerRadius(radius)
	.innerRadius(radius/2);

var container = svg.append("g")
	.attr('transform',"translate(" + width / 2 + "," + (height - width / 2) + ")");

var stencil = pie(edu);

console.log(stencil)

var g = container.selectAll("g")
	.data(stencil)
	.enter()
	.append('g');

g.append("path")
  .attr("d", arc)
  .style("fill", function(d,i){
  	return color(d.value);
  });

g.append("text")
      .attr("transform", function(d) {
      d.innerRadius = 0;
      d.outerRadius = radius;
      return "translate(" + arc.centroid(d) + ")";
      })
      .attr("text-anchor", "middle")
      .text(function(d, i) { return d.value + "%" });

svg.append("text")
        .attr("x", (width / 2))
        .attr("y", (240))
        .attr("text-anchor", "middle")
        .style("font-size", "17px")
        .text(function(d) {return name});

var legendG = svg.selectAll(".legend")
  .data(pie(stencil))
  .enter().append("g")
  .attr("transform", function(d,i){
    return "translate(" + (8) + "," + (i * 15 + 250) + ")";})
  .attr("class", "legend");

var color = d3.scaleOrdinal(d3.schemeCategory20c);

legendG.append("rect")
  .attr("width", 10)
  .attr("height", 10)
  .attr("fill", function(d,i) {
    return color(labels[i]);
  });

legendG.append("text")
  .text(function(d, i){
    return labels[i];
  })
  .style("font-size", 12)
  .attr("y", 10)
  .attr("x", 11);
})

}
