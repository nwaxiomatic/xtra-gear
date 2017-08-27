"use strict";

function resizeVideo(){
    var h = $(document).height();
    var w = $(document).width();
    var centerBox = $('canvas');
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

var textures = twgl.createTextures(gl, {
	face: { src: "static/img/xtra.png" },
  cloud1: { src: "static/img/cloud.jpg" },
  cloud2: { src: "static/img/cloud2.jpg" },
  cloud3: { src: "static/img/cloud3.jpg" },
});

var arrays = {
  position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
};
var bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

function render(time) {
  twgl.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  var shadowAmt = 10 * (1 + Math.sin(time / 1000.0) ) / 2.0 + 4.0;
  $('canvas').css({
    'box-shadow' : "0px 0px " + shadowAmt + "px " + shadowAmt + "px #fff"
  });

  var uniforms = {
    time: time * 0.001,
    resolution: [gl.canvas.width, gl.canvas.height],
    tex: textures.face,
    phase_tex_r: textures.cloud1,
    phase_tex_g: textures.cloud2,
    phase_tex_b: textures.cloud3,
  };

  gl.useProgram(programInfo.program);
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  twgl.setUniforms(programInfo, uniforms);
  twgl.drawBufferInfo(gl, bufferInfo);

  requestAnimationFrame(render);
}
requestAnimationFrame(render);
