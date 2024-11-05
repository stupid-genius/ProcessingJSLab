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
	//'3d': function(){
	//	// renderer.init({
	//	// 	background: 0xFF0A110A,
	//	// 	frameRate: 60,
	//	// 	renderer: 'P3D'
	//	// 	// renderer: 2
	//	// });
	//	renderer.init('P3D');
	//	const canvasWidth = renderer.width;
	//	const canvasHeight = renderer.height;
	//	let angle = 0;
	//	const r = 255;
	//	const g = 255;
	//	const b = 255;
	//	// renderer.init();
	//	renderer.draw = function(){
	//		renderer.background(0);
	//		renderer.camera(canvasWidth/2, canvasHeight/5, 200, canvasWidth/2, canvasHeight/2, 0, 0, 1, 0);
	//		//renderer.ambientLight(50, 50, 50);
	//		renderer.pointLight(r, g/10, b/10, canvasWidth/3, canvasHeight/3, 100);
	//		renderer.pointLight(r/10, g, b/10, 300, canvasWidth/3, 100);
	//		renderer.pointLight(r/10, g/10, b, 300, 300, -100);
	//		renderer.pointLight(r, g, b, canvasWidth/3, 300, -100);
	//		renderer.translate(canvasWidth/2, canvasHeight/2);
	//		//renderer.sphere(60);
	//		renderer.rotateY(angle);
	//		renderer.normal(0, 0, 1);
	//		renderer.fill(128);
	//		renderer.rect(-100, -100, 200, 200);
	//		/*pjs.beginShape(pjs.TRIANGLE_FAN);
	//		pjs.normal(0, 0, 1);
	//		pjs.fill(50, 50, 200);
	//		pjs.vertex(-100, 100, 0);
	//		pjs.vertex(100, 100, 0);
	//		pjs.fill(200, 50, 50);
	//		pjs.vertex(100, -100, 0);
	//		pjs.vertex(-100, -100, 0);
	//		pjs.endShape();
	//		*/
	//		angle += 0.01;
	//	};
	//	renderer.loop();
	//},
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
	// cell: function(_, width=200, height=200){
	// 	console.log(_);
	// 	const rule = (currentState, neighbors) => {
	// 		if(currentState === ALIVE){
	// 			return (neighbors === 2 || neighbors === 3) ? ALIVE : DEAD;
	// 		}else{
	// 			return neighbors === 3 ? ALIVE : DEAD;
	// 		}
	// 	};
	// 	renderer.init({
	// 		background: 0,
	// 		frameRate: 400,
	// 		height: +height,
	// 		width: +width
	// 	});
	// 	const canvasWidth = renderer.width;
	// 	const canvasHeight = renderer.height;

	// 	const cur = 0, next = 1, ALIVE = 1, DEAD = 0;

	// 	// Cell grid setup: 2D array of cells, each tracking `cur` and `next` state
	// 	const cells = Array.from(Array(canvasWidth * canvasHeight)).map(() => [DEAD, DEAD]);
	// 	// Initialize cells randomly or as desired (can be customized)
	// 	cells.forEach(cell => cell[next] = Math.random() < 0.1 ? ALIVE : DEAD);

	// 	// Helper function to count neighbors for a cell at index i
	// 	function neighbors(i){
	// 		const x = i % canvasWidth;
	// 		const y = Math.floor(i / canvasWidth);
	// 		let count = 0;
	// 		// Check all 8 neighbors, respecting canvas boundaries
	// 		if(y > 0){
	// 			if(x > 0){
	// 				count += cells[i - canvasWidth - 1][cur];
	// 			}
	// 			count += cells[i - canvasWidth][cur];
	// 			if(x < canvasWidth - 1){
	// 				count += cells[i - canvasWidth + 1][cur];
	// 			}
	// 		}
	// 		if(y < canvasHeight - 1){
	// 			if(x > 0){
	// 				count += cells[i + canvasWidth - 1][cur];
	// 			}
	// 			count += cells[i + canvasWidth][cur];
	// 			if(x < canvasWidth - 1){
	// 				count += cells[i + canvasWidth + 1][cur];
	// 			}
	// 		}
	// 		if(x > 0){
	// 			count += cells[i - 1][cur];
	// 		}
	// 		if(x < canvasWidth - 1){
	// 			count += cells[i + 1][cur];
	// 		}
	// 		return count;
	// 	}

	// 	// Main draw function, called every frame
	// 	renderer.stroke(255);
	// 	renderer.draw = function(){
	// 		renderer.background([0, 0, 255]);

	// 		// Iterate over cells and render any alive cells
	// 		cells.forEach((cell, i) => {
	// 			if(cell[cur] === ALIVE){
	// 				const x = i % canvasWidth;
	// 				const y = Math.floor(i / canvasWidth);
	// 				renderer.point(x, y);
	// 			}

	// 			// Use the rule function to determine next state
	// 			const count = neighbors(i);
	// 			const currentState = cell[cur];
	// 			cell[next] = rule(currentState, count);
	// 		});

	// 		// Update cell states from next to cur for the next frame
	// 		cells.forEach(cell => {
	// 			cell[cur] = cell[next];
	// 		});
	// 	};

	// 	renderer.loop();
	// },
	chaos: function(simplex='3'){
		renderer.init({
			frameRate: 400
		});
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
		renderer.init({
			background: 0,
			frameRate: 60,
			height: 300,
			width: 300
		});
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
				if(Math.random() < Math.pow(Math.E, Math.pow(row/numRows, 4)) - 1){
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
				).map((e, i) => {
					if(i===3){
						return 255;
					}
					const avg = e/4.25;
					return avg < 10 ? 0 : avg;
				});
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
			// log('update');
			x += dx;
			y += dy;

			// log('check');
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

			// log('draw');
			renderer.background(bg);

			const start = y*canvasWidth+x;
			for(let i=0; i<lensWidth*lensWidth; ++i){
				lens[i] = bg[Math.round(start) + (Math.floor(i/lensWidth)*canvasWidth) + (i%lensWidth) + lensLookup[i]];
			}
			lens.blit(x, y);
		};
		renderer.loop();
	},
	life: function(width=300, height=300){
		/*
		 *  Any live cell with fewer than two live neighbours dies, as if by underpopulation.
		 *	Any live cell with two or three live neighbours lives on to the next generation.
		 *	Any live cell with more than three live neighbours dies, as if by overpopulation.
		 *	Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
		 */
		renderer.init({
			background: 0,
			frameRate: 12,
			height: +height,
			width: +width
		});
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
	//plasma: function(){
	//	const pjs = this.getProcessing();
	//	const canvasWidth = this.getProperty('canvasWidth');
	//	const canvasHeight = this.getProperty('canvasHeight');
	//	const pitch = canvasWidth*4;
	//	const ctxt = this.canvas.getContext('2d');
	//	const burnBuffer = ctxt.createImageData(canvasWidth, canvasWidth);
	//	const pixels = burnBuffer.data;

	//	//const fastSin = new FastTrig().sin;
	//	const fastSin = Math.sin;
	//	function palette(i){
	//		const r = 255*Math.pow(t, 0.2);
	//		const g = 255*t*t;
	//		const b = 255*t*t*t*t;
	//		const a = 255*Math.pow(t, 0.2);
	//		return [r, g, b, a];
	//	}
	//	// set alpha channel
	//	for(const p=3;p<pixels.length;p+=4){
	//		pixels[p] = 255;
	//	}
	//	ctxt.putImageData(burnBuffer, 0, 0);

	//	const pos1 = 0;
	//	const pos2 = 0;
	//	const pos3 = 0;
	//	const pos4 = 0;
	//	const tpos1 = 0;
	//	const tpos2 = 0;
	//	const tpos3 = 0;
	//	const tpos4 = 0;
	//	const lastRow = pixels.length-pitch;
	//	const numRows = pixels.length/pitch;
	//	this.draw = function(){
	//		tpos4 = pos4;
	//		tpos3 = pos3;
	//		for(const i=0; i<pixels.length; ++i){
	//			// skip first row, last row, first col, last col, alpha
	//			if(p<pitch || p>=lastRow || p%pitch<4 || p%pitch>pitch-5 || p%4===3){
	//				continue;
	//			}
	//			const row = p/pitch;
	//			//rows
	//			tpos1 = pos1 + 5;
	//			tpos2 = pos2 + 3;
	//			tpos3 &= 511;
	//			tpos4 &= 511;

	//			for(const j=0; j<canvasWidth; ++j,++i){
	//				//cols
	//				tpos1 &= 511;
	//				tpos2 &= 511;

	//				//const x = fastSin[tpos1] + fastSin[tpos2] + fastSin[tpos3] + fastSin[tpos4];
	//				const x = fastSin( tpos1 ) + fastSin( tpos2 ) + fastSin( tpos3 ) + fastSin( tpos4 );
	//				pixels[i] = 128 + (x >> 4);

	//				tpos1 += 5;
	//				tpos2 += 3;
	//			}
	//			tpos4 += 3;
	//			tpos3 += 1;
	//		}
	//		pos1 += 9;
	//		pos3 += 8;
	//		ctxt.putImageData(burnBuffer, 0, 0);
	//	};
	//	pjs.loop();
	//},
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
