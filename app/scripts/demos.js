var demos = {
	'boids': function(){
	},
	'chaos': function(){
	},
	'fire': function(){
	},
	'fountain': function(){
	},
	'lens': function(){
		var canvasWidth = this.getProperty('canvasWidth');
		var lensWidth = 100;
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
	'test': function(){
		var pjs = this.getProcessing();
		var height = +this.getProperty('canvasHeight');
		var bg = pjs.createImage(height, height, pjs.P3D);
		var pixels = bg.pixels.toArray();
		for(var i=0; i<pixels.length; ++i){
			pixels[i] = pjs.color.apply(this, checkerBoard(windowHeight, windowHeight/16, 255, i));
		}
		bg.pixels.set(pixels);
		bg.loaded = true;
		pjs.loop();

		this.draw = function(){
			pjs.background(bg);
		};
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
