
angular.module('GeneralShapeModule', ["MathModule", "ZomeDefinitionModule"])

  .controller('GeneralShapeController', ["zomeDefinitionService", "mathService", function(zomeDef, mathService) {
    this.bezierPoints = zomeDef().bezierPoints;
    this.bezierGraph = zomeDef().bezierGraph;

    mathService().buildBezierGraph(this.bezierPoints, this.bezierGraph);
    this.zomeHeight = 500 - zomeDef().p0().y;
    this.zomeRadius = zomeDef().p2().x;
    this.parameterPoint = { "x" : zomeDef().p1().x, "y" : 500 - zomeDef().p1().y };

    this.changeHeight = function() {
      zomeDef().p0().y = 500 - this.zomeHeight;
      this.render();
    };

    this.changeRadius = function() {
      zomeDef().p2().x = this.zomeRadius;
      this.render();
    };
    this.changeParameterPoint = function() {
      zomeDef().p1().x = this.parameterPoint.x;
      zomeDef().p1().y = 500 - this.parameterPoint.y;
      this.render();
    }
    // point for axes
    var axes = [ { "x" : 0, "y" : 0}, {"x" : 0, "y" : 500}, { "x" : 500, "y" : 500}]

    var gridAxes = [];
    for (var i = 0; i < 500; i = i + 50) {
      gridAxes.push([{"x" : i, "y" : 0}, {"x" : i, "y": 500}]);
    }


    var bezierFunction = d3.svg.line()
                             .x(function(d) { return d.x; })
                             .y(function(d) { return d.y; })
                             .interpolate("linear");

    var axeFunction = d3.svg.line()
                            .x(function(d) { return d.x; })
                            .y(function(d) { return d.y; })
                            .interpolate("linear");


    //The SVG Container
    var svg = d3.select("#generalShapeGraph").append("svg").attr("width", 600)
                              .attr("height", 600);

    var svgContainer = svg.append("g").attr("transform", "translate(10, 10)");

    for (var i = 0; i < gridAxes.length; i++) {
      svgContainer.append("path") .attr("d", axeFunction(gridAxes[i]))
                                  .attr("stroke", "green")
                                  .attr("stroke-width", 1)
                                  .attr("fill", function(d) { return "transparent"});

    }

    var axeGraph = svgContainer.append("path")
                                .attr("d", axeFunction(axes))
                                .attr("stroke", "green")
                                .attr("stroke-width", 3)
                                .attr("fill", function(d) { return "transparent"});



    var zomeAsymptoteGraph = svgContainer.append("path")
                                .attr("class", "asymptotePath")
                                .attr("d", axeFunction(this.bezierPoints))
                                .attr("stroke", "red")
                                .attr("stroke-width", 1)
                                .attr("fill", function(d) { return "transparent"});


    var parameterCircle = svgContainer.append("circle")
                     .attr("cx", zomeDef().p1().x)
                     .attr("cy", zomeDef().p1().y)
                     .attr("r", 7)
                     .attr("class", "parameterPoint")
                     .attr("fill", "red");
    var zomeShapeGraph = svgContainer.append("path")
                               .attr("class", "bezierPath")
                               .attr("d", bezierFunction(this.bezierGraph))
                               .attr("stroke", "blue")
                               .attr("stroke-width", 2)
                               .attr("fill", function(d) { return "transparent"});
    this.render = function() {
        var svg = d3.select("#generalShapeGraph").transition();

        mathService().buildBezierGraph(this.bezierPoints, this.bezierGraph);
        svg.select(".bezierPath")
                  .duration(750)
                  .attr("d", bezierFunction(this.bezierGraph));
        svg.select(".asymptotePath")
                  .duration(750)
                  .attr("d", axeFunction(this.bezierPoints));
        svg.select(".parameterPoint")
                  .duration(750)
                  .attr("cx", zomeDef().p1().x)
                  .attr("cy", zomeDef().p1().y)
    }

}]);
