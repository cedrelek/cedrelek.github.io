angular.module("ZomeBuilder", ["GeneralShapeModule",
                               "ViewModule",
                               "LevelDefinitionModule",
                               'MathModule',
                               "ZomeDefinitionModule",
                               "WallDefinitionModule",
                               "ZomeValidationModule",
                               "ZomeEdgeViewModule"])
  .directive("generalShapeComp", function() {
    return {
      templateUrl: 'components/generalShape.html',
      restrict: 'E',
      replace: true
    }
  })
  .directive("levelDefinitionComp", function() {
    return {
      templateUrl : 'components/levelDefinition.html',
      restrict: 'E',
      replace: true
    }
  })
  .directive("wallDefinitionComp", function() {
    return {
      templateUrl : 'components/wallDefinition.html',
      restrict: 'E',
      replace: true
    }
  })
  .directive("zomeValidationComp", function() {
    return {
      templateUrl : 'components/zomeValidation.html',
      restrict: 'E',
      replace: true
    }
  })
  .directive("zomeEdgeComp", function() {
    return {
      templateUrl : 'components/zomeEdgeView.html',
      restrict: 'E',
      replace: true
    }
  });
