
        var width = 250;
        var height = 250;
        var radius = Math.min(width, height) / 2;

        function drawPieChart(data, elementId) {
            var svg = d3.select(elementId)
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", `translate(${width / 2}, ${height / 2})`);

            var pie = d3.pie().value(d => d.value);
            var path = d3.arc().outerRadius(radius).innerRadius(0);
            var label = d3.arc().outerRadius(radius).innerRadius(radius - 80);

            var arcs = svg.selectAll(".arc")
                .data(pie(data))
                .enter().append("g")
                .attr("class", "arc");

            arcs.append("path")
                .attr("d", path)
                .attr("fill", (d, i) => ['steelblue', 'darkblue'][i % 2]);
                

            arcs.append("text")
                
                .attr("transform", d => `translate(${label.centroid(d)})`)
                .attr("dy", "0.35em")
                .text(d => `${d.data.label}: ${d.data.value}`)
                .style("text-anchor", "middle")
                .style("font-size", "14px")
                .style("fill", "white");

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

