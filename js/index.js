/*
User Story: I can see performance time visualized in a scatterplot graph.

User Story: I can mouse over a plot to see a tooltip with additional details.

Hint: Here's a dataset you can use to build this: https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json
*/

// Define doping as RED, otherwise GREEN

// Inspired by
// http://bl.ocks.org/mbostock/3887118

// Easy way to define margins
var margin = {
    top: 10,
    right: 70,
    bottom: 40,
    left: 40
  },
  width = 890 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom,
  $svg,
  $tooltip,
  $chart,
  xScale,
  yScale,
  colorScale,
  xAxis,
  yAxis,
  tmpl;

$svg = d3.select('#chart').append('svg');
$toolTip = d3.select('.tooltip');
tmpl = $.templates('#tmpl');

$svg.attr({
  width: width + margin.left + margin.right,
  height: height + margin.top + margin.bottom
});
$chart = $svg.append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// Define the range part of domain > range
xScale = d3.scale.linear().range([0, width]);
yScale = d3.scale.linear().range([height, 0]);
colorScale = d3.scale.ordinal().range(['red', 'green']).domain(['doping', 'clean']);

// Label text positioning borrowed from:
// http://bl.ocks.org/mbostock/3887118

var legend = $chart.selectAll('.legend').data(colorScale.domain())
  .enter()
  .append('g')
  .attr('class', 'legend')
  .attr('transform', function(v, i) {
    return 'translate(' + (50) + ', ' + (i * 20) + ')';
  });
//.attr('transform', function(v, i) {return 'translate(' + (0) + ', ' + ((height - colorScale.domain().length*20) + (i * 20)) + ')';});

legend.append('rect')
  .attr('x', 28)
  .attr('width', 18)
  .attr('height', 18)
  .style('fill', colorScale);

legend.append("text")
  .attr("x", 24)
  .attr("y", 9)
  .attr("dy", ".35em")
  .style("text-anchor", "end")
  .text(function(d) {
    return d;
  })

// Define the scale painted upon the chart
xAxis = d3.svg.axis().scale(xScale).orient('bottom');
yAxis = d3.svg.axis().scale(yScale).orient('left');

d3.json('https://dl.dropboxusercontent.com/s/m7w6g0ih83wvdd8/cyclist-data.json?dl=0', function(err, data) {
  var nodes;
  console.log(data);
  xScale.domain(d3.extent(data, (v) => (v.Seconds))).nice();
  yScale.domain(d3.extent(data, (v) => (v.Place))).nice();

  // Label text positioning borrowed from:
  // http://bl.ocks.org/mbostock/3887118
  $chart.append('g').attr({
      class: 'x',
      transform: 'translate(0,' + height + ' )'
    }).call(xAxis).append("text")
    .attr("class", "label")
    .attr("x", width)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text("Time (seconds)");

  $chart.append('g').attr({
      class: 'y',
    }).call(yAxis).append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Placement");

  // Using <g> as container
  // https://groups.google.com/forum/#!topic/d3-js/NIamAI9Yy60
  nodes = $chart.selectAll('.node')
    .data(data)
    .enter()
    .append('g')
    .attr('transform', function(v) {
      return 'translate(' + xScale(v.Seconds) + ',' + yScale(v.Place) + ')'
    });

  nodes.append('circle').attr('class', 'node-item').attr('r', 3.5).style('fill', function(v) {
    if (!v.Doping) {
      return colorScale(1);
    } else {
      return colorScale(0);
    }
  });

  nodes.append('text').text(function(v) {
      return v.Name;
    })
    .attr({
      class: 'node-text',
      'x': 7,
      'y': '0.5em'
    });

  // Derived from:
  // http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html
  nodes.on({
    'mouseover': function(v) {
      $toolTip.html(tmpl.render(v));
      $toolTip.transition().duration(200).style('opacity', .9);
      $toolTip.style({
        'left': (d3.event.pageX) + "px",
        'top': (d3.event.pageY - 28) + "px"
      });
    },
    'mouseout': (v) => {
      $toolTip.transition().style('opacity', 0);
    }
  });

  /*.append('circle')
    .attr('class', 'circle')
    .attr('r', 3.5)
    .attr('cx', function(d) {
      console.log(xScale(d.Seconds));
      return xScale(d.Seconds);
    })
    .attr('cy', function(d) {
      console.log(yScale(d.Place));
      return yScale(d.Place);
    });
    */

});