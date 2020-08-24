var demos = {
	'boids': function(){
	},
	'chaos': function(){
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

		this.draw = function(){
			var lastRow = pixels.length-pitch;
			var numRows = pixels.length/pitch;
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
			//this.g = 255*Math.log10(10*t);
			this.g = 255*t*t;
			this.b = 255*t*t*t*t;
			this.a = 255*Math.pow(t, 0.2);

			// check
			if(this.x>=canvasWidth){
				this.x=canvasWidth;
				this.dx*=-1;
			}
			if(this.x<0){
				this.x=0;
				this.dx*=-1;
			}
			// bounce
			if(this.y>=canvasHeight){
				this.y=canvasHeight;
				this.dy*=-1*ps.elasticity;
				if(Math.random()<0.5){
					this.dx-=this.dy;
				}else{
					this.dx+=this.dy;
				}
			}
			if(this.y<0){
				this.y=0;
				this.dy*=-1*ps.elasticity;
			}
		});

		this.draw = function(){
			pjs.background(0);
			for(var i=0; i<15; ++i){
				// ttl, x, y, dx, dy, r, g, b, a
				var theta = random(-0.098, 0.098);
				var r = random(-13, -10);
				ps.createParticle(random(100, 400), canvasWidth/2, canvasHeight-20, Math.sin(theta)*r, Math.cos(theta)*r, 0, 0, 0, 0);
			}
			ps.render();
		};
		pjs.loop();
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
	'snow': function(){
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
