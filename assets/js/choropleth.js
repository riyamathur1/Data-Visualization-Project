
        var width = 960, height = 600;
    
        var svg = d3.select("#choroplethMap svg")
            .attr("width", width)
            .attr("height", height);
    
        var projection = d3.geoAlbersUsa()
            .translate([width / 2, height / 2])
            .scale([1000]);
    
        var path = d3.geoPath()
            .projection(projection);
    
        var tooltip = d3.select(".tooltip1");
    
        // State abbreviation to full name map
        var stateNames = {
            "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California",
            "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "FL": "Florida", "GA": "Georgia",
            "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa",
            "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland",
            "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri",
            "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey",
            "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio",
            "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina",
            "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont",
            "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming"
        };
        var colorScale = d3.scaleThreshold()
            .domain([1, 10, 50, 100, 500, 1000, 1500])
            .range(d3.schemeBlues[7]);  // One more color than the number of breaks
    
        d3.json("https://gist.githubusercontent.com/riyamathur1/9f98dfb9d5e9584e40a1c1e2fe4d3a1a/raw/cba0d8a4b615e19d3429b13d13522ba3d3004bf9/us_states.json").then(function(json) {
            d3.csv("https://gist.githubusercontent.com/riyamathur1/0e8ec3647cfc953dd52cda2226f2a5be/raw/9f334793ceae752dac8c31921f91800bfd2f0838/aggregated_shootings_by_state.csv").then(function(data) {
                var dataMap = new Map();
                data.forEach(d => {
                    var fullName = stateNames[d.state];
                    var value = parseInt(d.shootings);
                    dataMap.set(fullName, isNaN(value) ? 0 : value);
                });
    
                svg.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("class", "state")
                .style("fill", function(d) { return colorScale(dataMap.get(d.properties.NAME) || 0); })
                .each(function(d) {
                    tippy(this, {
                        content: `${d.properties.NAME}: ${dataMap.get(d.properties.NAME) || "No data"} shootings`,
                        arrow: true
                    });
                });
    
                // Add a legend
                var legend = svg.append("g")
                    .attr("class", "legend")
                    .attr("transform", "translate(860, 400)");
                
                // Append legend title
                legend.append("text")
                    .attr("x", -10)
                    .attr("y", -10)
                    .text("Police Shootings")
                    .style("font-size", "14px")
                    
    
                var legendItem = legend.selectAll("rect")
                    .data(colorScale.range().map(function(color) {
                        var d = colorScale.invertExtent(color);
                        return d;
                    }).filter(d => d[0] !== undefined))
                    .enter().append("g")
                    .attr("transform", (d, i) => `translate(0, ${i * 25})`);
    
                legendItem.append("rect")
                    .attr("width", 20)
                    .attr("height", 20)
                    .style("fill", (d) => colorScale(d[0]));
    
                legendItem.append("text")
                    .attr("x", 25)
                    .attr("y", 15)
                    .text((d) => `${d[0]} - ${d[1] ? d[1] : '1500+'}`);
                    
                // Annotations
                var annotations = [
                    {
                        note: { label: "California has the highest record of fatal police shootings since 2015"},
                        x: projection([-119.4179, 36.7783])[0],
                        y: projection([-119.4179, 36.7783])[1],
                        dy: 60,
                        dx: -50
                    },
                    {
                        note: { label: "Rhode Island has only had 8 fatal police shootings since 2015" },
                        x: projection([-71.5068, 41.6750])[0],
                        y: projection([-71.5068, 41.6750])[1],
                        dy: 50,
                        dx: 60
                    }
                ];

                var makeAnnotations = d3.annotation()
                    .type(d3.annotationLabel)
                    .annotations(annotations)
                    .textWrap(130)
                    .on('subjectover', function(annotation) {
                        annotation.noteBg.style('fill', 'yellow');
                    })
                    .on('subjectout', function(annotation) {
                        annotation.noteBg.style('fill', 'white');
                    });

                svg.append("g")
                    .attr("class", "annotation-group")
                    .call(makeAnnotations)
                    .style("font-family", "sans-serif")
                    .style("font-size", "14px")
                    .style("fill", "black"); 

                svg.selectAll(".annotation rect")
                    .attr("fill", "white")
                    .attr("opacity", 0.7);
            });
     
        });
