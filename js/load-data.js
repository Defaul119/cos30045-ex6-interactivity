d3.csv("data/Ex6_TVdata_withStar.csv", d => {
  return {
    brand: d.brand,
    model: d.model,
    screenSize: +d.screenSize,
    screenTech: d.screenTech,
    star: +d.star,
    energyConsumption: +d.energyConsumption
  };
}).then(data => {
  console.log(data);

  drawHistogram(data);
  populateFilters(data);

  drawScatterplot(data);
  createTooltip();
  handleMouseEvents();
});
