(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = function(strings) {
  if (typeof strings === 'string') strings = [strings]
  var exprs = [].slice.call(arguments,1)
  var parts = []
  for (var i = 0; i < strings.length-1; i++) {
    parts.push(strings[i], exprs[i] || '')
  }
  parts.push(strings[i])
  return parts.join('')
}

},{}],2:[function(require,module,exports){
"use strict";

var _matrixUtils = _interopRequireDefault(require("./matrixUtils"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var glsl = require('glslify');
var vertexShader = glsl(["#define GLSLIFY 1\nuniform mat4 u_matrix;\nattribute vec2 a_position;\n\nvoid main() {\n    gl_Position = u_matrix * vec4(a_position, 0.0, 1.0);\n    gl_PointSize = 10.0;\n}\n"]);
var fragmentShader = glsl(["precision mediump float;\n#define GLSLIFY 1\nuniform vec2 u_resolution;\nuniform float u_time;\nuniform float u_speed;\nuniform float u_layersCount;\nuniform float u_density;\nuniform float u_size;\nuniform int u_color;\nuniform float u_opacity;\n\nconst float PI = 3.14159265359;\nconst float MAX_DENSITY = 5.0;\n\n// https://gist.github.com/gerard-geer/4d0be4fbefabe209c9b5\nvec2 rand(vec2 uv) {\n    return vec2(\n        fract(sin(dot(uv.xy ,vec2(12.9898,78.233))) * 43758.5453),\n        fract(cos(dot(uv.yx ,vec2(8.64947,45.097))) * 43758.5453)\n    );\n}\n\nvec2 shift(float speedCoef) {\n    float xShift = (u_time * u_speed * speedCoef)/ u_resolution.x;\n    float yShift = (u_time * u_speed * speedCoef) / u_resolution.y;\n\n    return vec2(xShift, sin(yShift/10.0));\n}\n\nvec2 rotate(vec2 uv, float angle) {\n    mat2 rotationMatrix = mat2(\n        cos(angle), -sin(angle),\n        sin(angle), cos(angle)\n    );\n\n    return rotationMatrix * uv;\n}\n\nfloat drawSnowFlake(vec2 uv, float angle, float layerNumber) {\n\n    float scale = (u_layersCount + 1.0 - layerNumber) / u_layersCount;\n    float sizeScale = layerNumber / u_layersCount;\n\n    // 1. split clipspace in 4*(snowflake size) parts\n    float clipSpaceScaleCoeff =  4.0;\n    vec2 splitCount = u_resolution / vec2(u_size * sizeScale * clipSpaceScaleCoeff);\n    uv *= splitCount;\n\n    // 2. transform snow movement\n    uv = rotate(uv, angle) + shift(scale);\n\n    // 3. get random position\n    vec2 integerCoord = floor(uv);\n    vec2 fractionalCoord = fract(uv);\n    vec2 randomCoord = rand(integerCoord);\n\n    // 4. remove some cells to get uniform density\n    float minRadius = u_density * scale * sqrt(2.0) / MAX_DENSITY;\n    if (length(randomCoord) > minRadius) return 0.0;\n\n    // 5. to get more random distribution,\n    // we assume, that snowflake size is 1/8 part of cell\n    // then we get random coords between 0.125 and 0.875,\n    // so that's why generated snowflakes in different cells are not overlapping\n    float radius = 0.125;\n    vec2 normalizedRandomCoord = mix(vec2(radius), vec2(1.0 - radius), randomCoord);\n\n    vec2 position = fractionalCoord - normalizedRandomCoord;\n\n    // 6. now snowflakes are just simple dots\n    // we smooth dots edges, to make them more snow-alike\n    return 1.0 - smoothstep(radius*(.10),radius*(sqrt(2.0)), length(position));\n}\n\nvec3 getColor(int color) {\n    float red = float(color / 256 / 256);\n    float green = float(color / 256 - int(red * 256.0));\n    float blue = float(color - int(red * 256.0 * 256.0) - int(green * 256.0));\n\n    return vec3(red / 255.0, green / 255.0, blue / 255.0);\n}\n\nvoid main() {\n    vec2 uv = gl_FragCoord.xy/u_resolution;\n\n    float scale = 1.0;\n    float sizeScale = 1.0 / u_layersCount;\n    float mask = drawSnowFlake(uv, PI * 3.0/8.0, 1.0);\n\n    if (u_layersCount >= 2.0) {\n        scale = 4.0 / u_layersCount;\n        sizeScale = 2.0 / u_layersCount;\n        mask += drawSnowFlake(uv, PI * 5.0/8.0, 2.0);\n    }\n\n    if (u_layersCount >= 3.0) {\n        scale = 3.0 / u_layersCount;\n        sizeScale = 3.0 / u_layersCount;\n        mask += drawSnowFlake(uv, PI * 1.0/8.0, 3.0);\n    }\n\n    if (u_layersCount >= 4.0) {\n        scale = 2.0 / u_layersCount;\n        sizeScale = 4.0 / u_layersCount;\n        mask += drawSnowFlake(uv, PI * 7.0/8.0, 4.0);\n    }\n\n    if (u_layersCount >= 5.0) {\n        scale = 1.0 / u_layersCount;\n        sizeScale = 5.0 / u_layersCount;\n        mask += drawSnowFlake(uv, PI * 4.0/8.0, 5.0);\n    }\n\n    vec3 color = mask * getColor(u_color);\n    float alpha = mask * u_opacity;\n\n    gl_FragColor = vec4(color, alpha);\n}\n"]);

// var vertexShader = require('raw-loader!glslify-loader!./shaders/vertex.glsl')
// var fragmentShader = require('raw-loader!glslify-loader!./shaders/fragment.glsl')
L.Snow = L.Polygon.extend({
  options: {
    speed: 50,
    layersCount: 1,
    density: 1,
    size: 10,
    color: 'Oxffffff',
    opacity: 1,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  },
  onAdd: function onAdd(map) {
    var canvas, gl;
    this._map = map;
    if (!this._canvas) {
      canvas = this._canvas = this._initCanvas(map);
      gl = this._gl = this._initWebGl(canvas);
    }
    this._initShaders(gl);
    if (gl) {
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
    if (this.options.pane) {
      this.getPane().appendChild(canvas);
    } else {
      map._panes.overlayPane.appendChild(canvas);
    }
    map.on('move', this._reset, this);
    map.on('resize', this._resize, this);
    if (map.options.zoomAnimation && L.Browser.any3d) {
      map.on('zoomanim', this._animateZoom, this);
    }
    this._reset();
  },
  onRemove: function onRemove(map) {
    var canvas = this._canvas;
    if (this.options.pane) {
      this.getPane().removeChild(canvas);
    } else {
      map.getPanes().overlayPane.removeChild(canvas);
    }
    map.off('moveend', this._reset, this);
    if (map.options.zoomAnimation) {
      map.off('zoomanim', this._animateZoom, this);
    }
  },
  addTo: function addTo(map) {
    map.addLayer(this);
    return this;
  },
  drawScene: function drawScene() {
    var buf,
      polygonsCount,
      currentIndex = 0,
      count = 0;
    var gl = this._gl;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    polygonsCount = this._latlngs.length;
    for (var i = 0; i < polygonsCount; i++) {
      var polygonLanLngs = this._latlngs[i];
      count = polygonLanLngs.length;
      this._updateMatrix(gl);
      gl.drawArrays(gl.TRIANGLE_FAN, currentIndex, count);
      currentIndex += count;
    }
  },
  render: function render() {
    var gl = this._gl,
      time = L.Util.requestAnimFrame(this.render.bind(this)),
      timeLocation = gl.getUniformLocation(this.shaderProgram, "u_time");
    gl.uniform1f(timeLocation, time);
    this.drawScene();
  },
  setSpeed: function setSpeed(speed) {
    var gl = this._gl,
      speedLocation = gl.getUniformLocation(this.shaderProgram, "u_speed");
    this.options.speed = speed;
    gl.uniform1f(speedLocation, speed);
    this._redraw();
  },
  setLayersCount: function setLayersCount(layersCount) {
    var gl = this._gl,
      layersCountLocation = gl.getUniformLocation(this.shaderProgram, "u_layersCount");
    this.options.layersCount = layersCount;
    gl.uniform1f(layersCountLocation, layersCount);
    this._redraw();
  },
  setDensity: function setDensity(density) {
    var gl = this._gl,
      densityLocation = gl.getUniformLocation(this.shaderProgram, "u_density");
    this.options.density = density;
    gl.uniform1f(densityLocation, density);
    this._redraw();
  },
  setSize: function setSize(size) {
    var gl = this._gl,
      sizeLocation = gl.getUniformLocation(this.shaderProgram, "u_size");
    this.options.size = size;
    gl.uniform1f(sizeLocation, size);
    this._redraw();
  },
  setColor: function setColor(color) {
    var gl = this._gl,
      colorLocation = gl.getUniformLocation(this.shaderProgram, "u_color");
    if (color[0] === '#') {
      color = color.replace('#', '0x');
      this.options.color = color;
      gl.uniform1i(colorLocation, color);
      this._redraw();
    }
  },
  setOpacity: function setOpacity(opacity) {
    var gl = this._gl,
      opacityLocation = gl.getUniformLocation(this.shaderProgram, "u_opacity");
    this.options.opacity = opacity;
    gl.uniform1f(opacityLocation, opacity);
    this._redraw();
  },
  _initCanvas: function _initCanvas() {
    var canvas = L.DomUtil.create('canvas', 'webgl-canvas leaflet-layer');
    var originProp = L.DomUtil.testProp(['transformOrigin', 'WebkitTransformOrigin', 'msTransformOrigin']);
    canvas.style[originProp] = '50% 50%';
    var size = this._map.getSize();
    canvas.width = size.x;
    canvas.height = size.y;
    canvas.style.position = 'absolute';
    var animated = this._map.options.zoomAnimation && L.Browser.any3d;
    L.DomUtil.addClass(canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));
    return canvas;
  },
  _initShaders: function _initShaders(gl) {
    var _this$options = this.options,
      vertexShader = _this$options.vertexShader,
      fragmentShader = _this$options.fragmentShader,
      speed = _this$options.speed,
      layersCount = _this$options.layersCount,
      density = _this$options.density,
      size = _this$options.size,
      color = _this$options.color,
      opacity = _this$options.opacity,
      vShader = this._getShader("vertex", vertexShader),
      fShader = this._getShader("fragment", fragmentShader),
      shaderProgram = this.shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vShader);
    gl.attachShader(shaderProgram, fShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("Unable to initialize the shader program.");
    }
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.useProgram(shaderProgram);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    var speedLocation = gl.getUniformLocation(shaderProgram, "u_speed"),
      layersCountLocation = gl.getUniformLocation(shaderProgram, "u_layersCount"),
      densityLocation = gl.getUniformLocation(shaderProgram, "u_density"),
      sizeLocation = gl.getUniformLocation(shaderProgram, "u_size"),
      colorLocation = gl.getUniformLocation(shaderProgram, "u_color"),
      opacityLocation = gl.getUniformLocation(shaderProgram, "u_opacity");

    // угол дождя
    gl.uniform1f(speedLocation, speed);
    gl.uniform1f(layersCountLocation, layersCount);
    gl.uniform1f(densityLocation, density);
    gl.uniform1f(sizeLocation, size);
    if (color[0] === '#') {
      this.options.color = color.replace('#', '0x');
    }
    gl.uniform1i(colorLocation, this.options.color);
    gl.uniform1f(opacityLocation, opacity);
    this.render();
  },
  _initWebGl: function _initWebGl(canvas) {
    var gl = null;
    try {
      gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    } catch (e) {}
    if (!gl) {
      console.warn("Unable to initialize WebGL. Your browser may not support it.");
      gl = null;
    }
    return gl;
  },
  _getShader: function _getShader(type, source) {
    var gl = this._gl,
      shader = gl.createShader(type == "vertex" ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
    if (!type) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  },
  _updateMatrix: function _updateMatrix(gl) {
    var matrixLocation = gl.getUniformLocation(this.shaderProgram, "u_matrix"),
      map = this._map,
      center = map.getCenter(),
      zoom = map.getZoom(),
      crs = map.options.crs,
      CRSCenter = crs.project(center),
      x = CRSCenter.x,
      y = CRSCenter.y,
      pxSize = crs.transformation.untransform(L.point([1, 1]), 1),
      mapSize = map.getSize(),
      CRSUnitsPerPx = mapSize.divideBy(crs.scale(zoom)),
      half = pxSize.scaleBy(CRSUnitsPerPx),
      transformMatrix = _matrixUtils["default"].identityMatrix(),
      translationMatrix = _matrixUtils["default"].translationMatrix([-x, -y, 0]),
      scaleMatrix = _matrixUtils["default"].scaleMatrix([1 / half.x, -1 / half.y, 1]);
    transformMatrix = _matrixUtils["default"].matrixMultiply(transformMatrix, translationMatrix);
    transformMatrix = _matrixUtils["default"].matrixMultiply(transformMatrix, scaleMatrix);
    gl.uniformMatrix4fv(matrixLocation, false, transformMatrix);
  },
  _reset: function _reset() {
    var topLeft = this._map.containerPointToLayerPoint([0, 0]);
    L.DomUtil.setPosition(this._canvas, topLeft);
    this._redraw();
  },
  _resize: function _resize(e) {
    var size = e.newSize;
    this._canvas.width = size.x;
    this._canvas.height = size.y;
    this._reset();
  },
  _redraw: function _redraw() {
    var gl = this._gl,
      positionLocation = gl.getAttribLocation(this.shaderProgram, "a_position"),
      projectLatLng = this._projectLatLng.bind(this),
      bufArray = [].concat.apply([], this._latlngs).map(function (ll) {
        return projectLatLng(ll);
      }).reduce(function (previousValue, currentValue) {
        return previousValue.concat(currentValue);
      }, []),
      bytesPerVertex = 8,
      buf = gl.createBuffer();
    var resolutionLocation = gl.getUniformLocation(this.shaderProgram, "u_resolution");
    gl.uniform2fv(resolutionLocation, [this._canvas.width, this._canvas.height]);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufArray), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, bytesPerVertex, 0);
  },
  _projectLatLng: function _projectLatLng(latLng) {
    var crsPoint = this._map.options.crs.project(latLng);
    return [crsPoint.x, crsPoint.y];
  },
  _animateZoom: function _animateZoom(e) {
    var scale = this._map.getZoomScale(e.zoom),
      offset = this._map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(this._map._getMapPanePos());
    if (L.DomUtil.setTransform) {
      L.DomUtil.setTransform(this._canvas, offset, scale);
    } else {
      this._canvas.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(offset) + ' scale(' + scale + ')';
    }
  }
});
L.snow = function (latlngs, options) {
  return new L.Snow(latlngs, options);
};

},{"./matrixUtils":3,"glslify":1}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var matrixUtils = {
  matrixMultiply: function matrixMultiply(a, b) {
    var a00 = a[0 * 4 + 0];
    var a01 = a[0 * 4 + 1];
    var a02 = a[0 * 4 + 2];
    var a03 = a[0 * 4 + 3];
    var a10 = a[1 * 4 + 0];
    var a11 = a[1 * 4 + 1];
    var a12 = a[1 * 4 + 2];
    var a13 = a[1 * 4 + 3];
    var a20 = a[2 * 4 + 0];
    var a21 = a[2 * 4 + 1];
    var a22 = a[2 * 4 + 2];
    var a23 = a[2 * 4 + 3];
    var a30 = a[3 * 4 + 0];
    var a31 = a[3 * 4 + 1];
    var a32 = a[3 * 4 + 2];
    var a33 = a[3 * 4 + 3];
    var b00 = b[0 * 4 + 0];
    var b01 = b[0 * 4 + 1];
    var b02 = b[0 * 4 + 2];
    var b03 = b[0 * 4 + 3];
    var b10 = b[1 * 4 + 0];
    var b11 = b[1 * 4 + 1];
    var b12 = b[1 * 4 + 2];
    var b13 = b[1 * 4 + 3];
    var b20 = b[2 * 4 + 0];
    var b21 = b[2 * 4 + 1];
    var b22 = b[2 * 4 + 2];
    var b23 = b[2 * 4 + 3];
    var b30 = b[3 * 4 + 0];
    var b31 = b[3 * 4 + 1];
    var b32 = b[3 * 4 + 2];
    var b33 = b[3 * 4 + 3];
    return [a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30, a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31, a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32, a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33, a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30, a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31, a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32, a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33, a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30, a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31, a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32, a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33, a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30, a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31, a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32, a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33];
  },
  // Returns an identity matrix
  identityMatrix: function identityMatrix() {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  },
  // Returns a translation matrix
  // Offset is a 3-element array
  translationMatrix: function translationMatrix(t) {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, t[0], t[1], t[2], 1];
  },
  // Returns a scale matrix
  // Scale is a 3-element array
  scaleMatrix: function scaleMatrix(s) {
    return [s[0], 0, 0, 0, 0, s[1], 0, 0, 0, 0, s[2], 0, 0, 0, 0, 1];
  }
};
var _default = matrixUtils;
exports["default"] = _default;

},{}]},{},[2]);
