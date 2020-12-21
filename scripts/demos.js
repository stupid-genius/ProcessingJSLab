var demos = {
	'ants': function(){
	},
	'boids': function(){
		var canvasWidth = this.getProperty('canvasWidth');
		var canvasHeight = this.getProperty('canvasHeight');
		var pjs = this.getProcessing();

		var MAX_DX = 5;
		var ACCEL_RATE = 0.5;
		var TURN_RATE = 0.1;
		var ps = new ParticleJS(pjs, function(){
			this.state = 0;

			this.dddx = random(0, 2)*ACCEL_RATE;
			this.dddy = random(0, 2)*ACCEL_RATE;

			this.ddx = random(-TURN_RATE, TURN_RATE)*this.dddx;
			this.ddy = random(-TURN_RATE, TURN_RATE)*this.dddy;
			var xSpeed = Math.abs(this.dx)-MAX_DX;
			var ySpeed = Math.abs(this.dy)-MAX_DX;
			if(xSpeed > 0){
				this.ddx+=-this.dx*ACCEL_RATE;
			}
			if(ySpeed > 0){
				this.ddy+=-this.dy*ACCEL_RATE;
			}

			// don't control here 
			this.dx+=this.ddx;
			this.dy+=this.ddy;
			// shh...just let it happen...
			this.x+=this.dx;
			this.y+=this.dy;

			if(this.x>=canvasWidth-1){
				this.x=canvasWidth-1;
				this.dx*=-1;
			}else if(this.x<0){
				this.x=0;
				this.dx*=-1;
			}
			if(this.y>=canvasHeight-1){
				this.y=canvasHeight-1;
				this.dy*=-1;
			}else if(this.y<0){
				this.y=0;
				this.dy*=-1;
			}
		});

		for(var i=0; i<10; ++i){
			// ttl, x, y, dx, dy, r, g, b, a
			ps.createParticle(0, canvasWidth/2, canvasHeight/2, random(-0.5, 0.5), random(-0.5, 0.5), 255, 255, 255, 255);
		}

		pjs.stroke(0, 0, 0, 255);
		this.draw = function(){
			pjs.background(0);
			ps.render();
		};
		pjs.loop();
	},
	'bz': function(){
		var pjs = this.getProcessing();
		var canvasWidth = this.getProperty('canvasWidth');
		var canvasHeight = this.getProperty('canvasHeight');

		var controls = Array.apply(null, Array(8)).map(function(){
			return Math.random()*canvasWidth;
		});
		var controls2 = Array.apply(null, Array(8)).map(function(){
			return Math.random()*canvasWidth;
		});
		var velocities = Array.apply(null, Array(8)).map(function(){
			return Math.random()*15;
		});
		pjs.background(255);
		pjs.noFill();
		this.draw = function(){
			pjs.stroke(0, 0, 0, 20);
			controls.map(function(e, i, a){
				var newPos = e+velocities[i];
				if(newPos < 0){
					newPos = 0;
					velocities[i] *= -1;
				}else if(newPos > canvasWidth){
					newPos = canvasWidth;
					velocities[i] *= -1;
				}
				a[i] = newPos;
			});
			pjs.bezier.apply(null, controls);
			pjs.stroke(255, 128, 128, 20);
			controls2.map(function(e, i, a){
				var newPos = e+velocities[i];
				if(newPos < 0){
					newPos = 0;
					velocities[i] *= -1;
				}else if(newPos > canvasWidth){
					newPos = canvasWidth;
					velocities[i] *= -1;
				}
				a[i] = newPos;
			});
			pjs.bezier.apply(null, controls2);
		};
		pjs.loop();
	},
	'chaos': function(){
		var args = [].slice.call(arguments);
		var pjs = this.getProcessing();
		var canvasWidth = +this.getProperty('canvasWidth');
		var canvasHeight = +this.getProperty('canvasHeight');
		var xCenter = canvasWidth/2;
		var yCenter = canvasHeight/2;
		var radius = xCenter-50;
		var toRad = Math.PI/180;

		// f = 2
		var attractors = [
			{
				x: canvasWidth/2,
				y: 50
			},
			{
				x: 50,
				y: canvasHeight-50
			},
			{
				x: canvasWidth-50,
				y: canvasHeight-50
			}
		];
		// simplex-5
		// f = 1.5
		var attractors5 = [
			{
				x: canvasWidth-50,
				y: 50
			},
			{
				x: 50,
				y: 50
			},
			{
				x: 50,
				y: canvasHeight-50
			},
			{
				x: canvasWidth-50,
				y: canvasHeight-50
			},
			{
				x: xCenter,
				y: yCenter
			}
		];
		// simplex-6
		// f = 1.5
		var attractors6 = [
			{
				x: Math.cos(0)*radius + xCenter,
				y: Math.sin(0)*radius + yCenter
			},
			{
				x: Math.cos(60*toRad)*radius + xCenter,
				y: Math.sin(60*toRad)*radius + yCenter
			},
			{
				x: Math.cos(120*toRad)*radius + xCenter,
				y: Math.sin(120*toRad)*radius + yCenter
			},
			{
				x: Math.cos(180*toRad)*radius + xCenter,
				y: Math.sin(180*toRad)*radius + yCenter
			},
			{
				x: Math.cos(240*toRad)*radius + xCenter,
				y: Math.sin(240*toRad)*radius + yCenter
			},
			{
				x: Math.cos(300*toRad)*radius + xCenter,
				y: Math.sin(300*toRad)*radius + yCenter
			}
		];
		function roll(d){
			return Math.floor(d*Math.random());
		}

		pjs.background(0);
		pjs.stroke(255,255,255,255);
		for(var a in attractors){
			pjs.point(attractors[a].x, attractors[a].y);
		}

		var x = Math.random()*canvasWidth;
		var y = Math.random()*canvasHeight;
		var f = 2;
		this.draw = function(){
			var a = roll(attractors.length);
			x += (attractors[a].x - x)/f;
			y += (attractors[a].y - y)/f;
			pjs.point(x, y);
		};
		pjs.loop();
	},
	'fire': function(){
		var pjs = this.getProcessing();
		var canvasWidth = this.getProperty('canvasWidth');
		var pitch = canvasWidth*4;
		var ctxt = this.canvas.getContext('2d');
        var burnBuffer = ctxt.createImageData(canvasWidth, canvasWidth);
		var pixels = burnBuffer.data;

		// set alpha channel
		for(var p=3;p<pixels.length;p+=4){
			pixels[p] = 255;
		}
		ctxt.putImageData(burnBuffer, 0, 0);

		var lastRow = pixels.length-pitch;
		var numRows = pixels.length/pitch;
		this.draw = function(){
			for(var p=0;p<pixels.length;++p){
				// skip first row, last row, first col, last col, alpha
				if(p<pitch || p>=lastRow || p%pitch<4 || p%pitch>pitch-5 || p%4===3){
					continue;
				}
				var row = p/pitch;
				if(p%4===0 && Math.random()<Math.pow(Math.E,Math.pow(row/numRows, 4))-.9925){
					if(Math.random()>0.975){
						pixels[p+pitch] = 255;
						pixels[p++] = 255;
						pixels[p+pitch] = 128;
						pixels[p++] = 128;
						pixels[p+pitch] = 96;
						pixels[p++] = 96;
						//pixels[++p] = 255;
						continue;
					}
				}
				var avg = (
					pixels[p]+
					pixels[p-4]+
					pixels[p+4]+
					pixels[p+pitch]
				)/4;
				pixels[p] = avg-2;
			}
			ctxt.putImageData(burnBuffer, 0, 0);
		};
		pjs.loop();
	},
	'fireworks': function(){
		var canvasWidth = this.getProperty('canvasWidth');
		var canvasHeight = this.getProperty('canvasHeight');
		var pjs = this.getProcessing();
		var red = new ParticleJS(pjs, function(){
			// update
			this.dx+=red.acceleration[0];
			this.dy+=red.acceleration[1];
			this.x+=this.dx;
			this.y+=this.dy;

			var t = 1-(this.t/this.ttl);
			this.r = 255*Math.pow(t, 0.2);
			this.g = 255*t*t;
			this.b = 255*t*t*t*t;
			this.a = 255*t;
		});
		var blue = new ParticleJS(pjs, function(){
			// update
			this.dx+=blue.acceleration[0];
			this.dy+=blue.acceleration[1];
			this.x+=this.dx;
			this.y+=this.dy;

			var t = 1-(this.t/this.ttl);
			this.b = 255*Math.pow(t, 0.2);
			this.g = 255*t*t;
			this.r = 255*t*t*t*t;
			this.a = 255*t;
		});
		var green = new ParticleJS(pjs, function(){
			// update
			this.dx+=green.acceleration[0];
			this.dy+=green.acceleration[1];
			this.x+=this.dx;
			this.y+=this.dy;

			var t = 1-(this.t/this.ttl);
			this.g = 255*Math.pow(t, 0.2);
			this.r = 255*t*t;
			this.b = 255*t*t*t*t;
			this.a = 255*t;
		});
		var yellow = new ParticleJS(pjs, function(){
			// update
			this.dx+=yellow.acceleration[0];
			this.dy+=yellow.acceleration[1];
			this.x+=this.dx;
			this.y+=this.dy;

			var t = 1-(this.t/this.ttl);
			this.r = 255*Math.pow(t, 0.2);
			this.g = 255*Math.pow(t, 0.2);
			this.b = 255*t*t*t*t;
			this.a = 255*t;
		});
		var orange = new ParticleJS(pjs, function(){
			// update
			this.dx+=orange.acceleration[0];
			this.dy+=orange.acceleration[1];
			this.x+=this.dx;
			this.y+=this.dy;

			var t = 1-(this.t/this.ttl);
			this.r = 255*Math.pow(t, 0.2);
			this.b = 255*t*t*t*t;
			this.g = 255*t;
			this.a = 255*t;
		});
		var purple = new ParticleJS(pjs, function(){
			// update
			this.dx+=purple.acceleration[0];
			this.dy+=purple.acceleration[1];
			this.x+=this.dx;
			this.y+=this.dy;

			var t = 1-(this.t/this.ttl);
			this.r = 255*Math.pow(t, 0.2);
			this.b = 255*Math.pow(t, 0.2);
			this.g = 255*t*t*t*t;
			this.a = 255*t;
		});
		red.acceleration = [0, 0.15];
		blue.acceleration = [0, 0.15];
		green.acceleration = [0, 0.15];
		yellow.acceleration = [0, 0.15];
		orange.acceleration = [0, 0.15];
		purple.acceleration = [0, 0.15];

		function explode(x, y){
			var ps;
			switch(randInt(0,5)){
				case 0:
					ps = red;
					break;
				case 1:
					ps = blue;
					break;
				case 2:
					ps = green;
					break;
				case 3:
					ps = yellow;
					break;
				case 4:
					ps = purple;
					break;
				case 5:
					ps = orange;
					break;
			}
			for(var i=0; i<300; ++i){
				var theta = random(0, Math.PI*2);
				var force = random(0, 10);
				ps.createParticle(random(50, 100), x, y, Math.cos(theta)*force, Math.sin(theta)*force, 0, 0, 0, 0);
			}
		}

		var x = canvasWidth/2;
		var y = canvasHeight/2;
		this.draw = function(){
			pjs.background(0);
			if(Math.random()>0.95){
				explode(random(0, canvasWidth), random(0, canvasHeight/2));
			}
			red.render();
			blue.render();
			green.render();
			yellow.render();
			purple.render();
			orange.render();
		};
		pjs.loop();
	},
	'fountain': function(){
		var canvasWidth = this.getProperty('canvasWidth');
		var canvasHeight = this.getProperty('canvasHeight');
		var pjs = this.getProcessing();
		var ps = new ParticleJS(pjs, function(){
			// update
			this.dx+=ps.acceleration[0];
			this.dy+=ps.acceleration[1];
			this.x+=this.dx;
			this.y+=this.dy;

			var t = 1-(this.t/this.ttl);
			this.r = 255*Math.pow(t, 0.2);
			this.g = 255*t*t;
			this.b = 255*t*t*t*t;
			this.a = 255*Math.pow(t, 0.2);

			// check
			if(this.x>=canvasWidth-1){
				this.x=canvasWidth-1;
				this.dx*=-1;
			}else if(this.x<0){
				this.x=0;
				this.dx*=-1;
			}
			// bounce
			if(this.y>=canvasHeight-2){
				if(this.dy<0.25){
					this.y=canvasHeight-1;
				}else{
					this.y=canvasHeight-2;
				}
				this.dy*=-1.2*Math.random()*ps.elasticity;
				if(Math.random()<0.5){
					this.dx-=this.dy;
				}else{
					this.dx+=this.dy;
				}
			}else if(this.y<0){
				this.y=0;
				this.dy*=-1*ps.elasticity;
			}
			if(this.y===canvasHeight-1){
				this.active = false;
			}
		});
		//ps.MAX_COUNT = 10000;

		var force = -20;
		this.draw = function(){
			pjs.background(0);
			for(var i=0; i<15; ++i){
				var theta = random(-0.098, 0.098);
				var r = random(force, 0.8*force);
				// ttl, x, y, dx, dy, r, g, b, a
				ps.createParticle(random(10, 30)*-r, canvasWidth/2, canvasHeight-20, Math.sin(theta)*r, Math.cos(theta)*r, 0, 0, 0, 0);
			}
			ps.render();
		};
		pjs.loop();
	},
	'latice': function(){
	},
	'lens': function(){
		var canvasWidth = this.getProperty('canvasWidth');
		var lensWidth = 200;
		var lensDepth = 30;
		var pjs = this.getProcessing();
		var bg = pjs.createImage(canvasWidth, canvasWidth, pjs.P3D);
		var pixels = bg.pixels.toArray();
		for(var i=0; i<pixels.length; ++i){
			pixels[i] = pjs.color.apply(this, checkerBoard(windowHeight, windowHeight/32, 255, i));
		}
		bg.pixels.set(pixels);
		bg.loaded = true;

		var lens = pjs.createImage(lensWidth, lensWidth, pjs.RGB);
		var lensLookup = createLens(canvasWidth, lensWidth, lensDepth);

		var x = canvasWidth/2,
			y = canvasWidth/2,
			dx = 1,
			dy = 2
			r = lensWidth/2;

		this.draw = function(){
			// update
			x += dx;
			y += dy;
			// check
			if(x<0){
				x=0;
				dx=-dx;
			}
			if(x>canvasWidth-lensWidth){
				x=canvasWidth-lensWidth;
				dx=-dx;
			}
			if(y<0){
				y=0;
				dy=-dy;
			}
			if(y>canvasWidth-lensWidth){
				y=canvasWidth-lensWidth;
				dy=-dy;
			}
			//draw
			pjs.background(bg);

			var start = y*canvasWidth+x;
			var lensPixels = lens.pixels.toArray();
			for(var i=0;i<lensWidth*lensWidth;++i){
				lensPixels[i] = pixels[Math.round(start)+(Math.floor(i/lensWidth)*canvasWidth)+(i%lensWidth)+lensLookup[i]];
			}
			lens.pixels.set(lensPixels);
			pjs.image(lens, x, y);
		};
		pjs.loop();
	},
	'life': function(){
	},
	'pattern': function(){
		var pjs = this.getProcessing();
		var height = +this.getProperty('canvasHeight');
		var bg = pjs.createImage(height, height, pjs.P3D);
		var pixels = bg.pixels.toArray();
		for(var i=0; i<pixels.length; ++i){
			pixels[i] = pjs.color.apply(this, checkerBoard(windowHeight, windowHeight/8, 255, i));
		}
		bg.pixels.set(pixels);
		bg.loaded = true;
		pjs.background(bg);
		pjs.noLoop();
	},
	'plasma': function(){
		var pjs = this.getProcessing();
		var canvasWidth = this.getProperty('canvasWidth');
		var canvasHeight = this.getProperty('canvasHeight');
		var pitch = canvasWidth*4;
		var ctxt = this.canvas.getContext('2d');
        var burnBuffer = ctxt.createImageData(canvasWidth, canvasWidth);
		var pixels = burnBuffer.data;

		//var fastSin = new FastTrig().sin;
		var fastSin = Math.sin;
		function palette(i){
			var r = 255*Math.pow(t, 0.2);
			var g = 255*t*t;
			var b = 255*t*t*t*t;
			var a = 255*Math.pow(t, 0.2);
			return [r, g, b, a];
		}
		// set alpha channel
		for(var p=3;p<pixels.length;p+=4){
			pixels[p] = 255;
		}
		ctxt.putImageData(burnBuffer, 0, 0);

		var pos1 = 0;
		var pos2 = 0;
		var pos3 = 0;
		var pos4 = 0;
		var tpos1 = 0;
		var tpos2 = 0;
		var tpos3 = 0;
		var tpos4 = 0;
		var lastRow = pixels.length-pitch;
		var numRows = pixels.length/pitch;
		this.draw = function(){
			tpos4 = pos4;
			tpos3 = pos3;
			for(var i=0; i<pixels.length; ++i){
				// skip first row, last row, first col, last col, alpha
				if(p<pitch || p>=lastRow || p%pitch<4 || p%pitch>pitch-5 || p%4===3){
					continue;
				}
				var row = p/pitch;
				//rows
				tpos1 = pos1 + 5;
				tpos2 = pos2 + 3;
				tpos3 &= 511;
				tpos4 &= 511;

				for(var j=0; j<canvasWidth; ++j,++i){
					//cols
					tpos1 &= 511;
					tpos2 &= 511;

					//var x = fastSin[tpos1] + fastSin[tpos2] + fastSin[tpos3] + fastSin[tpos4];
					var x = fastSin( tpos1 ) + fastSin( tpos2 ) + fastSin( tpos3 ) + fastSin( tpos4 );
					pixels[i] = 128 + (x >> 4);

					tpos1 += 5;
					tpos2 += 3;
				}
				tpos4 += 3;
				tpos3 += 1;
			}
			pos1 += 9;
			pos3 += 8;
			ctxt.putImageData(burnBuffer, 0, 0);
		};
		pjs.loop();
	},
	'snow': function(){
		var canvasWidth = this.getProperty('canvasWidth');
		var canvasHeight = this.getProperty('canvasHeight');
		var pjs = this.getProcessing();
		var ps = new ParticleJS(pjs, function(){
			this.x+=this.dx;
			this.y+=this.dy;
			if(this.x>=canvasWidth-1
				|| this.y>=canvasHeight-1 || this.y<0){
				this.active = false;
			}
		});

		this.draw = function(){
			pjs.background(0);
			// ttl, x, y, dx, dy, r, g, b, a
			ps.createParticle(0, random(-canvasWidth/2, canvasWidth-1), 0, random(0, 0.25), random(0.4, 0.6), 255, 255, 255, random(96, 255));
			ps.render();
		};
		pjs.loop();
	},
	'stars': function(){
		var canvasWidth = this.getProperty('canvasWidth');
		var canvasHeight = this.getProperty('canvasHeight');
		var centerX = canvasWidth/2;
		var centerY = canvasHeight/2;
		var pjs = this.getProcessing();
		var ps = new ParticleJS(pjs, function(){
			++this.t;
			this.x+=this.dx;
			this.y+=this.dy;
			if(this.x>=canvasWidth-1
				|| this.y>=canvasHeight-1 || this.x<0 || this.y<0){
				this.active = false;
			}
			var vel = Math.sqrt((this.dx*this.dx)+(this.dy*this.dy));
			var dist = Math.min(distance(this.x, this.y, centerX, centerY), centerX);
			this.a=128*(1-(dist/centerX))+(255*((vel)/6)*(this.t/50));
		});
		this.draw = function(){
			pjs.background(0);
			for(var i=0; i<10; ++i){
				// ttl, x, y, dx, dy, r, g, b, a
				var x = random(0, canvasWidth);
				var y = random(0, canvasHeight);
				var dist = Math.min(distance(x, y, centerX, centerY), centerX);
				var theta = -Math.atan((centerY-y)/(x-centerX));
				if(x<centerX){
					theta+=Math.PI;
				}
				var force = random(1, 6);
				ps.createParticle(0, x, y, Math.cos(theta)*force, Math.sin(theta)*force, 255, 255, 255, 0);
			}
			ps.render();
		};
		pjs.loop();
	}
};

