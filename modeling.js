/*
CS435
Project 3
Zackary Bowling
*/

/*
This program builds a 3D gas price sign for a gas station
This sign has three types of gas and the price for each type
of gas should be able to be changed, whether it is increased
or decreased. The sign also rotates at the click of a start button
and then and stops when stop is pressed.
*/
"use strict";

function orthoExample() {

var canvas;
var gl;

var rotating = false;
var numVertices  = 0;

var positionsArray = [];
var colorsArray = [];

var prism_verts = [
        vec4(-0.25, -0.4,  0.5, 1.0),
        vec4(-0.25,  0.4,  0.5, 1.0),
        vec4(0.25,  0.4,  0.5, 1.0),
        vec4(0.25, -0.4,  0.5, 1.0),
        vec4(-0.25, -0.4, -0.75, 1.0),
        vec4(-0.25,  0.4, -0.75, 1.0),
        vec4(0.25,  0.4, -0.75, 1.0),
        vec4(0.25, -0.4, -0.75, 1.0),
    ];

var prism_colors = [
        vec4(0.0, 0.0, 0.0, 1.0),  
        vec4(1.0, 0.0, 0.0, 1.0),  
        vec4(1.0, 1.0, 0.0, 1.0),  
        vec4(0.0, 1.0, 0.0, 1.0),  
        vec4(0.0, 0.0, 1.0, 1.0),  
        vec4(1.0, 0.0, 1.0, 1.0),  
        vec4(0.0, 1.0, 1.0, 1.0),  
        vec4(1.0, 1.0, 1.0, 1.0),  
    ];

var one_template = "000XXXX0XXXX0XXXX0XX00000";

var two_template = "00000XXXX0000000XXXX00000";
   
var three_template = "00000XXXX000000XXXX000000";  

var four_template = "0XXX00XXX000000XXXX0XXXX0";

var five_template = "000000XXXX00000XXXX000000";

var six_template =  "000000XXXX000000XXX000000";
  
var seven_template = "00000XXXX0XXXX0XXXX0XXXX0";
 
var eight_template = "000000XXX0000000XXX000000";
  
var nine_template = "000000XXX000000XXXX000000";
 
var zero_template = "000000XXX00XXX00XXX000000"
  
var a_template = "XX0XXX0X0X000000XXX00XXX0";

var e_template = "000000XXXX000XX0XXXX00000";

var i_template = "00000XX0XXXX0XXXX0XX00000";

var u_template = "0XXX00XXX00XXX00XXX000000";

var m_template = "0XXX000X000X0X00X0X00X0X0";

var d_template = "0000X0XXX00XXX00XXX00000X";

var r_template = "0000X0XXX00000X0XXX00XXX0";

var s_template = five_template;

var p_template = "0000X0XXX00000X0XXXX0XXXX";

var g_template = "000000XXXX0XX000XXX000000";

var l_template = "0XXXX0XXXX0XXXX0XXXX00000";

var n_template = "0XXX000XX00X0X00XX000XXX0";

var template_map = {
    0 : zero_template,
    1 : one_template,
    2 : two_template,
    3 : three_template,
    4 : four_template,
    5 : five_template,
    6 : six_template,
    7 : seven_template,
    8 : eight_template,
    9 : nine_template,
    'a' : a_template,
    'e' : e_template,
    'i' : i_template,
    'u' : u_template,
    'm' : m_template,
    'd' : d_template,
    'r' : r_template,
    's' : s_template,
    'p' : p_template,
    'g' : g_template,
    'l' : l_template,
    'n' : n_template
};

var mouse_down = false;
var t1;

var near = -1;
var far = 1;
var radius = 0.1;
var theta = 0.0;
var phi = 1.0;
var dr = 5.0 * Math.PI/180.0;

var left = -1.0;
var right = 1.0;
var top = 1.0;
var bottom = -1.0;

var modelViewMatrixLoc, projectionMatrixLoc;
var modelViewMatrix, projectionMatrix;
var eye;

const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

// Set face color

function quad(a, b, c, d, e, prism_verts) {

     positionsArray.push(prism_verts[a]);  
     colorsArray.push(prism_colors[e]);
     positionsArray.push(prism_verts[b]);
     colorsArray.push(prism_colors[e]);
     positionsArray.push(prism_verts[c]);


     colorsArray.push(prism_colors[e]);
     positionsArray.push(prism_verts[a]);
     colorsArray.push(prism_colors[e]);
     positionsArray.push(prism_verts[c]);
     colorsArray.push(prism_colors[e]);
     positionsArray.push(prism_verts[d]);
     colorsArray.push(prism_colors[e]);

     numVertices+=6;
}

// Triangle setting

function colorCube()
{
    quad(1, 0, 3, 2, 0, prism_verts);
    quad(2, 3, 7, 6, 4, prism_verts); 
    quad(3, 0, 4, 7, 0, prism_verts);
    quad(6, 5, 1, 2, 0, prism_verts);
    quad(4, 5, 6, 7, 0, prism_verts);
    quad(5, 4, 0, 1, 4, prism_verts); 

}

function text_cube(color, prism_verts)
{   
    quad(1, 0, 3, 2, color, prism_verts);
    quad(2, 3, 7, 6, color, prism_verts); 
    quad(3, 0, 4, 7, color, prism_verts);
    quad(6, 5, 1, 2, color, prism_verts);
    quad(4, 5, 6, 7, color, prism_verts);
    quad(5, 4, 0, 1, color, prism_verts); 

}

var price_board_index = 30;
var digit_offset = 0.15;
var number_size = 0.1;

// Setting gas types
var gas_types = [
    [
        u_template,
        n_template,
        l_template,
        e_template,
        a_template,
        d_template,
        e_template,
        d_template
    ],

    [
        m_template,
        i_template,
        d_template,
        g_template,
        r_template,
        a_template,
        d_template,
        e_template
    ],
 
    [
        s_template,
        u_template,
        p_template,
        r_template,
        e_template,
        m_template,
        e_template
    ]

]

var letter_size = number_size / 2;

function render_names(price_board_index){
    let pbv_bl = positionsArray[price_board_index+1];
    let pbv_br = positionsArray[price_board_index+2];
    let pbv_tl = positionsArray[price_board_index];
    let pbv_tr = positionsArray[price_board_index+5];

    let curr_pos, curr_digit, mirror_pos;

    curr_pos = vec4(pbv_tr[0], pbv_tr[1], pbv_tr[2], 1.0);


    mirror_pos = vec4(pbv_tr[0], pbv_tr[1], pbv_tr[2], 1.0);

    let height_offset = (pbv_tl[1] - pbv_bl[1]) / 3.5;
    
    var u_start = vec4(pbv_tr[0] + 0.6, pbv_tr[1] - 0.224, pbv_tr[2] - 0.25, 1.0);

    var mirror_start = vec4(pbv_tr[0] - 0.5, pbv_tr[1] - 0.224, pbv_tr[2] - 0.25, 1.0);

    // Back of the sign 
    for(var i = 0; i < 3; i++){
    
        for(var j = 0; j < gas_types[i].length; j++){
            curr_pos[0] = u_start[0] - (j*digit_offset/2);
            curr_pos[1] = u_start[1] - (height_offset * i);
            curr_pos[2] = u_start[2] * 1.05;

            mirror_pos[0] = mirror_start[0] + (j*digit_offset/2);
            mirror_pos[1] = mirror_start[1] - (height_offset * i);
            mirror_pos[2] = -mirror_start[2] * 1.05;
            
            draw_template(letter_size, gas_types[i][j], curr_pos[2], curr_pos[1], curr_pos[0]);
            draw_template(letter_size, gas_types[i][j], mirror_pos[2], mirror_pos[1], mirror_pos[0], 1);
        }
    }
}

function render_prices(unlead, mid, supreme, price_board_index){
    let pbv_bl = positionsArray[price_board_index+1];
    let pbv_br = positionsArray[price_board_index+2];
    let pbv_tl = positionsArray[price_board_index];
    let pbv_tr = positionsArray[price_board_index+5];

    let curr_pos, curr_digit, mirror_pos;

    curr_pos = vec4(pbv_tr[0], pbv_tr[1], pbv_tr[2], 1.0);
    mirror_pos = vec4(pbv_tr[0], pbv_tr[1], pbv_tr[2], 1.0);

    let u = String(unlead).padStart(3,'0');
    let m = String(mid).padStart(3,'0');
    let s = String(supreme).padStart(3,'0');

    let height_offset = (pbv_tl[1] - pbv_bl[1]) / 3.5;
    
    
    var u_price_start = vec4(pbv_tr[0] - 0.25, pbv_tr[1] - 0.3, pbv_tr[2] - 0.25, 1.0);
    var m_price_start = vec4(pbv_tr[0] - 0.25, u_price_start[1] - height_offset , pbv_tr[2] - 0.25, 1.0);
    var s_price_start = vec4(pbv_tr[0] - 0.25, u_price_start[1] -  2*height_offset , pbv_tr[2] - 0.25, 1.0);

    var u_price_start_m = vec4(pbv_tr[0] + 0.25, pbv_tr[1] - 0.3, pbv_tr[2] - 0.25, 1.0);
    var m_price_start_m = vec4(pbv_tr[0] + 0.25, u_price_start[1] - height_offset , pbv_tr[2] - 0.25, 1.0);
    var s_price_start_m = vec4(pbv_tr[0] + 0.25, u_price_start[1] -  2*height_offset , pbv_tr[2] - 0.25, 1.0);

    // Front of sign
    for(var i = 0; i < 3; i++){
        for(var j = 0; j < 3; j++){
            switch(i){
                case 0:
                    curr_pos[0] = u_price_start[0] - (j*digit_offset);
                    curr_pos[1] = u_price_start[1];
                    curr_pos[2] = u_price_start[2] * 1.05;

                    mirror_pos[0] = u_price_start_m[0] + (j*digit_offset);
                    mirror_pos[1] = u_price_start_m[1];
                    mirror_pos[2] = u_price_start_m[2] * -1.05;
    

                    curr_digit = Number(u.charAt(j));
                    draw_template(number_size, template_map[curr_digit], curr_pos[2], curr_pos[1], curr_pos[0], 0);
                    draw_template(number_size, template_map[curr_digit], mirror_pos[2], mirror_pos[1], mirror_pos[0], 1);
                    break;
                case 1:
                    curr_pos[0] = m_price_start[0] - (j*digit_offset);
                    curr_pos[1] = m_price_start[1];
                    curr_pos[2] = m_price_start[2]* 1.05;
                    
                    mirror_pos[0] = m_price_start_m[0] + (j*digit_offset);
                    mirror_pos[1] = m_price_start_m[1];
                    mirror_pos[2] = m_price_start_m[2] * -1.05;
                    curr_digit = Number(m.charAt(j));
                    
                    draw_template(number_size, template_map[curr_digit], curr_pos[2], curr_pos[1], curr_pos[0]);
                    draw_template(number_size, template_map[curr_digit], mirror_pos[2], mirror_pos[1], mirror_pos[0], 1);
                    break;

                case 2:
                    curr_pos[0] = s_price_start[0] - (j*digit_offset);
                    curr_pos[1] = s_price_start[1];
                    curr_pos[2] = s_price_start[2]* 1.05;

                    mirror_pos[0] = s_price_start_m[0] + (j*digit_offset);
                    mirror_pos[1] = s_price_start_m[1];
                    mirror_pos[2] = s_price_start_m[2] * -1.05;
                    curr_digit = Number(s.charAt(j));

                    draw_template(number_size, template_map[curr_digit], curr_pos[2], curr_pos[1], curr_pos[0]);
                    draw_template(number_size, template_map[curr_digit], mirror_pos[2], mirror_pos[1], mirror_pos[0], 1);
                    break;
            }
        }
    }
    
};

function draw_template(size, template, x_pos, y_pos, z_pos, orient = 0){
    let template_index = 0;

    let start_x, start_y, start_z, step_size, square_size;

    if(orient === 0){
        start_x = x_pos + (((3*size)/5) * Math.sqrt(2));
        start_y = y_pos + (((3*size)/5) * Math.sqrt(2));
        start_z = z_pos + (((3*size)/5) * Math.sqrt(2));
    
        // Setting scale size
        step_size = size / 5;
        square_size = size / 10.1;
    
        for(var y = 5; y > 0; y--){
            for(var x = 5; x > 0; x--){
                if(template.charAt(template_index) === '0'){
    
                    let xp = start_x + (step_size * x)
                    let yp = start_y + (step_size * y)
                    let zp = start_z + (step_size * x)
                    
                    make_cube(x_pos, yp, zp, square_size * .90);
                }
                template_index++;
            }
        }
    } else {
        start_x = x_pos + (((3*size)/5) * Math.sqrt(2));
        start_y = y_pos + (((3*size)/5) * Math.sqrt(2));
        start_z = z_pos + (((3*size)/5) * Math.sqrt(2));
    
        step_size = size / 5;
        square_size = size / 10.1;
    
        for(var y = 5; y > 0; y--){
            for(var x = 0; x < 5; x++){
                if(template.charAt(template_index) === '0'){
    
                    let xp = start_x + (step_size * x)
                    let yp = start_y + (step_size * y)
                    let zp = start_z + (step_size * x)
                    
                    make_cube(x_pos, yp, zp, square_size * .90);
                }
                template_index++;
            }
        }
    }

}

// Function to make cubes
function make_cube(x,y,z,size){
    
   let verts = [
        vec4(x - size,y - size,z + size,1.0),
        vec4(x - size,y + size,z + size,1.0),
        vec4(x + size,y + size,z + size,1.0),
        vec4(x + size,y - size,z + size,1.0),
        vec4(x - size,y - size,z - size,1.0),
        vec4(x - size,y + size,z - size,1.0),
        vec4(x + size,y + size,z - size,1.0),
        vec4(x + size,y - size,z - size,1.0),
   ];

   text_cube(7, verts);

}

var post_start = vec4(0,-0.4, -0.125, 1.0);

function draw_cylinder(x,y,z, radius, height, partitions){

    let color = prism_colors[7];

    let center_top = vec4(x,y,z,1.0);
    let center_bottom = vec4(x,y - height,z,1.0);

    let tc, t1, t2, bc, b1, b2;

    let top_x, top_z;


    top_x =  x + (radius * Math.cos((Math.PI * 2 * 0)/partitions));

    top_z = z + (radius * Math.sin((Math.PI * 2 * 0)/partitions));

    t1 = vec4(top_x, y, top_z, 1.0);
    b1 = vec4(top_x, y - height, top_z, 1.0);

    for(var i = 1; i <= partitions; i++){
        if(i % 2 === 0) {
            color = prism_colors[0];
        } else {
            color = prism_colors[7];
        }

        top_x = x + (radius * Math.cos((Math.PI * 2 * i)/partitions));

        top_z = z + (radius * Math.sin((Math.PI * 2 * i)/partitions));



        t2 = vec4(top_x, y, top_z, 1.0);
        b2 = vec4(top_x, y - height, top_z, 1.0);
        // Top
        positionsArray.push(center_top);
        positionsArray.push(t1);
        positionsArray.push(t2);

        colorsArray.push(color);
        colorsArray.push(color);
        colorsArray.push(color);

        //Side
        positionsArray.push(t2);
        positionsArray.push(t1);
        positionsArray.push(b1);
        positionsArray.push(t2);
        positionsArray.push(b1);
        positionsArray.push(b2);

        colorsArray.push(color);
        colorsArray.push(color);
        colorsArray.push(color);
        colorsArray.push(color);
        colorsArray.push(color);
        colorsArray.push(color);

        //Bottom
        positionsArray.push(center_bottom);
        positionsArray.push(b1);
        positionsArray.push(b2);

        colorsArray.push(color);
        colorsArray.push(color);
        colorsArray.push(color);

        t1 = t2;
        b1 = b2;


        numVertices+=12;
    }

}

var unlead_price = 249;
var mid_price = 289;
var supreme_price = 329; 


window.onload = function init() {
    colorCube();
    render_names(price_board_index);
    render_prices(unlead_price, mid_price, supreme_price, price_board_index);
    draw_cylinder(post_start[0], post_start[1], post_start[2], 0.05, 0.75, 16);
    



    // Rotation Button

    document.getElementById("Button1").onclick = function(){
        unlead_price+=1;
        numVertices = 0;

        colorsArray.length=0;
        positionsArray.length=0;

        colorCube();
        render_prices(unlead_price, mid_price, supreme_price,price_board_index);
        render_names(price_board_index);
        draw_cylinder(post_start[0], post_start[1], post_start[2], 0.05, 0.75, 16);

    };
    document.getElementById("Button2").onclick = function(){
        mid_price+=1;
        numVertices = 0;

        colorsArray.length=0;
        positionsArray.length=0;

        colorCube();
        render_prices(unlead_price, mid_price, supreme_price,price_board_index);
        render_names(price_board_index);
        draw_cylinder(post_start[0], post_start[1], post_start[2], 0.05, 0.75, 16);
    };
    document.getElementById("Button3").onclick = function(){
        supreme_price+=1;
        numVertices = 0;

        colorsArray.length=0;
        positionsArray.length=0;

        colorCube();
        render_prices(unlead_price, mid_price, supreme_price,price_board_index);
        render_names(price_board_index);
        draw_cylinder(post_start[0], post_start[1], post_start[2], 0.05, 0.75, 16);
    };
    document.getElementById("Button4").onclick = function(){
        unlead_price-=1;
        numVertices = 0;

        colorsArray.length=0;
        positionsArray.length=0;

        colorCube();
        render_prices(unlead_price, mid_price, supreme_price, price_board_index);
        render_names(price_board_index);
        draw_cylinder(post_start[0], post_start[1], post_start[2], 0.05, 0.75, 16);
    };
    document.getElementById("Button5").onclick = function(){
        mid_price-=1;
        numVertices = 0;

        colorsArray.length=0;
        positionsArray.length=0;

        colorCube();
        render_prices(unlead_price, mid_price, supreme_price, price_board_index);
        render_names(price_board_index);
        draw_cylinder(post_start[0], post_start[1], post_start[2], 0.05, 0.75, 16);
    };
    document.getElementById("Button6").onclick = function(){
        supreme_price-=1;
        numVertices = 0;

        colorsArray.length=0;
        positionsArray.length=0;

        colorCube();
        render_prices(unlead_price, mid_price, supreme_price, price_board_index);
        render_names(price_board_index);
        draw_cylinder(post_start[0], post_start[1], post_start[2], 0.05, 0.75, 16);
    };
    var interval_id;
    document.getElementById("toggle").onclick = function(){
        if(rotating){
             clearInterval(interval_id)
             rotating = false;
             document.getElementById("toggle").textContent = "Start!"
        } else {
             interval_id = setInterval(rotate_x(0.1), 10);
             rotating = true;
             document.getElementById("toggle").textContent = "Stop!"
        }

    };

    document.getElementById("gl-canvas").addEventListener("mousedown", function(event){
        var x = event.pageX - canvas.offsetLeft;
        var y = event.pageY - canvas.offsetTop;
        t1 = vec2(2*x/canvas.width-1, 2*(canvas.height-y)/canvas.height-1);

        mouse_down = true;
    });

    document.getElementById("gl-canvas").addEventListener("mouseup", function(event){
        mouse_down = false;
    });

    document.getElementById("gl-canvas").addEventListener("mousemove", function(event){
        if (mouse_down) {
            var x = event.pageX - canvas.offsetLeft;
            var y = event.pageY - canvas.offsetTop;
  
            let t2 = vec2(2*x/canvas.width-1, 2*(canvas.height-y)/canvas.height-1);
                
            let diff_x = t2[0] - t1[0];
            let diff_y = t2[1] - t1[1];
            
            if (diff_x > 0){
                rotate_x(0.1);
            }
            if (diff_x < 0){
                rotate_x(-0.1);
            }
            if (diff_y > 0){
                rotate_y(0.1);
            }
            if (diff_y < 0){
                rotate_y(-0.1);
            }
            t1 = t2;
          }
    });

    console.log('H');
    render();
}

function rotate_x(num){
    phi+=num
}

function rotate_y(num){
    theta+=num;
}



var render = function() {
        canvas = document.getElementById("gl-canvas");
        if(rotating){
            phi+=0.01;
        }
        gl = canvas.getContext('webgl2');
        if (!gl) alert("WebGL 2.0 isn't available");

        gl.viewport(0, 0, canvas.width, canvas.height);

        gl.clearColor(0.86, 0.08, 0.24, 1.0);
        gl.enable(gl.DEPTH_TEST);

        // Shades
        var program = initShaders(gl, "vertex-shader", "fragment-shader");
        gl.useProgram(program);

        var cBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

        var colorLoc = gl.getAttribLocation(program, "aColor");
        gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(colorLoc);

        var vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);

        var positionLoc = gl.getAttribLocation(program, "aPosition");
        gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionLoc);

        modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix");
        projectionMatrixLoc = gl.getUniformLocation(program, "uProjectionMatrix");

        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        eye = vec3(radius*Math.sin(phi), radius*Math.sin(theta),
             radius*Math.cos(phi));

        modelViewMatrix = lookAt(eye, at , up);
        projectionMatrix = ortho(left, right, bottom, top, near, far);


        gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
        gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

        gl.drawArrays(gl.TRIANGLES, 0, numVertices);
        requestAnimationFrame(render);
    }
}
orthoExample();