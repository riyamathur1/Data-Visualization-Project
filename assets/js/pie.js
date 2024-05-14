        // Dimensions of each pie chart
        var width = 250;
        var height = 250;
        var radius = Math.min(width, height) / 2;

        // Func to draw each pie chart given the data and element ID
        function drawPieChart(data, elementId) {
            // Select the container element and append the SVG element
            var svg = d3.select(elementId)
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", `translate(${width / 2}, ${height / 2})`);

            // Pie generator
            var pie = d3.pie().value(d => d.value);
            // Arc generator for pie slices
            var path = d3.arc().outerRadius(radius).innerRadius(0);
            // Arc generator for the labels
            var label = d3.arc().outerRadius(radius).innerRadius(radius - 80);

            // Append pie slices to each arc
            var arcs = svg.selectAll(".arc")
                .data(pie(data))
                .enter().append("g")
                .attr("class", "arc");

            arcs.append("path")
                .attr("d", path)
                .attr("fill", (d, i) => ['steelblue', 'darkblue'][i % 2]);  // Colors assigned to slices
                
            // Pie chart labels
            arcs.append("text")     
                .attr("transform", d => `translate(${label.centroid(d)})`)
                .attr("dy", "0.35em")
                .text(d => `${d.data.label}: ${d.data.value}`)
                .style("text-anchor", "middle")
                .style("font-size", "14px")
                .style("fill", "white");

             // Add tooltips to each pie slice using tippy.js
            arcs.selectAll("path")
                .attr("class", "pie")
                .each(function(d) {
                    tippy(this, {
                        content: `${d.data.label}: ${d.data.value}`,
                        placement: 'right',
                        arrow: true
                    });
                });
        }

        // Calling func to draw each pie chart
        drawPieChart([
            { label: "Male", value: 9027 },
            { label: "Female", value: 416 }
        ], "#genderChart");

        drawPieChart([
            { label: "Armed", value: 8936 },
            { label: "Unarmed", value: 537 }
        ], "#armedChart");

        drawPieChart([
            { label: "No signs", value: 7583 },
            { label: "Signs", value: 1890 }
        ], "#mentalIllnessChart");

