(function() {
    // Added the data manually
    var raceData = [
        { race: 'Black', value: 55.65, total: 2226, population: 41570000 },
        { race: 'Hispanic', value: 24.77, total: 1536, population: 64990000 },
        { race: 'White', value: 22.19, total: 4261, population: 219500000 },
        { race: 'Other & Mixed', value: 0.76, total: 29, population: 33800000 }
    ];

    // SVG dimensions
    var chartWidth = 1000;
    var height = 500;
    var margin = { top: 30, right: 210, bottom: 60, left: 130 };

    // Creating SVG container
    var svg = d3.select('#bar1')
        .append('svg')
        .attr('width', chartWidth)
        .attr('height', height);

    // Creating each scale
    var xScale = d3.scaleLinear()
        .domain([0, 60])
        .range([0, chartWidth - margin.left - margin.right]);

    var yScale = d3.scaleBand()
        .domain(raceData.map(d => d.race))
        .range([height - margin.bottom, margin.top])
        .padding(0.1);

    // Add bars
    var bars = svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .selectAll('rect')
        .data(raceData)
        .enter()
        .append('rect')
        .attr('y', d => yScale(d.race))
        .attr('width', d => xScale(d.value))
        .attr('height', yScale.bandwidth())
        .attr('fill', 'steelblue')  // Blue bars
        .attr('class', 'bar');

    // Using tippy.js tooltips for bars
    bars.each(function(d) {
        tippy(this, {
            content: `${d.value.toFixed(2)} killings per million per year`,
            allowHTML: true,
            arrow: true,
            placement: 'top'    // Tooltip on top of each bar
        });
    });

    // Adding x-axis
    svg.append('g')
        .attr('transform', `translate(${margin.left}, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("font-size", "18px"); 

    // Adding y-axis
    svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale))
        .selectAll("text")
        .style("font-size", "18px"); 

    // X-axis label
    svg.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${(height - 5)})`)
        .style("text-anchor", "middle")
        .style("font-size", "18px") 
        .style("font-weight", "bold")
        .text("Killings per million per year");

    // Y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 20)
        .attr("x", -(height / 2))
        .style("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .text("Race");
})();
