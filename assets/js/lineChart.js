(function() {
    // Dimensions of svg
    var margin = { top: 30, right: 230, bottom: 50, left: 50 },
        svgWidth = 520,
        svgHeight = 230,
        width = svgWidth - margin.left - margin.right,
        height = svgHeight - margin.top - margin.bottom;
    
    // Parsing the date format in the CSV 
    var parseDate = d3.timeParse("%Y-%m-%d");

    // Loading csv
    d3.csv("https://gist.githubusercontent.com/riyamathur1/d0d8b5a60ba91d7cba36c887f7b838af/raw/6ad0cd417fc169df792ccc0955344c8a3f0ce2ec/2024-03-26-washington-post-police-shootings-export.csv").then(function(data) {
        // Process each data entry
        data.forEach(function(d) {
            d.parsedDate = parseDate(d.date);   // Parse data
            d.month = d.parsedDate.getMonth();  // Parse month
            d.year = d.parsedDate.getFullYear();    // Extract year
        });

        // Grouping data by year and month, and count the occurrences
        var yearMonthCounts = d3.rollups(data, v => v.length, d => d.year, d => d.month);
        var maxY = d3.max(yearMonthCounts, year => d3.max(year[1], month => month[1]));

        // Create scales for the x and y axes
        var x = d3.scaleTime()
            .domain([new Date(2015, 0, 1), new Date(2015, 11, 31)]) // X axis domain begins at 2015
            .range([0, width]);

        var y = d3.scaleLinear()
            .domain([0, maxY])  // Y axis is set on max value
            .range([height, 0]);

        // Define the line 
        var line = d3.line()
            .x(d => x(new Date(2015, d[0], 1)))
            .y(d => y(d[1]));

        // Binding data to svg container
        var svg = d3.select("#line").selectAll("svg")
            .data(yearMonthCounts)
            .join("svg")
                .attr("class", "svg-containerx")
                .attr("width", svgWidth)
                .attr("height", svgHeight)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Creating the line chart for each year
        svg.each(function(d) {
            var year = d[0];
            var countsByMonth = d[1];
            var svg = d3.select(this);

            // Add the x-axis to the SVG
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).ticks(d3.timeMonth).tickFormat(d3.timeFormat("%b")).tickSizeOuter(0));

            // X axis label
            svg.append("text")
                .attr("class", "axis-labelx")
                .attr("x", width / 2)
                .attr("y", height + 40)
                .style("text-anchor", "middle")
                .text("Month");

            // Y axis 
            svg.append("g")
                .call(d3.axisLeft(y).ticks(4));

            // Y axis label
            svg.append("text")
                .attr("class", "axis-labelx")
                .attr("transform", "rotate(-90)")
                .attr("x", -height / 2)
                .attr("y", -50)
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Shootings");

            // Appending line path
            svg.append("path")
                .datum(countsByMonth)
                .attr("class", "linex")
                .attr("d", line);

            // Adding dots to line chart
            svg.selectAll(".dotx")
                .data(countsByMonth)
                .enter().append("circle")
                    .attr("class", "dotx")
                    .attr("r", 5)
                    .attr("cx", d => x(new Date(2015, d[0], 1)))
                    .attr("cy", d => y(d[1]))
                    .each(function(d) {
                        // Adding tooltips to the data points using tippy.js
                        tippy(this, {
                            content: `${d[1]} shootings`,
                            arrow: true,
                            delay: [100, 0],
                            placement: 'top'
                        });
                    });
            // SVG title
            svg.append("text")
                .attr("class", "titlex")
                .attr("x", width / 2)
                .attr("y", -10)
                .text(year);
        });

    }).catch(function(error) {
        console.error(error);
    });
})();
