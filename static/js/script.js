"use strict";

function resizeVideo(){
    var h = $(document).height();
    var w = $(document).width();
    var centerBox = $('.center-box');
    var size = '70';
    if(h > w){
        centerBox.css({
            'width' : size + 'vw',
            'height' : size + 'vw',
        })
    }
    else {
        centerBox.css({
            'width' : size + 'vh',
            'height' : size + 'vh',
        })
    }
}

$(window).resize(resizeVideo);
$(window).resize();

var gl = twgl.getWebGLContext(document.getElementById("c"));
var programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);

var gl2 = twgl.getWebGLContext(document.getElementById("c2"));
var programInfo2 = twgl.createProgramInfo(gl2, ["vs", "fs2"]);
var textures2 = null;
var textures = twgl.createTextures(gl, {
	face: { src: "static/img/xtra.png" },
  irridescent: { src: "static/img/holo2.jpg" },
  cloud1: { src: "static/img/cloud.jpg" },
  cloud2: { src: "static/img/cloud2.jpg" },
  cloud3: { src: "static/img/cloud3.jpg" },
}, function(){
    textures2 = twgl.createTextures(gl2, {
      tex: { src: "static/img/holo2.jpg" },
      irridescent: { src: "static/img/holo1.jpg" },
      cloud1: { src: "static/img/cloud.jpg" },
    }, function(){
      $('.container').addClass('shown');
      requestAnimationFrame(render);
  });
});

var arrays = {
  position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
};
var bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
var bufferInfo2 = twgl.createBufferInfoFromArrays(gl2, arrays);

function render(time) {
  twgl.resizeCanvasToDisplaySize(gl.canvas);
  twgl.resizeCanvasToDisplaySize(gl2.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl2.viewport(0, 0, gl2.canvas.width, gl2.canvas.height);

  var shadowAmt = 10 * (1 + Math.sin(time / 1000.0) ) / 2.0 + 4.0;
  $('.breathe').css({
    'box-shadow' : "0px 0px " + shadowAmt + "px " + shadowAmt + "px #000"
  });

  var uniforms = {
    time: time * 0.001,
    resolution: [gl.canvas.width, gl.canvas.height],
    tex: textures.face,
    irridescent: textures.irridescent,
    phase_tex_r: textures.cloud1,
    phase_tex_g: textures.cloud2,
    phase_tex_b: textures.cloud3,
  };

  var uniforms2 = {
    time: time * 0.001,
    resolution: [gl2.canvas.width, gl2.canvas.height],
    tex: textures2.tex,
    irridescent: textures2.irridescent,
    phase_tex_r: textures2.cloud1,
  };

  gl.useProgram(programInfo.program);
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  twgl.setUniforms(programInfo, uniforms);
  twgl.drawBufferInfo(gl, bufferInfo);

  gl2.useProgram(programInfo2.program);
  twgl.setBuffersAndAttributes(gl2, programInfo2, bufferInfo2);
  twgl.setUniforms(programInfo2, uniforms2);
  twgl.drawBufferInfo(gl2, bufferInfo2);

  requestAnimationFrame(render);
}
