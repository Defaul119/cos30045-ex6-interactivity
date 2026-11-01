const drawHistogram = (data) => {

  const svg = d3.select("#histogram")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);

  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const bins = binGenerator(data);
  console.log(bins);

  const minEng = bins[0].x0;
  const maxEng = bins[bins.length - 1].x1;
  const binsMaxLength = d3.max(bins, d => d.length);

  xScale
    .domain([minEng, maxEng])
    .range([0, innerWidth]);

  yScale
    .domain([0, binsMaxLength])
    .range([innerHeight, 0])
    .nice();

  innerChart
    .selectAll("rect")
    .data(bins)
    .join("rect")
      .attr("x", d => xScale(d.x0))
      .attr("y", d => yScale(d.length))
      .attr("width", d => xScale(d.x1) - xScale(d.x0))
      .attr("height", d => innerHeight - yScale(d.length))
      .attr("fill", barColor)
      .attr("stroke", bodyBackgroundColor)
      .attr("stroke-width", 2);

  const bottomAxis = d3.axisBottom(xScale)
    .tickValues(d3.range(minEng, maxEng + 1, 400))
    .tickFormat(d3.format(","));
  const leftAxis = d3.axisLeft(yScale)
    .ticks(7)
    .tickFormat(d3.format(","));

  innerChart
    .append("g")
      .attr("class", "axis axis-x")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(bottomAxis);

  innerChart
    .append("g")
      .attr("class", "axis axis-y")
      .call(leftAxis);

  svg
    .append("text")
      .attr("class", "axis-label")
      .text("Labelled energy consumption (kWh/year)")
      .attr("x", margin.left + innerWidth)
      .attr("y", height - 12)
      .attr("text-anchor", "end");

  svg
    .append("text")
      .attr("class", "axis-label")
      .text("Number of TV models")
      .attr("x", 10)
      .attr("y", 22);
};
