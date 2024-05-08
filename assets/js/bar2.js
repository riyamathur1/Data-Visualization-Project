document.addEventListener("DOMContentLoaded", function() {
    var margin = { top: 30, right: 30, bottom: 70, left: 80 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var svg = d3.select("#bar2")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var ageData = [
        { age_range: "0-18", count: 303 },
        { age_range: "19-30", count: 2781 },
        { age_range: "31-45", count: 3738 },
        { age_range: "46-60", count: 1747 },
        { age_range: "61-75", count: 446 },
        { age_range: "76-100", count: 68 }
    ];

    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1)
        .domain(ageData.map(function(d) { return d.age_range; }));

    var y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(ageData, function(d) { return d.count; })]);

    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("font-size", "16px")


    svg.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(10))
        .selectAll("text")
        .style("font-size", "16px")


    // Add bars to the chart
    var bars = svg.selectAll(".bar")
        .data(ageData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.age_range); })
        .attr("y", function(d) { return y(d.count); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.count); });

    // Initialize Tippy.js tooltips
    bars.each(function(d) {
        tippy(this, {
            content: `Ages ${d.age_range}: ${d.count} victims`,
            arrow: true,
            placement: 'top',
            theme: 'light'
        });
    });

    // X-axis label
    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .text("Age Range");

    // Y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left - 5)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .text("Number of Victims");
});
