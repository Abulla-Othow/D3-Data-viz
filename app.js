
// @TODO: YOUR CODE HERE!


//Pre -Data Manipulation Setup
//===================================

//Setup the chart parameters
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 50

  };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//Let Create Canvas for the graph

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


//Read csv data

d3.csv("assets/data/data.csv", function(error, healthcareData){
    if(error) throw error;
    healthcareData.forEach(function(d){
        d.smokes = +d.smokes;
        d.age = +d.age;
        d.poverty= +d.poverty;
        d.healthcare = +d.healthcare;
        d.obesity = + d.obesity;
    });
    console.log(healthcareData)


    //Define tooltip
    var toolTip =d3.tip()
            .attr("class", "toolTip")
            .offset([80,-60])
            .html(function(data){
                var state =data.state;
                var povertyRate = +data.poverty;
                var healthcare = +data.healthcare;
                return(state + "<br> Poverty Rate (%): " + povertyRate + "<br Health Rate (%): " + healthcare)
            });
        chartGroup.call(toolTip)


//Create xAxis scales

var xLinearScale = d3.scaleLinear()
       .domain([d3.min(healthcareData, d=>d["poverty"]-2),
        d3.max(healthcareData, d=>d["poverty"])]) 
        .range([0,width]);
console.log("x-axis data");
console.log(d3.min(healthcareData, d=>d["poverty"]));
console.log(d3.max(healthcareData, d=>d["poverty"]));
console.log("y-axis data");
console.log(d3.min(healthcareData, d=>d["healthcare"]));
console.log(d3.max(healthcareData, d=>d["healthcare"]));
console.log(d3.max(healthcareData, d=>d["obesity"]));
console.log(d3.min(healthcareData, d=>d["obesity"]));
//Create yAxis scales
var yLinearScale = d3.scaleLinear()
    .domain([d3.min(healthcareData, d=>d["healthcare"]-2),
   d3.max(healthcareData, d=>["healthcare"]) ])
   .range([height, 0]);

var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

// Append leftAxis (y axis)
chartGroup.append("g")
.call(leftAxis);
// Create dots/circles
var dots= chartGroup.selectAll("g.dot")
    .data(healthcareData)
    .enter()
    .append("g.");
dots.append("circle")
    .attr("cx", d=>xLinearScale(d["poverty"]))
    .attr("cy", d=>yLinearScale(d["healthcare"]))
    .attr("r", d=> d.obesity/2)
    .attr("fill", "steelblue")
    .attr("opacity", ".7");

dots.append("text").text(d=>d.abbr)
    .attr("x", d=> xLinearScale(d.poverty)-4)
    .attr("y", d => yLinearScale(d.healthcare)+2)
    .style("font-size", ".5em")
    .classed("fill-text", true);
console.log(d=>xLinearScale(d.poverty));
console.log(d=>yLinearScale(d.healthcare));
// Create group for 2 x-axis lables
var lablesgroup =chartGroup.append("g")
    .attr("transform", `translate(${width/2}, ${height + 18})`);

var healthcareDatatLabel = lablesgroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") 
    .classed("active", true)
    .text("Poverty vs. Healthcare");

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 -margin.left)
        .attr("x", 0 -(height/2))
        .attr("dy", "1em")
        .classed("axis-test", true)
        .text("Healthcare");
});



