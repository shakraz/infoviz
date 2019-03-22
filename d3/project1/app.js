var dataset;
var regions;
var tooltip = d3.select("#tooltip");

function draw(id="РЕСПУБЛИКА КАЗАХСТАН"){

  data = dataset.filter(function(d){return d.region==id})
  var years = d3.set(data, function(d) {return d.year}).values()

  var canvas = d3.select(".col-lg")
  console.log(canvas.style("height"))

  var margin={top:20, bottom:20, left:20, right:20},
      padding={top:40, bottom:40, left:40, right:40},
      outerWidth=0.8*parseInt(canvas.style("width")),
      outerHeight=600,
      innerWidth=outerWidth-margin.left-margin.right,
      innerHeight=outerHeight-margin.top-margin.bottom,
      width=innerWidth-padding.left-padding.right,
      height=innerHeight-padding.top-padding.bottom;
  d3.select("svg").remove()

  var canvas= d3.select('#chart')
                .append('svg')
                .attr('width', outerWidth)
                .attr('height', outerHeight)
                .append("g")
                .attr('transform', "translate("+margin.left+","+margin.top+")")



  var g = canvas.append('g')
                .attr('transform', "translate("+padding.left+","+padding.right+")")


  y_extent= d3.max(data, function(d) {return d.marriages});
  y_scale= d3.scaleLinear().domain([0,y_extent]).range([height,0]);
  y_axis=d3.axisLeft(y_scale);

  x_scale= d3.scalePoint().domain(years).range([0,width]);
  x_axis=d3.axisBottom(x_scale);


  g.append('g')
   .attr('class','x-axis')
   .attr('transform', "translate(0,"+height+")")
   .call(x_axis)

d3.select(".x-axis")
  .selectAll("text")
  .attr("transform","translate(13,20),rotate(90)")

  g.append('g')
   .attr('class', 'axis')
   .attr('transform', "translate(0,0)")
   .call(y_axis)


  g.selectAll('circle')
  .data(data)
  .enter()
  .append('circle')
  .attr('cx', function(d){return x_scale(d.year)})
  .attr('cy', function(d){return y_scale(d.marriages)})
  .attr("r",3)
  .attr("fill", "green")
  .on("mouseover", function(){
    tooltip
				.style("display", "inline")
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY) + "px");
  })

  g.selectAll('circle')
  .data(data)
  .enter()
  .append('circle')
  .attr('cx', function(d){return x_scale(d.year)})
  .attr('cy', function(d){return y_scale(d.divorces)})
  .attr("r",3)
  .attr("fill","red")

var line = d3.line()
             .x(function(d){return x_scale(d.year)})
             .y(function(d){return y_scale(d.marriages)})
             .curve(d3.curveMonotoneX)

var death_line = d3.line()
            .x(function(d){return x_scale(d.year)})
            .y(function(d){return y_scale(d.divorces)})
            .curve(d3.curveMonotoneX)

 g.append("path")
  .datum(data)
  .attr("class", "g-line")
  .attr("d", line)

g.append("path")
 .datum(data)
 .attr("class", "r-line")
 .attr("d", death_line);
};

function drawMenu(){
  d3.select("#menu")
    .selectAll("div")
    .data(regions)
    .enter()
    .append("div")
    .attr("class","menu-region")
    .attr("id",function(d){return d})
    .text(function(d){return d})
    .on("click", function(){
      draw(this.id)
    })
}

function showTooltip(){

}


d3.csv('./data/zags.csv', function(data){
  data.forEach(function(d) {
    d.divorces=+d.divorces
    d.year=+d.year
    d.marriages=+d.marriages
  })
  dataset=data;
  regions = d3.set(dataset, function(d) {return d.region}).values()
  console.log(regions)
  draw()
  drawMenu()
});
