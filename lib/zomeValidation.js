angular.module("ZomeValidationModule", ["MathModule", "ZomeDefinitionModule"])
  .controller("ZomeValidationController", ["mathService", "zomeDefinitionService", function(mathService, zomeDef) {
    this.steps = [];
    this.init = function() {
      this.steps = [
        {desc : "Compute points on circles", done : "No"},
        {desc : "Link points", done : "No"},
        {desc : "computing faces", done : "No"}
      ];
    }

    this.computeCoordinate = function() {
      for (var i = 0; i < this.steps.length; i++) {
        this.steps[i].done = 'pending';
      }
      this.steps[0].done = "working";
      zomeDef().pointsByCircle = computePointOnCircle(zomeDef().verticalSteps, zomeDef().wallNumber);
      this.steps[0].done = "Done";
      this.steps[1].done = "Working";
      zomeDef().linkedPoints = linkPoints(zomeDef().pointsByCircle, zomeDef().p0());
      this.steps[1].done = "Done";
      this.steps[2].done = "Working";
      zomeDef().faces = computeFaces(zomeDef().pointsByCircle, zomeDef().p0());
      this.steps[2].done = "Done";
    }

    function computePointOnCircle(verticalSteps, wallNumber) {

      var pointsByCircle = [];
      for (var curCircle = 0; curCircle < verticalSteps.length; curCircle++) {
        var circle = mathService().divideCircle(
          wallNumber,
          {
            x : 0,
            y : 0,
            radius : verticalSteps[curCircle][1].x,
            phase : curCircle / 2
          },
          "x",
          "z");
        circle.pop();
        for (var i = 0; i < circle.length; i++) {
          circle[i].y = verticalSteps[curCircle][0].y;
        }
        pointsByCircle.push(circle);
      }
      return pointsByCircle;
    }

    function linkPoints(pointsByCircle, summitPoint) {
      var linkedPoints = [];

      for (var curCircleId = 0; curCircleId < pointsByCircle.length - 1; curCircleId++) {
        var curCircle = pointsByCircle[curCircleId];
        var nextCircle = pointsByCircle[curCircleId+1];
        for (var curPointId = 0; curPointId < curCircle.length; curPointId++) {
          var p0Id = curPointId;
          var p1Id = (curPointId == 0) ? curCircle.length - 1 : curPointId - 1;
          linkedPoints.push([
            curCircle[p0Id],
            nextCircle[p0Id]
          ]);
          linkedPoints.push([
            curCircle[p0Id],
            nextCircle[p1Id]
          ]);
        }
      }
      // Link the last circle with the summit
      var lastCircle =  pointsByCircle[pointsByCircle.length - 1];
      for (var curPointId = 0; curPointId < lastCircle.length; curPointId++) {
        linkedPoints.push([
          lastCircle[curPointId],
          { x : 0, z : 0, y : summitPoint.y}
        ]);
      }
      return linkedPoints;
    }

    function computeFaces(pointsByCircle, summitPoint) {
      var faces = [];
      for (var curCircleId = 0; curCircleId < pointsByCircle.length - 1; curCircleId++) {
        var curCircle = pointsByCircle[curCircleId];
        var curCircleUp = pointsByCircle[curCircleId + 1];
        for (var curPointId = 0; curPointId < curCircle.length; curPointId++) {
          var p1Id = (curPointId == 0) ? curCircle.length - 1 : curPointId - 1
          var p0 = curCircle[curPointId]; // base
          var p1 = curCircleUp[curPointId]; // up right
          var p2 = curCircleUp[p1Id]; // up left
          var p3 = (curCircleId == pointsByCircle.length -2) ? { x : 0, z : 0, y : summitPoint.y } : pointsByCircle[curCircleId + 2][p1Id]; // up up middle
          faces.push([
              p0,
              p1,
              p2,
              p3
          ]);
        }
      }
      return faces;
    }
  }]);
