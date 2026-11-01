const drawScatterplot = (data) => {

  const svg = d3.select("#scatterplot")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);

  innerChartS = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const maxStar = d3.max(data, d => d.star);
  const maxEng = d3.max(data, d => d.energyConsumption);

  xScaleS
    .domain([0, maxStar])
    .range([0, innerWidth]);

  yScaleS
    .domain([0, maxEng])
    .range([innerHeight, 0])
    .nice(6);

  colorScale
    .domain(["LED", "LCD", "OLED"])
    .range(["#2a78d6", "#eb6834", "#1baf7a"]);

  innerChartS
    .selectAll("circle")
    .data(data)
    .join("circle")
      .attr("r", 4)
      .attr("cx", d => xScaleS(d.star))
      .attr("cy", d => yScaleS(d.energyConsumption))
      .attr("fill", d => colorScale(d.screenTech))
      .attr("opacity", 0.5);

  const bottomAxis = d3.axisBottom(xScaleS)
    .ticks(maxStar);
  const leftAxis = d3.axisLeft(yScaleS)
    .ticks(6)
    .tickFormat(d3.format(","));

  innerChartS
    .append("g")
      .attr("class", "axis axis-x")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(bottomAxis);

  innerChartS
    .append("g")
      .attr("class", "axis axis-y")
      .call(leftAxis);

  svg
    .append("text")
      .attr("class", "axis-label")
      .text("Star rating")
      .attr("x", margin.left + innerWidth)
      .attr("y", height - 12)
      .attr("text-anchor", "end");

  svg
    .append("text")
      .attr("class", "axis-label")
      .text("Labelled energy consumption (kWh/year)")
      .attr("transform", `translate(20, ${margin.top + innerHeight / 2}) rotate(-90)`)
      .attr("text-anchor", "middle");

  const legend = innerChartS
    .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${innerWidth - 70}, 0)`);

  colorScale.domain().forEach((tech, i) => {
    const legendItem = legend
      .append("g")
        .attr("transform", `translate(0, ${i * 20})`);

    legendItem
      .append("rect")
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", colorScale(tech));

    legendItem
      .append("text")
        .text(tech)
        .attr("x", 20)
        .attr("y", 11);
  });
};
