(function() {
  var mouseDown, mouseMove, mouseUp, orbitLookAt, orbitLookAtNode, recordToVec3, recordToVec4, state, vec3ToRecord, vec4ToRecord;
  recordToVec3 = function(record) {
    return [record.x, record.y, record.z];
  };
  recordToVec4 = function(record) {
    return [record.x, record.y, record.z, record.w];
  };
  vec3ToRecord = function(vec) {
    return {
      x: vec[0],
      y: vec[1],
      z: vec[2]
    };
  };
  vec4ToRecord = function(vec) {
    return {
      x: vec[0],
      y: vec[1],
      z: vec[2],
      w: vec[3]
    };
  };
  orbitLookAt = function(dAngles, lookAt) {
    var axis, dAngle, eye0, eye0norm, eye1, eyeLen, look, result, rotMat, tangent0, tangent0norm, tangent1, up0, up1;
    eye0 = recordToVec3(lookAt.eye);
    up0 = recordToVec3(lookAt.up);
    look = recordToVec3(lookAt.look);
    eyeLen = SceneJS_math_lenVec3(eye0);
    eye0norm = [0.0, 0.0, 0.0];
    SceneJS_math_mulVec3Scalar(eye0, 1.0 / eyeLen, eye0norm);
    tangent0 = [0.0, 0.0, 0.0];
    SceneJS_math_cross3Vec3(eye0, up0, tangent0);
    tangent0norm = SceneJS_math_normalizeVec3(tangent0);
    axis = [tangent0norm[0] * dAngles[0] + tangent0norm[1] * dAngles[0], eye0norm[0] * dAngles[1] + eye0norm[1] * dAngles[1]];
    dAngle = SceneJS_math_lenVec2(dAngles);
    rotMat = SceneJS_math_rotationMat4v(dAngle, axis);
    eye1 = SceneJS_math_transformVector3(rotMat, eye0);
    tangent1 = SceneJS_math_transformVector3(rotMat, tangent0);
    tangent1[1] = 0.0;
    up1 = [0.0, 0.0, 0.0];
    SceneJS_math_cross3Vec3(eye1, tangent1, up1);
    return result = {
      eye: vec3ToRecord(eye1),
      up: vec3ToRecord(up1)
    };
  };
  orbitLookAtNode = function(dAngles, node) {
    return orbitLookAt(dAngles, {
      eye: node.get('eye'),
      look: node.get('look'),
      up: node.get('up')
    });
  };
  /*
  BIM Viewer
  Copyright 2011, Bimserver.org.
  */
  state = {
    scene: SceneJS.scene('Scene'),
    canvas: document.getElementById('scenejsCanvas'),
    viewport: {
      selectedElement: null,
      mouse: {
        last: [0, 0],
        leftDragging: false,
        middleDragging: false
      }
    }
  };
  state.scene.start();
  mouseDown = function(event) {
    state.viewport.mouse.last = [event.clientX, event.clientY];
    switch (event.which) {
      case 1:
        return state.viewport.mouse.leftDragging = true;
      case 2:
        return state.viewport.mouse.middleDragging = true;
    }
  };
  mouseUp = function(event) {
    state.viewport.mouse.leftDragging = false;
    return state.viewport.mouse.middleDragging = false;
  };
  mouseMove = function(event) {
    var delta, lookAtNode;
    if (state.viewport.mouse.middleDragging) {
      delta = [event.clientX - state.viewport.mouse.last[0], event.clientY - state.viewport.mouse.last[0]];
      lookAtNode = state.scene.findNode("main-lookAt");
    }
    return state.viewport.mouse.last = [event.clientX, event.clientY];
  };
  state.canvas.addEventListener('mousedown', mouseDown, true);
  state.canvas.addEventListener('mouseup', mouseUp, true);
  state.canvas.addEventListener('mousemove', mouseMove, true);
}).call(this);