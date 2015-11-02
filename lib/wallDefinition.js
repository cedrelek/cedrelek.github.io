angular.module('WallDefinitionModule', ["MathModule", "ZomeDefinitionModule"])

  .controller('WallDefinitionController', ["mathService", "zomeDefinitionService", function(mathService, zomeDef) {
    this.wallNumber = 0;
    this.wallPoints = [];
    this.phasedWallPoints = [];
    this.changeWallNumber = function() {
      zomeDef().wallNumber = this.wallNumber;
      this.render();
    }

    var axeFunction = d3.svg.line()
                            .x(function(d) { return d.x; })
                            .y(function(d) { return d.y; })
                            .interpolate("linear");

    var svg = d3.select("#wallDefinitionGraph").append("svg").attr("width", 600)
                              .attr("height", 600);

    var svgContainer = svg.append("g").attr("transform", "translate(10, 10)");

    var parameterCircle = svgContainer.append("circle")
                     .attr("cx", 250)
                     .attr("cy", 250)
                     .attr("r", 200)
                     .attr("class", "baseCircle")
                     .attr("stroke", "green")
                     .attr("stroke-width", 1)
                     .attr("fill", "transparent");

   var wallGraph = svgContainer.append("path")
                              .attr("class", "wallPath")
                              .attr("d", axeFunction(this.wallPoints))
                              .attr("stroke", "blue")
                              .attr("stroke-width", 2)
                              .attr("fill", function(d) { return "transparent"});
   var phasedWallGraph = svgContainer.append("path")
                              .attr("class", "phasedWallPath")
                              .attr("d", axeFunction(this.phasedWallPoints))
                              .attr("stroke", "red")
                              .attr("stroke-width", 1)
                              .attr("fill", function(d) { return "transparent"});

    this.render = function() {
      if (this.wallNumber > 0) {
        this.wallPoints = mathService().divideCircle(this.wallNumber, {x : 250, y : 250, radius : 200, phase : 0}, "x", "y");
        this.phasedWallPoints = mathService().divideCircle(this.wallNumber, {x : 250, y : 250, radius : 200, phase : 1/2}, "x", "y");
        var transition = d3.select("#wallDefinitionGraph").transition();
        transition.selectAll(".wallPath")
                  .duration(750)
                  .attr("d", axeFunction(this.wallPoints));
        transition.selectAll(".phasedWallPath")
                  .duration(750)
                  .attr("d", axeFunction(this.phasedWallPoints));
      }
    }

}]);
