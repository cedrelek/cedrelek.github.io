angular.module('ZomeDefinitionModule', [])
  .factory('zomeDefinitionService', function() {
    var def = {
      orderNumber : 5,
      levelHeight : 10,
      baseAngle : 35,
      // Liste de losanges
      // Un losange est un tableau de 4 points x, y, z
      rhombeList : [],
      pointList : [],
      levelId : -1,
      wallsVisible : false,
      wireframeVisible : false,
      wallHeight : 0,
      wallPanels : { rectanglePanels : [], missingWallParts : []},
      beamSize : {width : 10, height : 30}
    };
    return function() { return def; };
  })
  .factory('zomeCalculatorService', function() {
    var calculator = {

      computeWallPanels : function(zomeDef) {
        zomeDef.wallPanels.rectanglePanels = [];
        zomeDef.wallPanels.missingWallParts = [];
        if (zomeDef.levelId > -1 && zomeDef.wallHeight > 0) {
          for (var i = 0; i < zomeDef.orderNumber; i++) {
            var p0 = calculator.getReferencedPoint(i, zomeDef.levelId, zomeDef.pointList);
            var p1 = calculator.getReferencedPoint((i + 1) % zomeDef.orderNumber, zomeDef.levelId, zomeDef.pointList);
            zomeDef.wallPanels.rectanglePanels.push([
              p1,
              { x : p1.x, y : p1.y - zomeDef.wallHeight, z : p1.z},
              p0,
              { x : p0.x, y : p0.y - zomeDef.wallHeight, z : p0.z },
            ]);
            for (var rhId = 0; rhId < zomeDef.rhombeList.length; rhId++) {
              if (calculator.getReferencedPoint(i, zomeDef.levelId, zomeDef.rhombeList[rhId]) !== null &&
                  calculator.getReferencedPoint((i+1) % zomeDef.orderNumber, zomeDef.levelId, zomeDef.rhombeList[rhId]) !== null) {
                zomeDef.wallPanels.missingWallParts.push([
                  p0,
                  p1,
                  zomeDef.rhombeList[rhId][3]
                ]);
                break;
              }
            }
          }
        }
      },

      computeZome : function(zomeDef) {
        calculator.computePointList(zomeDef);
        calculator.buildRhombeList(zomeDef);
      },
      /*
      * Link the point together to build the list of Rhombes.
      */
      buildRhombeList : function(zomeDef) {
        var rhombeList = [];
        for (var levelId = 1; levelId < zomeDef.orderNumber; levelId++) {
          for (var i = 0; i < zomeDef.orderNumber; i++) {
            var p0 = (levelId == 1) ? calculator.getNamedPoint("S0", zomeDef.pointList) : calculator.getReferencedPoint(i, levelId - 2, zomeDef.pointList);
            var p1;
            var p2;
            if (levelId % 2 == 1) {
               p1 = calculator.getReferencedPoint((i -1 + zomeDef.orderNumber) % zomeDef.orderNumber, levelId - 1, zomeDef.pointList);
               p2 = calculator.getReferencedPoint(i, levelId - 1, zomeDef.pointList);
            } else {
               p1 = calculator.getReferencedPoint(i, levelId - 1, zomeDef.pointList);
               p2 = calculator.getReferencedPoint((i+1) % zomeDef.orderNumber, levelId - 1, zomeDef.pointList);
            }
            var p3 = (levelId == zomeDef.orderNumber - 1) ? calculator.getNamedPoint("SN", zomeDef.pointList) : calculator.getReferencedPoint(i, levelId, zomeDef.pointList);
            rhombeList.push([
              p0,
              p1,
              p2,
              p3
            ]);
          }
        }
        zomeDef.rhombeList = rhombeList;
      },

      /*
      * Compute the rhomeList
      */
      computePointList : function(zomeDef) {
        var pointList = calculator.computeFirstCrown(zomeDef.orderNumber, zomeDef.levelHeight, zomeDef.baseAngle);
        pointList.push({x : 0, y : 0, z : 0, id : {name : "S0", i : 0, levelId : -1}});
        pointList.push({x : 0, y : zomeDef.levelHeight * zomeDef.orderNumber, z : 0, id : {name : "SN", i : 0, levelId : zomeDef.orderNumber}});

        for (var curLevel = 1; curLevel < zomeDef.orderNumber - 1; curLevel++) {
          for (var i = 0; i < zomeDef.orderNumber; i++) {
            var p0 = (curLevel == 1) ? calculator.getNamedPoint("S0", pointList) : calculator.getReferencedPoint(i, curLevel - 2, pointList);
            var p1;
            var p2;
            if (curLevel % 2 == 1) {
               p1 = calculator.getReferencedPoint((i -1 + zomeDef.orderNumber) % zomeDef.orderNumber, curLevel - 1, pointList);
               p2 = calculator.getReferencedPoint(i, curLevel - 1, pointList);
            } else {
               p1 = calculator.getReferencedPoint(i, curLevel - 1, pointList);
               p2 = calculator.getReferencedPoint((i+1) % zomeDef.orderNumber, curLevel - 1, pointList);
            }

            pointList.push(calculator.computeSummitFrom3Points(p0, p1, p2, i, curLevel));
          }
        }

        zomeDef.pointList = pointList;
      },

      /*
      * convert degre to rad
      */
      toRad : function(angle) {
        return Math.PI * angle / 180;
      },

      /*
      * Compute the first crown
      * Return a list of point P01, Pi1, P(n-1)1...
      */
      computeFirstCrown : function(orderNumber, levelHeight, baseAngle) {
        var crownPointList = [];
        for (var i = 0; i < orderNumber; i++) {
          var curPoint = {
            x : levelHeight / Math.tan(Math.PI / 2 - calculator.toRad(baseAngle)) * Math.cos(Math.PI * 2 * i / orderNumber),
            y : levelHeight,
            z : levelHeight / Math.tan(Math.PI / 2 - calculator.toRad(baseAngle)) * Math.sin(Math.PI * 2 * i / orderNumber),
            id : { name : "P" + i + "0",
                   i : i,
                   levelId : 0}
          };
          crownPointList.push(curPoint);
        }
        return crownPointList;
      },

      /*
      * Return a referenced point from a ref
      */
      getReferencedPoint : function(i, levelId, pointList) {
        for (var curI = 0; curI < pointList.length; curI++) {
          if (pointList[curI].id.i == i && pointList[curI].id.levelId == levelId) return pointList[curI];
        }
        console.log("Could not find the point P" + i + levelId);
        return null;
      },

      /*
      * Return a named point from a list
      */
      getNamedPoint : function(name, pointList) {
        for (var i = 0; i < pointList.length; i++) {
          if (pointList[i].id.name == name) return pointList[i];
        }
        console.log("Could not find the point named : " + name);
        return null;
      },

      /*
      * Calcul du 4eme point par rapport P1, P2, P3
      */
      computeSummitFrom3Points : function(p0, p1, p2, i, levelId) {
        return {
          x : p1.x + p2.x - p0.x,
          y : p1.y + p2.y - p0.y,
          z : p1.z + p2.z - p0.z,
          id : {i: i, levelId: levelId, name : "P" + i + levelId}
        };
      }
    };
    return function() { return calculator; };
  });
