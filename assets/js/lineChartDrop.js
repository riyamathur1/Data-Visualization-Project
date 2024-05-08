(function() {
  var margin = {top: 30, right: 30, bottom: 70, left: 70},
      width = 960 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

  var svg = d3.select("#lineChartDrop")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleBand()
    .domain(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"])
    .range([0, width])
    .padding(0.1);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(10,0)")
      .style("text-anchor", "end")
      .style("font-size", "16px");
  svg.append("text")
    .attr("transform",
          "translate(" + (width/2) + " ," +
                          (height + margin.top + 20) + ")")
    .style("text-anchor", "middle")
    .style("font-weight", "bold")
    .text("Month");

  var y = d3.scaleLinear()
    .domain([0, 150])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y))
    .style("font-size", "16px");
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-weight", "bold")
    .text("Number of Shootings");
  var valueLine = d3.line()
    .x(function(d) { return x(d.month) + x.bandwidth() / 2; })
    .y(function(d) { return y(d.value); });

  var allGroup = ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"];
  var data = {
    "2015": [76, 77, 92, 84, 72, 65, 104, 94, 82, 84, 77, 88],
    "2016": [81, 86, 92, 73, 74, 91, 72, 82, 77, 78, 77, 75],
    "2017": [92, 100, 78, 67, 73, 84, 94, 82, 70, 84, 83, 77],
    "2018": [98, 79, 108, 96, 83, 81, 88, 76, 59, 78, 76, 70],
    "2019": [93, 70, 88, 71, 74, 86, 80, 86, 78, 89, 76, 106],
    "2020": [87, 78, 94, 80, 110, 77, 68, 87, 59, 101, 90, 89],
    "2021": [80, 96, 88, 88, 83, 110, 72, 97, 81, 94, 73, 88],
    "2022": [76, 91, 99, 92, 91, 98, 97, 81, 98, 86, 93, 93],
    "2023": [104, 85, 89, 93, 97, 93, 94, 117, 92, 91, 95, 112],
    "2024": [87, 75, 58]
  };

  update(allGroup[0]);

  function update(selectedGroup) {
      var dataFilter = data[selectedGroup].map(function(d, i){
          return {month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i], value: d};
      });

      var lineGraph = svg.selectAll(".line")
          .data([dataFilter]);

      lineGraph.enter()
          .append("path")
          .merge(lineGraph)
          .attr("class", "line")
          .transition()
          .duration(1000)
          .attr("d", valueLine)
          .attr("stroke", "steelblue")
          .attr("stroke-width", 4)
          .attr("fill", "none");

      var dots = svg.selectAll(".dot")
          .data(dataFilter);

      dots.enter()
          .append("circle")
          .attr("class", "dot")
          .merge(dots)
          .attr("cx", function(d) { return x(d.month) + x.bandwidth() / 2; })
          .attr("cy", function(d) { return y(d.value); })
          .attr("r", 5)
          .on('mouseenter', function(event, d) {
              tippy(event.target, {
                  content: `${d.value} shootings in ${d.month}`,
                  allowHTML: true,
                  arrow: true,
                  placement: 'top'
              }).show();
          });

      dots.exit().remove();
      lineGraph.exit().remove();
  }

  d3.select("#lineChartDrop").append("select")
    .selectAll("option")
      .data(allGroup)
    .enter()
    .append("option")
      .text(function(d){ return d; })
      .attr("value", function(d){ return d; });

  d3.select("select").on("change", function(event) {
      var selectedOption = d3.select(this).property("value");
      update(selectedOption);
  });
})();
