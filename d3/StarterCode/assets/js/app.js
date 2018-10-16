
//Setup the chart parameters

var svgWidth = 960;
var svgHeight = 500;
var margin = {top: 20, right: 40, bottom: 60, left: 100};
var width = svgWidth - margin.left -margin.right;
var height = svgHeight-margin.top -margin.bottom;
// create svg
var svg = d3
  .select('#scatter')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
var chart = svg.append('g');

// append div to body
d3.select("#scatter").append("div").attr("class", "tooltip").style("opacity", 0);

//Read the data.csv

d3.csv("assets/data/data.csv", function(err, healthData) {
    if(err) throw err;

    healthData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.phys_act = +data.phys_act;
    });

   
    // });

     var yLinearScale = d3.scaleLinear().range([height, 0]);
     var xLinearScale = d3.scaleLinear().range([0, width]);
 
     //create axises
     var bottomAxis = d3.axisBottom(xLinearScale);
     var leftAxis = d3.axisLeft(yLinearScale);
 
 //Scale the domain
     var xMin;
     var xMax;
     var yMin;
     var yMax;
 
     xMin = d3.min(healthData, function(data) {
         return +data.poverty * 0.95;
     });
 
 
     xMax = d3.max(healthData, function(data) {
         return +data.poverty * 1.05;
     });
 
     yMin = d3.min(healthData, function(data) {
         return +data.phys_act * 0.98;
     });
 
     yMax = d3.max(healthData, function(data) {
         return +data.phys_act *1.02;
     });
 
 
     xLinearScale.domain([xMin, xMax]);
     yLinearScale.domain([yMin, yMax]);
 
     //Then initialize the tooltips
     var toolTip = d3
         .tip()
         .attr("class", "tooltip")
         .offset([80, -60])
         .html(function(data) {
             var stateName = data.state;
             var pov = +data.poverty;
             var physAct = +data.phys_act;
             return (
                 stateName + '<br> Poverty: ' + pov + '% <br> Physically Active: ' + physAct +'%'
             );
         });
     //create tooltip
 
     scatter.call(toolTip);
 
     scatter.selectAll("circle")
         .data(healthData)
         .enter()
         .append("circle")
         .attr("cx", function(data, index) {
             return xLinearScale(data.poverty)
         })
         .attr("cy", function(data, index) {
             return yLinearScale(data.phys_act)
         })
         .attr("r", "15")
         .attr("fill", "lightblue")
         //display tooltip by clicking
         on("mouseenter", function(data) {
             toolTip.show(data);
         })
         // hide tooltip on mouseout
         .on("mouseout", function(data, index) {
             toolTip.hide(data);
         });
 
         //Then append the levels to appropraite places
         scatter.append("text")
             .style("text-anchor", "middle")
             .style("font-size", "12px")
             .selectAll("tspan")
             .data(healthData)
             .enter()
             .append("tspan")
                 .attr("x", function(data) {
                     return xLinearScale(data.poverty - 0);
                 })
                 .attr("y", function(data) {
                     return yLinearScale(data.phys_act - 0.2);
                 })
                 .text(function(data) {
                     return data.abbr
                 });
         // append svg group
         scatter.append("g")
             .attr('transform', `translate(0, ${height})`)
             .call(bottomAxis);
         scatter.append("g")
             .call(leftAxis);
 
    //append y-axis lable
     scatter.append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", 0-margin.left + 40)
         .attr("x", 0 - height/2)
         .attr("dy","1em")
         .attr("class", "axis-text")
         .text("Physically Active (%)")
     //append x-axis lable
 
     scatter
         .append("text")
         .attr(
             "transform",
             "translate(" + width / 2 + " ," + (height + margin.top + 30) + ")"
         )
         .attr("class", "axis-text")
         .text("In Poverty (%)");


      });
     