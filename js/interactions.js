const populateFilters = (data) => {

  d3.select("#filters_screen")
    .selectAll(".filter")
    .data(filters_screen)
    .join("button")
      .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
      .attr("aria-pressed", d => d.isActive)
      .text(d => d.label)
      .on("click", (e, d) => {
        console.log("DOM event", e);
        console.log("Attached datum", d);

        if (!d.isActive) {
          filters_screen.forEach(filter => {
            filter.isActive = d.id === filter.id;
          });

          d3.selectAll("#filters_screen .filter")
            .classed("active", filter => filter.id === d.id)
            .attr("aria-pressed", filter => filter.id === d.id);

          console.log(filters_screen);
          updateHistogram(d.id, data);
        }
      });

  const updateHistogram = (filterId, data) => {

    const updatedData = filterId === "all"
      ? data
      : data.filter(tv => tv.screenTech === filterId);

    const updatedBins = binGenerator(updatedData);

    yScale
      .domain([0, d3.max(updatedBins, d => d.length)])
      .nice();

    d3.select("#histogram .axis-y")
      .transition()
        .duration(500)
        .ease(d3.easeCubicInOut)
        .call(d3.axisLeft(yScale).ticks(7).tickFormat(d3.format(",")));

    d3.selectAll("#histogram rect")
      .data(updatedBins)
      .transition()
        .duration(500)
        .ease(d3.easeCubicInOut)
        .attr("y", d => yScale(d.length))
        .attr("height", d => innerHeight - yScale(d.length));
  };
};

const createTooltip = () => {

  const tooltip = innerChartS
    .append("g")
      .attr("class", "tooltip")
      .style("opacity", 0);

  tooltip
    .append("rect")
      .attr("width", tooltipWidth)
      .attr("height", tooltipHeight)
      .attr("rx", 3)
      .attr("ry", 3)
      .attr("fill", barColor)
      .attr("fill-opacity", 0.85);

  const text = tooltip
    .append("text")
      .attr("fill", "white")
      .attr("text-anchor", "middle");

  text
    .append("tspan")
      .attr("class", "tooltip-title")
      .attr("x", 0)
      .attr("y", 19);

  text
    .append("tspan")
      .attr("class", "tooltip-detail")
      .attr("x", 0)
      .attr("y", 37);
};

const handleMouseEvents = () => {

  innerChartS
    .selectAll("circle")
      .on("mouseenter", (e, d) => {
        console.log(e, d);

        const tooltip = d3.select(".tooltip");
        tooltip.select(".tooltip-title").text(`${d.screenSize}" ${d.screenTech}`);
        tooltip.select(".tooltip-detail").text(`${d.brand.toUpperCase()} ${d.model}`);

        const boxWidth = Math.max(tooltipWidth, tooltip.select("text").node().getBBox().width + 20);
        tooltip.select("rect")
          .attr("width", boxWidth)
          .attr("x", -boxWidth / 2);

        const cx = +e.target.getAttribute("cx");
        const cy = +e.target.getAttribute("cy");

        const x = Math.min(Math.max(cx, boxWidth / 2), innerWidth - boxWidth / 2);
        const above = cy - tooltipHeight - 10;
        const y = above < -margin.top ? cy + 10 : above;

        d3.select(e.target)
          .attr("r", 6)
          .attr("opacity", 1);

        tooltip
          .attr("transform", `translate(${x}, ${y})`)
          .transition()
            .duration(200)
            .style("opacity", 1);
      })
      .on("mouseleave", (e, d) => {
        d3.select(e.target)
          .attr("r", 4)
          .attr("opacity", 0.5);

        d3.select(".tooltip")
          .interrupt()
          .style("opacity", 0)
          .attr("transform", `translate(0, ${height})`);
      });
};
