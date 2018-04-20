// Rutger van Heijningen
// 10272224
// Data Processing, week 2
// Weather.js

// Reformatting and Loading the Data

// Arrays
var data_a = []
var data_b = []
var data_c
var data_raw = []
var date = []
var temp = []
var minTemp = 0
var maxTemp = 0

// Get element
var data_raw = document.getElementById('rawdata').innerHTML

// Split 1 string into seperate strings
data_raw = data_raw.split('\n')

// Process data
var i;
for (i = 0; i < data_raw.length; i++)
{
  // Split data
  data_a = data_raw[i].split(',')

  // Slice data
  data_b = data_a[0].slice(2,6) + "-" + data_a[0].slice(6,8) + "-" + data_a[0].slice(8,10)

  // Config date
  data_c = new Date(data_b)

  // Get milliseconds
  data_d = data_c.getTime()

  // Push data to date array
  date.push(data_d)

  // Push data to temp array
  temp.push(parseInt(data_a[1]))

  // min and max temp (Domain)
  if (parseInt(data_a[1]) < minTemp)
  {
    minTemp = parseInt(data_a[1])
  }
  if (parseInt(data_a[1]) > maxTemp)
  {
    maxTemp = parseInt(data_a[1])
  }
}

// Transforming the data to graph

// Create Canvas
var canvas = document.getElementById('myCanvas'); // in your HTML this element appears as <canvas id="myCanvas"></canvas>
var ctx = canvas.getContext('2d');

// y-trans & x-trans
var y_trans = createTransform([minTemp, maxTemp],[500, 50])
var x_trans = createTransform([date[0], date[365]],[50, 500])

// Start line
ctx.beginPath();
ctx.moveTo(x_trans(date[0]),y_trans(temp[0]))

// Plotting points (line)
for (i = 0; i < date.length; i++)
{
  x_point = x_trans(date[i])
  y_point = y_trans(temp[i])
  ctx.lineTo(x_point,y_point)
}

// Stop line
ctx.stroke();

// Formatting graph

// Important!:
// Canvas didn't work so it was very difficult to format the graph.
// Example in git. No other student had the same problem..

// x-as
ctx.beginPath();
ctx.moveTo(50,50);
ctx.lineTo(50,500);
ctx.stroke();

// Need to do this again otherwise it doesn't work
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

// x-as labels
ctx.font = "10px Georgia";
ctx.fillText("Temperatuur", 20, 20);
ctx.fillText("100", 20, 50);
ctx.fillText("75", 20, 100);
ctx.fillText("50", 20, 150);
ctx.fillText("25", 20, 200);
ctx.fillText("0", 20, 250);
ctx.fillText("-25", 20, 300);
ctx.fillText("-50", 20, 350);
ctx.fillText("-75", 20, 400);
ctx.fillText("-100", 20, 450);

// y-as
ctx.beginPath();
ctx.moveTo(50,500);
ctx.lineTo(500,500);
ctx.stroke();

// Need to do this again otherwise it doesn't work
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

// y-as labels
ctx.font = "10px Georgia";
ctx.fillText("Date", 600, 500);
ctx.fillText("January", 60, 500);
ctx.fillText("February", 100, 500);
ctx.fillText("March", 140, 500);
ctx.fillText("April", 180, 500);
ctx.fillText("May", 220, 500);
ctx.fillText("June", 260, 500);
ctx.fillText("July", 300, 500);
ctx.fillText("August", 340, 500);
ctx.fillText("September", 380, 500);
ctx.fillText("Oktober", 420, 500);
ctx.fillText("November", 460, 500);
ctx.fillText("December", 500, 500);

function createTransform(domain, range){
	// domain is a two-element array of the data bounds [domain_min, domain_max]
	// range is a two-element array of the screen bounds [range_min, range_max]
	// this gives you two equations to solve:
	// range_min = alpha * domain_min + beta
	// range_max = alpha * domain_max + beta
 		// a solution would be:

    var domain_min = domain[0]
    var domain_max = domain[1]
    var range_min = range[0]
    var range_max = range[1]

    // formulas to calculate the alpha and the beta
   	var alpha = (range_max - range_min) / (domain_max - domain_min)
    var beta = range_max - alpha * domain_max

    // returns the function for the linear transformation (y= a * x + b)
    return function(x){
      return alpha * x + beta;
    }
}

// Nog niet af, vanwege het feit dat ik heel lang met het werkend krijgen
// van canvas bezig ben geweest..

// XMLHttpRequest
// var file = "data.json"
// var importfile = new XMLHttpRequest()
// importfile.onreadystatechange = function()
// {
//   if (importfile.readystate === 4)
//   {
//     if (importfile.status === 200)
//     {
//       dataJSON(importfile.responseText)
//     }
//   }
// }
// importfile.open("GET", data.txt, true)
// importfile.send()
