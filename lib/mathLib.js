angular.module("MathModule", [])
  .factory("mathService", function() {
    var mathService = {
      getX : function (points, index) { return points[index].x; },

      getY : function (points, index) { return points[index].y; },

      computeBezier : function (points, t, getter) {
          return getter(points, 0) * (1-t) * (1 - t) + 2 * getter(points, 1) * t * (1-t) + getter(points, 2) * t * t;
      },

      buildBezierGraph : function (points, graph) {
        if (graph.length == 0) {
          for (var t = 0; t <= 100; t++) {
            graph.push({x : mathService.computeBezier(points, t / 100, mathService.getX), y : mathService.computeBezier(points, t / 100, mathService.getY)});
          }
        } else {
          for (var t = 0; t <= 100; t++) {
            graph[t] = ({x : mathService.computeBezier(points, t / 100, mathService.getX), y : mathService.computeBezier(points, t / 100, mathService.getY)});
          }
        }
      },

      computeSteps : function(bezierPoints, stepNumber) {
        var height = bezierPoints[2].y - bezierPoints[0].y;
        var stepHeight = height / stepNumber;
        var steps = [];
        for (var i = 0; i < stepNumber; i ++) {
          var curY = 500 - (i * stepHeight); // TODO change 500
          steps.push([
            {x : 0, y :curY},
            { x: mathService.solveBezierEquation(bezierPoints, 500 - (i * stepHeight)), y : curY}]);
        }
        return steps;
      },

      solveBezierEquation : function (bezierPoints, Yn) {
        // Equation is : Yn = y2 * (1-t)(1-t) + 2 y1 t (1-t) + y0 t t
        // 0 = (y2−2y1+y0)t²+(2y1−2y0)t+y0 - Yn
        var y0 = bezierPoints[0].y;
        var y1 = bezierPoints[1].y;
        var y2 = bezierPoints[2].y;

        var a = y2 - 2 * y1 + y0;
        var b = 2 * y1 - 2 * y0;
        var c = y0 - Yn;
        var t = 0;
        if (a == 0) {
          t = (Yn - y0) / (2 * y1 - 2 * y0);
        } else {
          var discriminent = b * b - 4 * a * c;
          if (discriminent < 0) {
            alert("Erreur dans la résolution");
          }
          if (discriminent == 0) {
            return - b / (2 * a);
          }
          // solution 1
          var t = (- b + Math.sqrt(discriminent)) / (2 * a);
          // Si la solution t1 n'est pas comprise entre 0 et 1 calcul de l'autre solution
          if (t < 0 || t > 1) { t = (- b - Math.sqrt(discriminent)) / (2 * a); }
        }
        return mathService.computeBezier(bezierPoints, t, mathService.getX);
      },

      divideCircle : function(divisionNumber, circleDef, xName, yName) {
        var res = [];

        for (var i = 0; i <= divisionNumber; i++) {
          var angle = 2 * Math.PI * i / divisionNumber + 2 * Math.PI * circleDef.phase / divisionNumber;
          var point = {}
          point[xName] = circleDef.x + circleDef.radius * Math.cos(angle);
          point[yName] =  circleDef.y + circleDef.radius * Math.sin(angle);
          res.push(point);
        }
        return res;
      }

    }
    return function () { return mathService; };
  });
