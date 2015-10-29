
angular.module('LevelDefinitionModule', ["MathModule", "ZomeDefinitionModule"])
  .controller('LevelDefinitionController', ["mathService", "zomeDefinitionService", function(mathService, zomeDef) {
    this.bezierPoints = zomeDef().bezierPoints;
    this.bezierGraph = zomeDef().bezierGraph;
    this.vStepNumber = 0;


    var axes = [ { "x" : 0, "y" : 0}, {"x" : 0, "y" : 500}, { "x" : 500, "y" : 500}]

    var bezierFunction = d3.svg.line()
                             .x(function(d) { return d.x; })
                             .y(function(d) { return d.y; })
                             .interpolate("linear");

    var axeFunction = d3.svg.line()
                            .x(function(d) { return d.x; })
                            .y(function(d) { return d.y; })
                            .interpolate("linear");


    var svg = d3.select("#levelDefinitionGraph").append("svg").attr("width", 600)
                              .attr("height", 600);

    var svgContainer = svg.append("g").attr("transform", "translate(10, 10)");


    var axeGraph = svgContainer.append("path")
                                .attr("d", axeFunction(axes))
                                .attr("stroke", "green")
                                .attr("stroke-width", 3)
                                .attr("fill", function(d) { return "transparent"});

    var zomeShapeGraph = svgContainer.append("path")
                               .attr("class", "bezierPath")
                               .attr("d", bezierFunction(this.bezierGraph))
                               .attr("stroke", "blue")
                               .attr("stroke-width", 2)
                               .attr("fill", function(d) { return "transparent"});


    this.render = function() {
        zomeDef().verticalSteps = mathService().computeSteps(this.bezierPoints, this.vStepNumber);
        var transition = d3.select("#levelDefinitionGraph").transition();
        transition.select(".bezierPath")
                  .duration(750)
                  .attr("d", bezierFunction(this.bezierGraph));
        var stepGraph = d3.select("#levelDefinitionGraph").selectAll(".stepGraph");
        if (stepGraph) {
          stepGraph.remove();
        }

        for (var i = 0; i <  zomeDef().verticalSteps.length; i++) {
          svgContainer.append("path").attr("class", "stepGraph")
                                     .attr("d", axeFunction(zomeDef().verticalSteps[i]))
                                     .attr("stroke", "blue")
                                     .attr("stroke-width", 2)
                                     .attr("fill", function(d) { return "transparent"});

        }
    }

}]);
