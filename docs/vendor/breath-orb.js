/* SoulCap breath orb — hand-written WebGL soft sphere (~offline vendor).
 * Exposes window.SoulCapOrb = { mount, setBreath, destroy, supported }
 * Falls back silently when WebGL missing; caller keeps CSS orb.
 */
(function (global) {
  'use strict';
  var VS = 'attribute vec2 a;varying vec2 v;void main(){v=a*.5+.5;gl_Position=vec4(a,0.,1.);}';
  var FS = [
    'precision mediump float;',
    'varying vec2 v;',
    'uniform float uT,uBreath,uLum;',
    'uniform vec3 uAccent;',
    'float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
    'float noise(vec2 p){vec2 i=floor(p),f=fract(p);float a=hash(i),b=hash(i+vec2(1.,0.)),c=hash(i+vec2(0.,1.)),d=hash(i+vec2(1.,1.));',
    'vec2 u=f*f*(3.-2.*f);return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;}',
    'void main(){',
    'vec2 p=v*2.-1.;',
    'float r=length(p);',
    'float rad=.78+.08*uBreath;',
    'float d=rad-r;',
    'if(d<-.12){gl_FragColor=vec4(0.);return;}',
    'float soft=smoothstep(0.,.18,d);',
    'float fres=pow(1.-clamp(r/rad,0.,1.),2.2);',
    'float n=noise(p*3.2+uT*.15)+noise(p*7.+uT*.08)*.5;',
    'vec3 col=mix(uAccent*.35,uAccent,soft*.85+n*.12);',
    'col+=uAccent*fres*.55;',
    'float a=soft*(.55+.35*uLum);',
    'gl_FragColor=vec4(col,a);',
    '}'
  ].join('');

  function compile(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  function supported() {
    try {
      var c = document.createElement('canvas');
      return !!(c.getContext('webgl') || c.getContext('experimental-webgl'));
    } catch (e) { return false; }
  }

  function parseAccent() {
    var raw = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#6D5DD3';
    var hex = raw.replace('#', '');
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    if (hex.length !== 6) return [0.43, 0.36, 0.83];
    return [parseInt(hex.slice(0, 2), 16) / 255, parseInt(hex.slice(2, 4), 16) / 255, parseInt(hex.slice(4, 6), 16) / 255];
  }

  function mount(hold, opts) {
    opts = opts || {};
    if (!supported()) return null;
    var canvas = document.createElement('canvas');
    canvas.className = 'orb-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    hold.insertBefore(canvas, hold.firstChild);
    var gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: true }) ||
      canvas.getContext('experimental-webgl', { alpha: true, antialias: true });
    if (!gl) { hold.removeChild(canvas); return null; }

    var vs = compile(gl, gl.VERTEX_SHADER, VS);
    var fs = compile(gl, gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) { hold.removeChild(canvas); return null; }
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { hold.removeChild(canvas); return null; }

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var locA = gl.getAttribLocation(prog, 'a');
    var uT = gl.getUniformLocation(prog, 'uT');
    var uBreath = gl.getUniformLocation(prog, 'uBreath');
    var uLum = gl.getUniformLocation(prog, 'uLum');
    var uAccent = gl.getUniformLocation(prog, 'uAccent');

    var breath = 0.5, lum = 0.7, alive = true, raf = 0, t0 = performance.now();

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var size = Math.min(hold.clientWidth || 210, hold.clientHeight || 210) || 210;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = size + 'px';
      canvas.style.height = size + 'px';
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();

    function frame(now) {
      if (!alive) return;
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;
      var t = (now - t0) / 1000;
      var accent = parseAccent();
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(locA);
      gl.vertexAttribPointer(locA, 2, gl.FLOAT, false, 0, 0);
      gl.uniform1f(uT, t);
      gl.uniform1f(uBreath, breath);
      gl.uniform1f(uLum, lum);
      gl.uniform3f(uAccent, accent[0], accent[1], accent[2]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    raf = requestAnimationFrame(frame);

    return {
      setBreath: function (b, l) {
        breath = typeof b === 'number' ? Math.max(0, Math.min(1, b)) : breath;
        if (typeof l === 'number') lum = Math.max(0.2, Math.min(1, l));
      },
      resize: resize,
      destroy: function () {
        alive = false;
        cancelAnimationFrame(raf);
        try { hold.removeChild(canvas); } catch (e) {}
      },
      canvas: canvas
    };
  }

  global.SoulCapOrb = { mount: mount, supported: supported };
})(this);
