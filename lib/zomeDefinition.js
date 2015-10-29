angular.module("ZomeDefinitionModule", [])
  .factory("zomeDefinitionService", function() {
    var def = {
      bezierPoints : [
        { "x": 0, "y": 0},
        { "x": 400, "y": 250},
        { "x": 300, "y": 500} ],
      p0 : function () { return def.bezierPoints[0] },
      p1 : function () { return def.bezierPoints[1] },
      p2 : function () { return def.bezierPoints[2] },
      zomeHeight : function() { return def.p2().y - def.p1().y },

      bezierGraph : [],

      verticalSteps : [],

      pointsByCircle : [],

      linkedPoints : []
    };
    return function() { return def }
  })
