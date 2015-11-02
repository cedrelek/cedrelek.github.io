angular.module("ZomeEdgeViewModule", ["MathModule", "ZomeDefinitionModule"])
  .controller('ZomeEdgeViewController', ["mathService", "zomeDefinitionService", function(mathService, zomeDef) {
    var zome = zomeDef();
    this.material = new THREE.MeshLambertMaterial(
      {
        color: 0xDDDDDD
    });
    var material = this.material;
    this.render = function() {
      // set the scene size
      var WIDTH = 600,  HEIGHT = 600;

      // set some camera attributes
      var VIEW_ANGLE = 45,
        ASPECT = WIDTH / HEIGHT,
        NEAR = 0.1,
        FAR = 10000;

      // get the DOM element to attach to
      // - assume we've got jQuery to hand
      var container = $('#3dview');

  // create a WebGL renderer, camera
  // and a scene
      var renderer = new THREE.WebGLRenderer();
      var camera =
        new THREE.PerspectiveCamera(
          VIEW_ANGLE,
          ASPECT,
          NEAR,
          FAR);


      var scene = new THREE.Scene();

      // add the camera to the scene
      scene.add(camera);

      // the camera starts at 0,0,0
      // so pull it back


      // start the renderer
      renderer.setSize(WIDTH, HEIGHT);

      // attach the render-supplied DOM element
      container.append(renderer.domElement);

      new THREE.MeshLambertMaterial(
        {
          color: 0xFFFFFF
      });

      function createVector(point) {
        return new THREE.Vector3(point.x, point.y, point.z);
      }
      var geom = new THREE.Geometry();

      function addFace(face, id) {

        geom.vertices.push(createVector(face[0]));
        geom.vertices.push(createVector(face[1]));
        geom.vertices.push(createVector(face[2]));
        geom.vertices.push(createVector(face[3]));
        geom.faces.push(new THREE.Face3(id * 4, id * 4 + 1, id * 4 + 2));
        geom.faces.push(new THREE.Face3(id * 4, id * 4 + 2, id * 4 + 1));
        geom.faces.push(new THREE.Face3(id * 4 + 2, id * 4 + 1, id * 4 + 3));
        geom.faces.push(new THREE.Face3(id * 4 + 2, id * 4 + 3, id * 4 + 1));
      }


      for (var curFaceId = 0; curFaceId < zome.faces.length; curFaceId++) {
        addFace(zome.faces[curFaceId], curFaceId);
      }
      geom.computeFaceNormals();

      var object = new THREE.Mesh(geom, material);
      scene.add(object);
      camera.position.set(0,0,1000);
      camera.up = new THREE.Vector3(0,-1,0);
      camera.lookAt(new THREE.Vector3(0, 250, 0));




      var pointLight = new THREE.PointLight(0x0000FF);
      pointLight.position.x = 600;
      pointLight.position.y = 600;
      pointLight.position.z = 600;

      var pointLight2 = new THREE.PointLight(0x0000FF);
      pointLight2.position.x = -600;
      pointLight2.position.y = 600;
      pointLight2.position.z = 600;
      var pointLight3 = new THREE.PointLight(0xAAAAAA);
      pointLight3.position.x = 600;
      pointLight3.position.y = -600;
      pointLight3.position.z = 600;
      scene.add(pointLight);
      scene.add(pointLight2);
      scene.add(pointLight3);


      renderer.render(scene, camera);
    }
  }])
