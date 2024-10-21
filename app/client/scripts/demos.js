const xMath = require('./Math');
const Particles = require('./Particles');
const renderer = require('./Renderer').Renderer();

function checkerBoard(boardWidth, squareWidth, color, index){
	const x = index%boardWidth;
	const y = Math.floor(index/boardWidth);
	let squareColor = color;
	const b1 = Math.floor(x/squareWidth)%2==0;
	const b2 = Math.floor(y/squareWidth)%2==0;
	if(b1 != b2){
		squareColor = 0;
	}
	return [squareColor, squareColor, squareColor, 255];
}

const demos = {
	// ants: function(){},
	// boids: function(){},
	bz: function(){
		const canvasWidth = renderer.width;

		const controls = Array.from({ length: 8 }, () => Math.random()*canvasWidth);
		const controls2 = Array.from({ length: 8 }, () => Math.random()*canvasWidth);
		const velocities = Array.from({ length: 8 }, () => Math.random()*15);

		renderer.background(255);
		renderer.noFill();
		renderer.draw = function(){
			renderer.stroke(0, 0, 0, 20);
			controls.map(function(e, i, a){
				let newPos = e+velocities[i];
				if(newPos < 0){
					newPos = 0;
					velocities[i] *= -1;
				}else if(newPos > canvasWidth){
					newPos = canvasWidth;
					velocities[i] *= -1;
				}
				a[i] = newPos;
			});
			renderer.bezier.apply(null, controls);
			renderer.stroke(255, 128, 128, 20);
			controls2.map(function(e, i, a){
				let newPos = e+velocities[i];
				if(newPos < 0){
					newPos = 0;
					velocities[i] *= -1;
				}else if(newPos > canvasWidth){
					newPos = canvasWidth;
					velocities[i] *= -1;
				}
				a[i] = newPos;
			});
			renderer.bezier.apply(null, controls2);
		};
		renderer.loop();
	},
	chaos: function(simplex='3'){
		renderer.frameRate(400);
		const canvasWidth = renderer.width;
		const canvasHeight = renderer.height;
		const xCenter = canvasWidth/2;
		const yCenter = canvasHeight/2;
		const radius = xCenter-50;
		const RADIAN = Math.PI/180;

		const attractors = {
			'3': [
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
			],
			'5': [
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
			],
			'6': [
				{
					x: Math.cos(0)*radius + xCenter,
					y: Math.sin(0)*radius + yCenter
				},
				{
					x: Math.cos(60*RADIAN)*radius + xCenter,
					y: Math.sin(60*RADIAN)*radius + yCenter
				},
				{
					x: Math.cos(120*RADIAN)*radius + xCenter,
					y: Math.sin(120*RADIAN)*radius + yCenter
				},
				{
					x: Math.cos(180*RADIAN)*radius + xCenter,
					y: Math.sin(180*RADIAN)*radius + yCenter
				},
				{
					x: Math.cos(240*RADIAN)*radius + xCenter,
					y: Math.sin(240*RADIAN)*radius + yCenter
				},
				{
					x: Math.cos(300*RADIAN)*radius + xCenter,
					y: Math.sin(300*RADIAN)*radius + yCenter
				}
			]
		}[simplex];
		const force = {
			'3': 2,
			'5': 1.5,
			'6': 1.5
		}[simplex];

		renderer.background(0);
		renderer.stroke(255, 255, 255, 255);
		for(const {x, y} of attractors){
			renderer.point(x, y);
		}
		let x = Math.random()*canvasWidth;
		let y = Math.random()*canvasHeight;
		renderer.draw = function(){
			const a = xMath.roll(attractors.length);
			x += (attractors[a].x - x)/force;
			y += (attractors[a].y - y)/force;
			renderer.point(x, y);
		};
		renderer.loop();
	},
	fire: function(){
		const canvasWidth = renderer.width;
		const buffers = renderer.doubleBuffer();

		// this doesn't work because the pixel array is external to the buffer
		// buffers.writeBuffer.pixels.toArray().fill(renderer.color(0, 0, 0, 255));

		let buffer = buffers.writeBuffer;
		for(let i=0; i<buffer.length; ++i){
			buffer[i] = [0, 0, 0, 255];
		}
		buffers.flip();

		buffer = buffers.writeBuffer;
		for(let i=0; i<buffer.length; ++i){
			buffer[i] = [0, 0, 0, 255];
		}
		buffers.flip();

		const numRows = buffers.readBuffer.length/canvasWidth;
		const baseColor = renderer.color(255, 128, 96);
		renderer.draw = function(){
			const curPixels = buffers.readBuffer;
			const newPixels = buffers.writeBuffer;

			// skip first, last row
			for(let p=canvasWidth; p < newPixels.length-canvasWidth; ++p){
				// skip first, last col
				if(p%canvasWidth < 1 || p%canvasWidth >= canvasWidth-1){
					continue;
				}

				// seed a few pixels
				// maybe do some particle stuff
				const row = p/canvasWidth;
				if(Math.random() < Math.pow(Math.E, Math.pow(row/numRows, 4)) - 0.9925){
					if(Math.random() > 0.975){
						newPixels[p] = baseColor;
						continue;
					}
				}

				// burn
				// apply some different color functions
				const newColor = xMath.addColors(
					xMath.decodeColor(curPixels[p-1]),
					xMath.decodeColor(curPixels[p]),
					xMath.decodeColor(curPixels[p+1]),
					xMath.decodeColor(curPixels[p+canvasWidth]),
				).map((e, i) => i===3 ? e : e/4);
				newPixels[p] = newColor;
			}
			buffers.flip();
		};
		renderer.loop();
	},
	fireworks: function(){
		const canvasWidth = renderer.width;
		const canvasHeight = renderer.height;
		const red = new Particles(renderer, function(){
			// update
			this.dx+=red.acceleration[0];
			this.dy+=red.acceleration[1];
			this.x+=this.dx;
			this.y+=this.dy;

			const t = 1-(this.t/this.ttl);
			this.r = 255*Math.pow(t, 0.2);
			this.g = 255*t*t;
			this.b = 255*t*t*t*t;
			this.a = 255*t;
		});
		const blue = new Particles(renderer, function(){
			// update
			this.dx+=blue.acceleration[0];
			this.dy+=blue.acceleration[1];
			this.x+=this.dx;
			this.y+=this.dy;

			const t = 1-(this.t/this.ttl);
			this.b = 255*Math.pow(t, 0.2);
			this.g = 255*t*t;
			this.r = 255*t*t*t*t;
			this.a = 255*t;
		});
		const green = new Particles(renderer, function(){
			// update
			this.dx+=green.acceleration[0];
			this.dy+=green.acceleration[1];
			this.x+=this.dx;
			this.y+=this.dy;

			const t = 1-(this.t/this.ttl);
			this.g = 255*Math.pow(t, 0.2);
			this.r = 255*t*t;
			this.b = 255*t*t*t*t;
			this.a = 255*t;
		});
		const yellow = new Particles(renderer, function(){
			// update
			this.dx+=yellow.acceleration[0];
			this.dy+=yellow.acceleration[1];
			this.x+=this.dx;
			this.y+=this.dy;

			const t = 1-(this.t/this.ttl);
			this.r = 255*Math.pow(t, 0.2);
			this.g = 255*Math.pow(t, 0.2);
			this.b = 255*t*t*t*t;
			this.a = 255*t;
		});
		const orange = new Particles(renderer, function(){
			// update
			this.dx+=orange.acceleration[0];
			this.dy+=orange.acceleration[1];
			this.x+=this.dx;
			this.y+=this.dy;

			const t = 1-(this.t/this.ttl);
			this.r = 255*Math.pow(t, 0.2);
			this.b = 255*t*t*t*t;
			this.g = 255*t;
			this.a = 255*t;
		});
		const purple = new Particles(renderer, function(){
			// update
			this.dx+=purple.acceleration[0];
			this.dy+=purple.acceleration[1];
			this.x+=this.dx;
			this.y+=this.dy;

			const t = 1-(this.t/this.ttl);
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
			let ps;
			switch(xMath.range(0,5)){
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
			for(let i=0; i<300; ++i){
				const theta = xMath.range(0, Math.PI*2);
				const force = xMath.range(0.001, 10);
				ps.createParticle(xMath.range(50.001, 100), x, y, Math.cos(theta)*force, Math.sin(theta)*force, 0, 0, 0, 0);
			}
		}

		renderer.draw = function(){
			renderer.background(0);
			if(Math.random()>0.95){
				explode(xMath.range(0.001, canvasWidth), xMath.range(0.001, canvasHeight/2));
			}
			red.render();
			blue.render();
			green.render();
			yellow.render();
			purple.render();
			orange.render();
		};
		renderer.loop();
	},
	fountain: function(){
		const canvasWidth = renderer.width;
		const canvasHeight = renderer.height;
		const ps = new Particles(renderer, function(){
			// update
			this.dx+=ps.acceleration[0];
			this.dy+=ps.acceleration[1];
			this.x+=this.dx;
			this.y+=this.dy;

			const t = 1-(this.t/this.ttl);
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

		const force = -20;
		renderer.draw = function(){
			renderer.background(0);
			for(let i=0; i<15; ++i){
				const theta = xMath.range(-0.098, 0.098);
				const r = xMath.range(force, 0.8*force);
				// ttl, x, y, dx, dy, r, g, b, a
				ps.createParticle(xMath.range(10, 30)*-r, canvasWidth/2, canvasHeight-20, Math.sin(theta)*r, Math.cos(theta)*r, 0, 0, 0, 0);
			}
			ps.render();
		};
		renderer.loop();
	},
	lens: function(lensWidth=150, lensDepth=30){
		lensWidth = +lensWidth;
		lensDepth = +lensDepth;
		// const log = this.log.bind(this);
		const log = ()=>{};
		const canvasWidth = renderer.width;
		const bg = renderer.createImage();
		const height = bg.height;
		for(let i=0; i<bg.length; ++i){
			bg[i] = checkerBoard(height, height/32, 255, i);
		}
		bg.update();

		const lens = renderer.createImage(lensWidth, lensWidth);
		const lensLookup = new Array(lensWidth*lensWidth).fill(0);
		const r = Math.round(lensWidth/2);
		const r2 = r*r;
		const center = r*(lensWidth+1);
		let offset;
		for(let i=0; i < r2; ++i){
			const x = i%r;
			const y = Math.floor(i/r);
			const x2 = x*x;
			const y2 = y*y;
			let ix = 0;
			let iy = 0;
			if((x2+y2) < (r2)){
				const shift = lensDepth/Math.sqrt(lensDepth*lensDepth - (x2 + y2 - r2));
				ix = Math.floor(x*shift) - x;
				iy = Math.floor(y*shift) - y;
			}

			offset = (iy*canvasWidth + ix);
			lensLookup[center - (y*lensWidth) - x] = -offset;
			lensLookup[center + (y*lensWidth) + x] = offset;
			offset = (-iy*canvasWidth + ix);
			lensLookup[center - (y*lensWidth) + x] = offset;
			lensLookup[center + (y*lensWidth) - x] = -offset;
		}

		let x = canvasWidth/2,
			y = canvasWidth/2,
			dx = 1,
			dy = 2;

		renderer.draw = function(){
			log('update');
			x += dx;
			y += dy;

			log('check');
			if(x < 0){
				x = 0;
				dx = -dx;
			}
			if(x > canvasWidth-lensWidth){
				x = canvasWidth-lensWidth;
				dx = -dx;
			}
			if(y < 0){
				y = 0;
				dy = -dy;
			}
			if(y > canvasWidth-lensWidth){
				y = canvasWidth-lensWidth;
				dy = -dy;
			}

			log('draw');
			renderer.background(bg);

			const start = y*canvasWidth+x;
			for(let i=0; i<lensWidth*lensWidth; ++i){
				lens[i] = bg[Math.round(start) + (Math.floor(i/lensWidth)*canvasWidth) + (i%lensWidth) + lensLookup[i]];
			}
			lens.blit(x, y);
		};
		renderer.loop();
	},
	life: function(){
		/*
		 *  Any live cell with fewer than two live neighbours dies, as if by underpopulation.
		 *	Any live cell with two or three live neighbours lives on to the next generation.
		 *	Any live cell with more than three live neighbours dies, as if by overpopulation.
		 *	Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
		 */
		renderer.frameRate(12);
		const canvasWidth = renderer.width;
		const canvasHeight = renderer.height;

		const density = 0.05;
		const cur=0, next=1, ALIVE=1, DEAD=0, DYING=-1;
		// cells[x][y][cur/next]
		const cells = Array.from(Array(canvasWidth*canvasHeight)).map(() => Array.from(Array(2)));
		cells.forEach((e) => {
			e[cur] = DEAD;
			e[next] = Math.random()<density ? ALIVE : DEAD;
		});
		function neighbors(i){
			const x = i%canvasWidth;
			const y = Math.floor(i/canvasWidth);
			let count = 0;
			if(y>0){
				if(x>0){
					count += cells[i-canvasWidth-1][cur];
				}
				if(x<canvasWidth-1){
					count += cells[i-canvasWidth+1][cur];
				}
				count += cells[i-canvasWidth][cur];
			}
			if(y<canvasHeight-1){
				if(x>0){
					count += cells[i+canvasWidth-1][cur];
				}
				if(x<canvasWidth-1){
					count += cells[i+canvasWidth+1][cur];
				}
				count += cells[i+canvasWidth][cur];
			}
			if(x>0){
				count += cells[i-1][cur];
			}
			if(x<canvasWidth-1){
				count += cells[i+1][cur];
			}
			return count;
		}

		renderer.stroke(255);
		renderer.draw = function(){
			renderer.background(0);
			cells.forEach((cell,i) => {
				const cell_c = cells[i];
				if(cell[next] === ALIVE || cell[cur] === ALIVE){
					//console.count('draw');
					cell_c[cur] = ALIVE;
					const x = i%canvasWidth;
					const y = i/canvasWidth;
					renderer.point(x, y);
				}
				if(cell[next] === DYING){
					//console.count('dead');
					cell_c[cur] = DEAD;
				}
				cell_c[next] = DEAD;

				// offset for checking neighbors
				const i_o = i-(3*canvasWidth);
				if(i_o<0){
					//console.count('first 3 rows');
					return;
				}
				const cell_o = cells[i_o];
				// const x = i_o%canvasWidth;
				// const y = Math.floor(i_o/canvasWidth);
				const count = neighbors(i_o);
				//console.log(count);
				if(count === 3 && cell_o[cur] === DEAD){
					//console.count('born');
					cell_o[next] = ALIVE;
				}
				if((count < 2 || count > 3) && cell_o[cur] === ALIVE){
					//console.count('die');
					cell_o[next] = DYING;
				}
			});
		};
		renderer.loop();
	},
	pattern: function(){
		const bg = renderer.createImage();
		const height = bg.height;
		for(let i=0; i<bg.length; ++i){
			bg[i] = checkerBoard(height, height/8, 255, i);
		}
		bg.update();
		renderer.background(bg);
	},
	// plasma: function(){},
	snow: function(){
		const canvasWidth = renderer.width;
		const canvasHeight = renderer.height;
		const ps = new Particles(renderer, function(){
			this.x+=this.dx;
			this.y+=this.dy;
			if(this.x>=canvasWidth-1
				|| this.y>=canvasHeight-1 || this.y<0){
				this.active = false;
			}
		});

		renderer.draw = function(){
			renderer.background(0);
			// ttl, x, y, dx, dy, r, g, b, a
			ps.createParticle(0, xMath.range(-canvasWidth/2, canvasWidth-1), 0, xMath.range(0, 0.25), xMath.range(0.4, 0.6), 255, 255, 255, xMath.range(96, 255));
			ps.render();
		};
		renderer.loop();
	},
	stars: function(){
		const canvasWidth = renderer.width;
		const canvasHeight = renderer.height;
		const centerX = canvasWidth/2;
		const centerY = canvasHeight/2;
		const penumbra = centerX * 0.75;

		const ps = new Particles(renderer, function(){
			this.x+=this.dx;
			this.y+=this.dy;
			if(this.x>=canvasWidth-1 || this.y>=canvasHeight-1
					|| this.x<0 || this.y<0){
				this.active = false;
			}
			const vel = Math.sqrt((this.dx*this.dx)+(this.dy*this.dy));
			const dist = Math.min(xMath.distance(this.x, this.y, centerX, centerY), centerX);
			this.a = (64*(1-(dist/penumbra))) + (255*(vel*this.t++/penumbra)) + (64*(vel/6));
			//this.a = (128*(1-(dist/penumbra))) + (255*(vel*this.t++/penumbra));
		});

		renderer.draw = function(){
			renderer.background(0);
			for(let i=0; i<20; ++i){
				// ttl, x, y, dx, dy, r, g, b, a
				let x = xMath.roll(canvasWidth);
				let y = xMath.roll(canvasHeight);
				x=(x+xMath.roll(canvasWidth))/2;
				y=(y+xMath.roll(canvasHeight))/2;
				const dist = Math.min(xMath.distance(x, y, centerX, centerY), centerX);
				let theta = -Math.atan((centerY-y)/(x-centerX));
				if(x<centerX){
					theta+=Math.PI;
				}
				//const force = xMath.range(1, 6);
				const force = 5*(1-(dist/centerX))+1;
				//ps.createParticle(180*(1-(force/6)), x, y, Math.cos(theta)*force, Math.sin(theta)*force, 255, 255, 255, 0);
				ps.createParticle(0, x, y, Math.cos(theta)*force, Math.sin(theta)*force, 255, 255, 255, 0);
			}
			ps.render();
		};
		renderer.loop();
	}
};
module.exports = demos;
