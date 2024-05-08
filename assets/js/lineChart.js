(function() {
    var margin = { top: 30, right: 230, bottom: 50, left: 50 },
        svgWidth = 520,
        svgHeight = 230,
        width = svgWidth - margin.left - margin.right,
        height = svgHeight - margin.top - margin.bottom;

    var parseDate = d3.timeParse("%Y-%m-%d");

    d3.csv("https://gist.githubusercontent.com/riyamathur1/d0d8b5a60ba91d7cba36c887f7b838af/raw/6ad0cd417fc169df792ccc0955344c8a3f0ce2ec/2024-03-26-washington-post-police-shootings-export.csv").then(function(data) {
        data.forEach(function(d) {
            d.parsedDate = parseDate(d.date);
            d.month = d.parsedDate.getMonth();
            d.year = d.parsedDate.getFullYear();
        });

        var yearMonthCounts = d3.rollups(data, v => v.length, d => d.year, d => d.month);
        var maxY = d3.max(yearMonthCounts, year => d3.max(year[1], month => month[1]));

        var x = d3.scaleTime()
            .domain([new Date(2015, 0, 1), new Date(2015, 11, 31)])
            .range([0, width]);

        var y = d3.scaleLinear()
            .domain([0, maxY])
            .range([height, 0]);

        var line = d3.line()
            .x(d => x(new Date(2015, d[0], 1)))
            .y(d => y(d[1]));

        var svg = d3.select("#line").selectAll("svg")
            .data(yearMonthCounts)
            .join("svg")
                .attr("class", "svg-containerx")
                .attr("width", svgWidth)
                .attr("height", svgHeight)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.each(function(d) {
            var year = d[0];
            var countsByMonth = d[1];
            var svg = d3.select(this);

            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).ticks(d3.timeMonth).tickFormat(d3.timeFormat("%b")).tickSizeOuter(0));

            svg.append("text")
                .attr("class", "axis-labelx")
                .attr("x", width / 2)
                .attr("y", height + 40)
                .style("text-anchor", "middle")
                .text("Month");

            svg.append("g")
                .call(d3.axisLeft(y).ticks(4));

            svg.append("text")
                .attr("class", "axis-labelx")
                .attr("transform", "rotate(-90)")
                .attr("x", -height / 2)
                .attr("y", -50)
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Shootings");

            svg.append("path")
                .datum(countsByMonth)
                .attr("class", "linex")
                .attr("d", line);

            svg.selectAll(".dotx")
                .data(countsByMonth)
                .enter().append("circle")
                    .attr("class", "dotx")
                    .attr("r", 5)
                    .attr("cx", d => x(new Date(2015, d[0], 1)))
                    .attr("cy", d => y(d[1]))
                    .each(function(d) {
                        tippy(this, {
                            content: `${d[1]} shootings`,
                            arrow: true,
                            delay: [100, 0],
                            placement: 'top'
                            // allowHTML: true,
                        });
                    });

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