function createLens(cw, w, d){
    var lens = [];
    for(var i=0;i<w*w;++i){
        lens.push(0);
	}
    var r = Math.round(w/2);
    var r2 = r*r;
    var center = r*(w+1);
    var offset;
    for(var i=0;i<r2;++i){
        var x = i%r;
        var y = Math.floor(i/r);
        var x2 = x*x;
        var y2 = y*y;
        var ix = 0;
        var iy = 0;
        if((x2+y2) < (r2)){
            var shift = d/Math.sqrt(d*d - (x2 + y2 - r2));
            ix = Math.floor(x*shift) - x;
            iy = Math.floor(y*shift) - y;
        }
        
        offset = (iy*cw + ix);
        lens[center - (y*w) - x] = -offset;
        lens[center + (y*w) + x] = offset;
        offset = (-iy*cw + ix);
        lens[center - (y*w) + x] = offset;
        lens[center + (y*w) - x] = -offset;
    }
    return lens;
}
function checkerBoard(boardWidth, squareWidth, color, index){
	var x = index%boardWidth;
	var y = Math.floor(index/boardWidth);
	var squareColor = color;
	var b1 = Math.floor(x/squareWidth)%2==0;
	var b2 = Math.floor(y/squareWidth)%2==0;
	if(b1 != b2){
		squareColor = 0;
	}
	return [squareColor, squareColor, squareColor, 255];
}
function distance(x, y, x2, y2){
	var distX = Math.abs(x2-x);
	var distY = Math.abs(y2-y);
	return Math.sqrt((distX*distX)+(distY*distY));
}
function fastSqrt(i){
}
/*
 * Fast sin/cos lookup for integer degrees
 */
function FastTrig(){
	if(!(this instanceof FastTrig)){
		return new FastTrig();
	}
	if(FastTrig.instance instanceof FastTrig){
		return FastTrig.instance;
	}
	Object.defineProperty(FastTrig, 'instance', {
		value: this
	});

	var toRad = Math.PI/180;
	Object.defineProperties(this, {
		'cos': {
			value: {},
			enumerable: true
		},
		'sin': {
			value: {},
			enumerable: true
		}
	});
	for(var d=0; d<=360; ++d){
		Object.defineProperty(this.cos, d, {
			value: Math.cos(d*toRad)
		});
		Object.defineProperty(this.sin, d, {
			value: Math.sin(d*toRad)
		});
	}
}
