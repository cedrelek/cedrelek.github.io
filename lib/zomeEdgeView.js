angular.module("ZomeEdgeViewModule", ["MathModule", "ZomeDefinitionModule"])
  .controller('ZomeEdgeViewController', ["mathService", "zomeDefinitionService", function(mathService, zomeDef) {

    this.eye = { x : 0, y : 0, z : 10000};

    var eye = this.eye;
    var axeFunction = d3.svg.line()
                            .x(function(d) { return (eye.z * (d.x - eye.x)) / (eye.z + d.z) + eye.x; })
                            .y(function(d) { return (eye.z * (d.y - eye.y)) / (eye.z + d.z) + eye.y; })
                            .interpolate("linear");


    var svg = d3.select("#zomeEdgeGraph").append("svg").attr("width", 800)
                              .attr("height", 800);

    var svgContainer = svg.append("g").attr("transform", "translate(400, 10)");

    this.render = function() {
      svg.selectAll(".edgeGraph").remove();
      for (var i = 0; i < zomeDef().linkedPoints.length; i++) {

        var stroke = (zomeDef().linkedPoints[i][0].z > 0 || zomeDef().linkedPoints[i][1].z > 0) ? 2 : 1;
        svgContainer.append("path").attr("class", "edgeGraph" + i)
                                   .attr("d", axeFunction(zomeDef().linkedPoints[i]))
                                   .attr("stroke", "blue")
                                   .attr("stroke-width", stroke )
                                   .attr("fill", function(d) { return "transparent"});

      }
    }
  }])
