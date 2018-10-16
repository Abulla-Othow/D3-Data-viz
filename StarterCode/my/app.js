
//set up the chart
var svgWidth = 1000;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
// Then Create the SVG wrapper and append 
// the svg group.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chart = svg.append("g");
//read the csv file and put everythin inside.

d3.csv("data.csv", function(err, response) {
  if (err) throw err;

  response.forEach(function(data) {
    data.poverty = +data.poverty;
    data.hasHealthcare = +data.hasHealthcare;
    data.smoker = +data.smoker;
    data.obese = +data.obese;
    data.hh_income_med = +data.hh_income_med;
    data.age_med= +data.age_med;
   
  });
//create a scales
  var yLinearScale = d3.scaleLinear().range([height, 0]);

  var xLinearScale = d3.scaleLinear().range([0, width]);

 // create axises
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // define the variables that will store the min and max values in the file
  var xMin;
  var xMax;
  var yMax;
  var yMin;

  //define the function the find the min ansd max values in the data
  function findMinAndMax_X(dataColumnX){
    xMin = d3.min(response, function(data) {
      return +data[dataColumnX] * 0.8;
    });

    xMax = d3.max(response, function(data) {
      return +data[dataColumnX] * 1.1;
    });

  }

  function findMinAndMax_Y(dataColumnY){
    yMax = d3.max(response, function(data) {
      return +data[dataColumnY] * 1.1;
    });
  }

  
  // Tdefine the current axis lebels
  var currentAxisLabelX = "poverty";
  var currentAxisLabelY = "hasHealthcare";

  // Call findMinAndMax() 
  findMinAndMax_X(currentAxisLabelX);
  findMinAndMax_Y(currentAxisLabelY);
//set the domain of axis
  xLinearScale.domain([xMin, xMax]);
  yLinearScale.domain([0, yMax]);
   // Initialize the tooltips
  var toolTip = d3
    .tip()
    .attr("class", "tooltip")
    //define the possition
    .offset([80, -60])
    //combine the js and .html bt using html() method
    
    .html(function(data) {
      var state = data.State;
      var yInfo = +data[currentAxisLabelY];
      var xInfo = +data[currentAxisLabelX];
      var descStringX;
      var descStringY;
      //make the tooltip text.

      if (currentAxisLabelX === "poverty") {
        descStringX = "Poverty: ";
      }
      else if (currentAxisLabelX === "age_med"){
        descStringX = "Age: ";
      }
      else if (currentAxisLabelX === "hh_income_med"){
        descStringX = "Income:"
      }

      if (currentAxisLabelY === "hasHealthcare") {
        descStringY = "Lacks Healthcare: ";
      }
      else if (currentAxisLabelY === "smoker"){
        descStringY = "Smoker: ";
      }
      else if (currentAxisLabelY === "obese"){
        descStringY = "Obese: "
      }

      return "<strong>"+
        state +
        "</strong><br>" +
        descStringX +
        xInfo +
        "<br>" +
        descStringY +
        yInfo;
    });
//Call tooltip
  
  chart.call(toolTip);
//append the circle 
  chart
    .selectAll("circle")
    .data(response)
    .enter()
    .append("circle")
    .attr("cx", function(data, index) {
      return xLinearScale(+data[currentAxisLabelX]);
    })
    .attr("cy", function(data, index) {
      return yLinearScale(+data[currentAxisLabelY]);
    })
    .attr("r", "12")
    .attr("fill", "skyblue")
    // Display the tooltip on click
    .on("click", function(data) {
      toolTip.show(data);
    })
    //hide the tooltip on mouseout
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

    //add state Abbr on the circle
    chart.selectAll("circleText")
    .data(response)
    .enter()
    .append("text")
    .attr("dx", function (data, index) {
      return xLinearScale(+data[currentAxisLabelX]) - 11.5
    })
    .attr("dy", function (data) {
      return yLinearScale(+data[currentAxisLabelY]) + 4
    })
    .text(function (data, index) {
      return data.abbreviation;
    })
    .style("fill", "white");
  //svg for the axis
  chart
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    //transision effect
    .attr("class", "x-axis")
    .call(bottomAxis);

  //group for y-axis
  chart.append("g").call(leftAxis);
//y-axis lebal
  chart
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 15)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .attr("class", "axis-text active")
    .attr("data-axis-name", "hasHealthcare")
    .text("Lacks Healthcare(%)");
  chart
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 35)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .attr("class", "axis-text inactive")
    .attr("data-axis-name", "smoker")
    .text("Smokes(%)");
  chart
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 60)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .attr("class", "axis-text inactive")
    .attr("data-axis-name", "obese")
    .text("Obese(%)");

  //x-axis lebel
  chart
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 10) + ")"
    )
   // active lebales by default
    .attr("class", "axis-text active")
    .attr("data-axis-name", "poverty")
    .text("Poverty(%)");

  chart
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 25) + ")"
    )
   //axis lebles incative
    .attr("class", "axis-text inactive")
    .attr("data-axis-name", "age_med")
    .text("Age (Median)");
  
    chart
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height + margin.top + 40) + ")"
    )
    // labels inactive by defaualt
    .attr("class", "axis-text inactive")
    .attr("data-axis-name", "hh_income_med")
    .text("Household Income(Median");

  // change the axises status on click
  function labelChange(clickedAxis) {
    d3
      .selectAll(".axis-text")
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);
    clickedAxis.classed("inactive", false).classed("active", true);
  }

  d3.selectAll(".axis-text").on("click", function() {
    
    var clickedSelection = d3.select(this);
    
    var isClickedSelectionInactive = clickedSelection.classed("inactive");
    
    var clickedAxis = clickedSelection.attr("data-axis-name");
    console.log("current axis: ", clickedAxis);

    if (isClickedSelectionInactive) {
     
      if (clickedAxis==="smoker"||clickedAxis==="obese"||clickedAxis==="hasHealthcare"){
        currentAxisLabelY = clickedAxis;
        //domin for the axises
        findMinAndMax_Y(currentAxisLabelY);
        
        yLinearScale.domain([0, yMax]);

       //transission effect on the axis
        svg
        .select(".y-axis")
        .transition()
        
        .duration(1800)
        .call(leftAxis);

        //circle on transition effect
        d3.selectAll("circle").each(function() {
          d3
            .select(this)
            .transition()
            
            .attr("cy", function(data) {
              return yLinearScale(+data[currentAxisLabelY]);
            })
            .duration(1800);
        });
        //change the status
        labelChange(clickedSelection);
      }
      else {
        currentAxisLabelX = clickedAxis;
        
        findMinAndMax_X(currentAxisLabelX);
        
        xLinearScale.domain([xMin, xMax]);
        
        svg
        .select(".x-axis")
        .transition()
       
        .duration(1800)
        .call(bottomAxis);

        d3.selectAll("circle").each(function() {
          d3
            .select(this)
            .transition()
            
            .attr("cx", function(data) {
              return xLinearScale(+data[currentAxisLabelX]);
            })
            .duration(1800);
        });
        
        labelChange(clickedSelection);
      }
    }
  });
});
