const xMath = require('./Math');
const Particles = require('./Particles');
const renderer = require('./Renderer').Renderer();
const { Space } = require('./Space');

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
function compileShader(gl, source, type) {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
		console.error('Shader compilation failed:', gl.getShaderInfoLog(shader));
		return null;
	}
	return shader;
}

const demos = {
	'3d': function(){
		renderer.init({
			renderer: 'P3D',
		});
		const canvasWidth = renderer.width;
		const canvasHeight = renderer.height;
		let angle = 0;
		const r = 255;
		const g = 255;
		const b = 255;
		renderer.frame = function(){
			renderer.background(0);
			renderer.camera(canvasWidth/2, canvasHeight/5, 200, canvasWidth/2, canvasHeight/2, 0, 0, 1, 0);
			//renderer.ambientLight(50, 50, 50);
			renderer.pointLight(r, g/10, b/10, canvasWidth/3, canvasHeight/3, 100);
			renderer.pointLight(r/10, g, b/10, 300, canvasWidth/3, 100);
			renderer.pointLight(r/10, g/10, b, 300, 300, -100);
			renderer.pointLight(r, g, b, canvasWidth/3, 300, -100);
			renderer.translate(canvasWidth/2, canvasHeight/2);
			//renderer.sphere(60);
			renderer.rotateY(angle);
			renderer.normal(0, 0, 1);
			renderer.fill(128);
			renderer.rect(-100, -100, 200, 200);
			/*pjs.beginShape(pjs.TRIANGLE_FAN);
			pjs.normal(0, 0, 1);
			pjs.fill(50, 50, 200);
			pjs.vertex(-100, 100, 0);
			pjs.vertex(100, 100, 0);
			pjs.fill(200, 50, 50);
			pjs.vertex(100, -100, 0);
			pjs.vertex(-100, -100, 0);
			pjs.endShape();
			*/
			angle += 0.01;
		};
		renderer.loop();
	},
	ants: function(){
		const canvasWidth = renderer.width;
		const canvasHeight = renderer.height;

		const NUM_ANTS = 200;
		const MAX_SPEED = 1;

		const bg = renderer.createImage();
		bg.update();

		const ps = new Particles(renderer, function(ps){
			const head = ps.list;
			let cur = head;
			while(cur.active){
				if(cur === this){
					cur = cur.next;
					if(cur === head){
						break;
					}
					continue;
				}

				cur = cur.next;
				if(cur === head){
					break;
				}
			}

			// Apply forces to acceleration
			this.last ??= xMath.roll(60);
			if(this.last++ > 60){
				this.ddx = xMath.range(-0.05, 0.05);
				this.ddy = xMath.range(-0.05, 0.05);
				this.last = 0;
			}

			this.dx += this.ddx;
			this.dy += this.ddy;

			const speed = Math.hypot(this.dx, this.dy);
			if(speed > MAX_SPEED){
				this.dx = (this.dx / speed) * MAX_SPEED;
				this.dy = (this.dy / speed) * MAX_SPEED;
			}

			const x = this.x - (3 * this.dx);
			const y = this.y - (3 * this.dy);
			this.x += this.dx;
			this.y += this.dy;
			renderer.line(this.x, this.y, x, y);

			if(this.x >= canvasWidth - 1){
				this.x = canvasWidth - 1;
				this.dx *= -1;
			}else if(this.x < 0){
				this.x = 0;
				this.dx *= -1;
			}
			if(this.y >= canvasHeight - 1){
				this.y = canvasHeight - 1;
				this.dy *= -1;
			}else if (this.y < 0){
				this.y = 0;
				this.dy *= -1;
			}
		});

		for(let i=0; i<NUM_ANTS; ++i){
			// ttl, x, y, dx, dy, r, g, b, a
			ps.createParticle(0, xMath.range(0.0001, canvasWidth), xMath.range(0.0001, canvasHeight), 0, 0, ...[207, 16, 32]);
		}

		renderer.stroke(0, 0, 0, 255);
		renderer.frame = function(){
			renderer.background(bg);
			ps.render();
		};
		renderer.loop();
	},
	balls: function(){
		renderer.init({
			showFrameRate: true,
		});
		const canvasWidth = renderer.width;
		const canvasHeight = renderer.height;
		const numBalls = 1000;
		const ballWidth = 10;
		const maxSpeed = 2;

		const grid = new Space(ballWidth*2);

		const ps = new Particles(renderer, function(){
			this.x += this.dx;
			this.y += this.dy;
			if(this.x < 0){
				this.x = 0;
				this.dx *= -1;
			}
			if(this.x > canvasWidth){
				this.x = canvasWidth;
				this.dx *= -1;
			}
			if(this.y < 0){
				this.y = 0;
				this.dy *= -1;
			}
			if(this.y > canvasHeight){
				this.y = canvasHeight;
				this.dy *= -1;
			}

			const cell = grid.get(this.x, this.y);
			for(let i=0; i<cell.length; ++i){
				const other = cell[i];
				if(other === this){
					continue;
				}
				const distance = Math.hypot(this.x - other.x, this.y - other.y);
				if(distance < ballWidth){
					const theta = Math.atan2(this.y - other.y, this.x - other.x);
					const force = (ballWidth - distance) / ballWidth;
					this.dx += Math.cos(theta) * force;
					this.dy += Math.sin(theta) * force;
					other.dx -= Math.cos(theta) * force;
					other.dy -= Math.sin(theta) * force;

					// move both balls apart
					this.x += this.dx;
					this.y += this.dy;
					other.x += other.dx;
					other.y += other.dy;
				}
			}
			grid.add(this.x, this.y, this);

			const speed = Math.hypot(this.dx, this.dy);
			if(speed > maxSpeed){
				this.dx = (this.dx / speed) * maxSpeed;
				this.dy = (this.dy / speed) * maxSpeed;
			}
		}, function(pjs){
			pjs.fill(this.r, this.g, this.b, this.a);
			pjs.stroke(this.r, this.g, this.b, this.a);
			pjs.ellipse(this.x, this.y, ballWidth, ballWidth);
		});

		for(let i=0; i<numBalls; ++i){
			// ttl, x, y, dx, dy, r, g, b, a
			const p = ps.createParticle(0, xMath.range(0.01, canvasWidth), xMath.range(0.01, canvasHeight), xMath.range(-1, 1.01), xMath.range(-1, 1.01), ...xMath.randomColor());
			grid.add(p.x, p.y, p);
		}

		renderer.frame = function(){
			renderer.background(0);
			ps.render();
		};
		renderer.loop();
	},
	boids: function(){
		const canvasWidth = renderer.width;
		const canvasHeight = renderer.height;
		const centerX = canvasWidth/2;
		const centerY = canvasHeight/2;

		const NUM_BOIDS = 200;
		const MAX_SPEED = 3;
		const TURN_RATE = 0.0005;
		const NEIGHBOR_RADIUS = 100;
		const SEPARATION_RADIUS = 40;

		const ALIGNMENT_STRENGTH = 1;
		const COHESION_STRENGTH = 1.25;
		const SEPARATION_STRENGTH = 1;
		const ATTENTION_STRENGTH = 0.75;

		const ps = new Particles(renderer, function(pjs){
			let alignmentX = 0;
			let alignmentY = 0;
			let cohesionX = 0;
			let cohesionY = 0;
			let separationX = 0;
			let separationY = 0;
			let distractionX = 0;
			let distractionY = 0;
			let total = 0;
			let separationCount = 0;

			const head = pjs.list;
			let cur = head;
			while(cur.active){
				if(cur === this){
					cur = cur.next;
					if(cur === head){
						break;
					}
					continue;
				}
				const distance = Math.hypot(this.x - cur.x, this.y - cur.y);

				// Alignment
				if(distance < NEIGHBOR_RADIUS){
					alignmentX += cur.dx;
					alignmentY += cur.dy;
					cohesionX += cur.x;
					cohesionY += cur.y;
					total++;
				}

				// Separation
				if(distance < SEPARATION_RADIUS){
					const force = (SEPARATION_RADIUS - distance) / SEPARATION_RADIUS;
					separationX += (this.x - cur.x) * force;
					separationY += (this.y - cur.y) * force;
					separationCount++;
				}
				cur = cur.next;
				if(cur === head){
					break;
				}
			}

			if(total > 0){
				// Calculate alignment (average heading)
				alignmentX /= total;
				alignmentY /= total;
				const alignmentMag = Math.hypot(alignmentX, alignmentY);
				if(alignmentMag > 0){
					alignmentX = (alignmentX / alignmentMag) * TURN_RATE * ALIGNMENT_STRENGTH;
					alignmentY = (alignmentY / alignmentMag) * TURN_RATE * ALIGNMENT_STRENGTH;
				}

				// Calculate cohesion (move toward center of mass)
				cohesionX = (cohesionX / total - this.x) * TURN_RATE * COHESION_STRENGTH;
				cohesionY = (cohesionY / total - this.y) * TURN_RATE * COHESION_STRENGTH;
			}
			if(separationCount > 0){
				// Calculate separation (avoid crowding)
				separationX /= separationCount;
				separationY /= separationCount;
				const separationMag = Math.hypot(separationX, separationY);
				if(separationMag > 0){
					separationX = (separationX / separationMag) * TURN_RATE * SEPARATION_STRENGTH;
					separationY = (separationY / separationMag) * TURN_RATE * SEPARATION_STRENGTH;
				}
			}
			if(Math.random() > ATTENTION_STRENGTH){
				const theta = Math.atan2(this.dy, this.dx) + xMath.range(-0.1, 0.1);
				const force = Math.hypot(this.dx, this.dy);
				distractionX = force * Math.cos(theta) - this.dx;
				distractionY = force * Math.sin(theta) - this.dy;
			}

			// Apply forces to acceleration
			this.ddx = alignmentX + cohesionX + separationX + distractionX;
			this.ddy = alignmentY + cohesionY + separationY + distractionY;

			this.dx += this.ddx;
			this.dy += this.ddy;

			const speed = Math.hypot(this.dx, this.dy);
			if(speed > MAX_SPEED){
				this.dx = (this.dx / speed) * MAX_SPEED;
				this.dy = (this.dy / speed) * MAX_SPEED;
			}

			const x = this.x - (3 * this.dx);
			const y = this.y - (3 * this.dy);
			this.x += this.dx;
			this.y += this.dy;
			renderer.line(this.x, this.y, x, y);

			if(this.x >= canvasWidth - 1){
				this.x = canvasWidth - 1;
				this.dx *= -1;
			}else if(this.x < 0){
				this.x = 0;
				this.dx *= -1;
			}
			if(this.y >= canvasHeight - 1){
				this.y = canvasHeight - 1;
				this.dy *= -1;
			}else if (this.y < 0){
				this.y = 0;
				this.dy *= -1;
			}
		});

		const direction = xMath.range(0, 2*Math.PI);
		for(let i=0; i<NUM_BOIDS; ++i){
			const force = xMath.range(0.001, 1) * MAX_SPEED;
			const theta = xMath.range(-0.1, 0.1);
			// ttl, x, y, dx, dy, r, g, b, a
			ps.createParticle(0, xMath.range(centerX-10.01, centerX+10), xMath.range(centerY-10.01, centerY+10), force * Math.cos(theta+direction), force * Math.sin(theta+direction), ...xMath.randomColor());
		}

		renderer.stroke(0, 0, 0, 255);
		renderer.frame = function(){
			renderer.background(0);
			ps.render();
		};
		renderer.loop();
	},
	bz: function(){
		const canvasWidth = renderer.width;

		const controls = Array.from({ length: 8 }, () => Math.random()*canvasWidth);
		const controls2 = Array.from({ length: 8 }, () => Math.random()*canvasWidth);
		const velocities = Array.from({ length: 8 }, () => Math.random()*15);

		renderer.background(255);
		renderer.noFill();
		renderer.frame = function(){
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
	cell: function(rule=30, input=false, width=200, height=200){
		renderer.init({
			background: 0,
			frameRate: 400,
			height: +height,
			width: +width
		});
		const canvasWidth = renderer.width;
		const canvasHeight = renderer.height;

		const ALIVE = 1, DEAD = 0;

		const cells = new Array(canvasWidth * canvasHeight).fill(DEAD);
		const kernel = ((ruleNumber) => {
			const ruleBinary = ruleNumber.toString(2).padStart(8, '0');

			const rules = [];
			for (let i = 0; i < 8; ++i) {
				if(+ruleBinary[7 - i]){
					rules.push(i);
				}
			}

			return (x, y) => {
				const index = (y-1) * canvasWidth + x;
				const neighbors = parseInt([
					cells[index - 1],
					cells[index],
					cells[index + 1]
				].join(''), 2);

				return rules.some((pattern) => {
					return neighbors === pattern;
				}) ? ALIVE : DEAD;
			};
		})(+rule);

		renderer.stroke(255);
		if(input === false || input === 'false'){
			cells[canvasWidth/2] = ALIVE;
			renderer.point(canvasWidth/2, 0);
		}else if(input === 'random'){
			for(let col=0; col<canvasWidth; ++col){
				if(Math.random() > 0.50){
					cells[col] = ALIVE;
					renderer.point(col, 0);
				}
			}
		}else{
			// input is a string of 1s and 0s; center on canvas
			const inputWidth = input.length;
			const start = Math.floor((canvasWidth - inputWidth) / 2);
			for(let i=0; i<inputWidth; ++i){
				if(+input[i]){
					cells[start + i] = ALIVE;
					renderer.point(start + i, 0);
				}
			}
		}

		let row = 0;
		const bottom = cells.length / canvasWidth;
		renderer.frame = function(){
			for(let col=0; col<canvasWidth; ++col){
				const cell = kernel(col, row);
				if(cell){
					cells[row * canvasWidth + col] = cell;
					renderer.point(col, row);
				}
			}
			if(row !== bottom){
				row++;
			}
		};

		renderer.loop();
	},
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
		renderer.frame = function(){
			const a = xMath.roll(attractors.length);
			x += (attractors[a].x - x)/force;
			y += (attractors[a].y - y)/force;
			renderer.point(x, y);
		};
		renderer.loop();
	},
	// coffer: function(){
	// 	renderer.init({
	// 		background: 0
	// 	});
	// 	const canvasWidth = renderer.width;
	// 	const canvasHeight = renderer.height;
	// 	const d = 100;
	// 	const r = d/2;
	// 	const r2 = Math.pow(r, 2);
	// 	const center = r*(d+1);
	// 	const spacing = 125;

	// 	const cwLookup = [];
	// 	const ccwLookup = [];
	// 	let offset;

	// 	for(let row=0; row<canvasHeight; ++row){
	// 		const color = xMath.randomGrayscale();
	// 		renderer.stroke(...color);
	// 		for(let col=0; col<canvasWidth; ++col){
	// 			renderer.point(col, row);
	// 		}
	// 	}

	// 	for(let i=0; i < r; ++i){
	// 		const x = i%r;
	// 		const y = Math.floor(i/r);
	// 		const x2 = Math.pow(x, 2);
	// 		const y2 = Math.pow(y, 2);
	// 		let ix = 0;
	// 		let iy = 0;

	// 		// if within circle
	// 		if(x2 + y2 < r2){
	// 			ix = 0;
	// 			iy = 0;
	// 		}

	// 		// generate lookup tables for clockwise and counter-clockwise
	// 		offset = (iy * canvasWidth) + ix;
	// 		cwLookup[center] = offset;
	// 		ccwLookup[center] = offset;
	// 	}

	// 	// define circles
	// 	const circles = [];
	// 	for(let i=spacing*canvasWidth+spacing; i<canvasWidth*canvasHeight; i+=spacing){
	// 		const circle = [];
	// 		for(let j=0; j<canvasWidth; ++j){
	// 			circle.push(j);
	// 		}
	// 		circles.push(circle);
	// 	}

	// 	// rotate circles via lookup
	// 	circles.forEach((circle) => {
	// 		for(let i=0; i<circle.length; ++i){
	// 		}
	// 	});

	// 	renderer.frame = function(){};
	// 	renderer.draw();
	// },
	// egg: function(){},
	fire: function(){
		renderer.init({
			background: 0,
			frameRate: 60,
			height: 300,
			showFrameRate: false,
			width: 300
		});
		const canvasWidth = renderer.width;
		const buffers = renderer.doubleBuffer();
		const gamma = renderer.createImage();
		const baseColor = renderer.color(255, 128, 96);
		const highlightColor = 0xFFFF992E;
		//0xFFB25B20;

		for(let i=0; i<gamma.length; ++i){
			gamma[i] = 0x18FA992E;
		}
		gamma.update();

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

		const ps = new Particles(renderer, function(){
			this.x += this.dx;
			this.y += this.dy;
			this.dy -= 0.05;

			if(this.x < 1){
				this.x = 1;
				this.dx *= -0.5;
			}
			if(this.x >= canvasWidth-2){
				this.x = canvasWidth-2;
				this.dx *= -0.5;
			}
			if((this.y|0) < 4){
				// console.log(this.t);
				this.active = false;
			}
		}, function(pjs){
			buffers.writeBuffer[(this.y|0)*canvasWidth + this.x] = pjs.color(this.r, this.g, this.b, this.a * (1-(this.t/this.ttl)));
		});

		renderer.frame = function(){
			const curPixels = buffers.readBuffer;
			const newPixels = buffers.writeBuffer;

			// last row, create some particles
			for(let x=0; x<canvasWidth; ++x){
				if(Math.random() > 0.97){
					// ttl, x, y, dx, dy, r, g, b, a
					ps.createParticle(xMath.range(12, 24)*4, x, numRows-1, xMath.range(-0.95, 0.95), -xMath.range(0.01, 0.0625), highlightColor);
				}
			}

			// skip first, last row
			for(let p=canvasWidth; p < newPixels.length-canvasWidth; ++p){
				// skip first, last col
				if(p%canvasWidth < 1 || p%canvasWidth >= canvasWidth-1){
					continue;
				}

				// seed a few pixels
				const row = p/canvasWidth;
				if(Math.random() < Math.pow(Math.E, Math.pow(row/numRows, 10)) - 1){
					if(Math.random() > 0.995){
						newPixels[p-1] = baseColor;
						newPixels[p+1] = baseColor;
						ps.createParticle(xMath.range(12, 24)*2, p%canvasWidth, p/canvasWidth, xMath.range(-0.3, 0.3), -xMath.range(0.01, 0.0625), baseColor);
						continue;
					}
				}

				// burn
				// apply some different color functions
				newPixels[p] = xMath.addColors(
					xMath.decodeColor(curPixels[p-1]),
					xMath.decodeColor(curPixels[p]),
					xMath.decodeColor(curPixels[p]),
					xMath.decodeColor(curPixels[p+1]),
					xMath.decodeColor(curPixels[p+canvasWidth]),
				).map((e, i) => {
					if(i===3){
						return 255;
					}
					const avg = e/5.3;
					return avg < 10 ? 0 : avg;
				});
			}
			ps.render();
			buffers.flip();
			// gamma.blit(0, 0);
		};
		renderer.loop();
	},
	fireworks: function(){
		const canvasWidth = renderer.width;
		const canvasHeight = renderer.height;
		const red = new Particles(renderer, function(){
			// update
			this.dx+=red.ACCELERATION[0];
			this.dy+=red.ACCELERATION[1];
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
			this.dx+=blue.ACCELERATION[0];
			this.dy+=blue.ACCELERATION[1];
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
			this.dx+=green.ACCELERATION[0];
			this.dy+=green.ACCELERATION[1];
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
			this.dx+=yellow.ACCELERATION[0];
			this.dy+=yellow.ACCELERATION[1];
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
			this.dx+=orange.ACCELERATION[0];
			this.dy+=orange.ACCELERATION[1];
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
			this.dx+=purple.ACCELERATION[0];
			this.dy+=purple.ACCELERATION[1];
			this.x+=this.dx;
			this.y+=this.dy;

			const t = 1-(this.t/this.ttl);
			this.r = 255*Math.pow(t, 0.2);
			this.b = 255*Math.pow(t, 0.2);
			this.g = 255*t*t*t*t;
			this.a = 255*t;
		});
		red.ACCELERATION = [0, 0.15];
		blue.ACCELERATION = [0, 0.15];
		green.ACCELERATION = [0, 0.15];
		yellow.ACCELERATION = [0, 0.15];
		orange.ACCELERATION = [0, 0.15];
		purple.ACCELERATION = [0, 0.15];

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

		renderer.frame = function(){
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
			this.dx+=ps.ACCELERATION[0];
			this.dy+=ps.ACCELERATION[1];
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
				this.dy*=-1.2*Math.random()*ps.ELASTICITY;
				if(Math.random()<0.5){
					this.dx-=this.dy;
				}else{
					this.dx+=this.dy;
				}
			}else if(this.y<0){
				this.y=0;
				this.dy*=-1*ps.ELASTICITY;
			}
			if(this.y===canvasHeight-1){
				this.active = false;
			}
		});

		const force = -20.01;
		const baseColor = [255, 255, 255, 255];
		renderer.frame = function(){
			renderer.background(0);
			for(let i=0; i<15; ++i){
				const theta = xMath.range(-0.098, 0.098);
				const r = xMath.range(force, 0.8*force);
				// ttl, x, y, dx, dy, r, g, b, a
				ps.createParticle(xMath.range(10, 30.01) * -r, canvasWidth/2, canvasHeight-20, Math.sin(theta)*r, Math.cos(theta)*r, ...baseColor);
			}
			ps.render();
		};
		renderer.loop();
	},
	graviton: function(gravity=3.4, numParticles=20){
		const canvasWidth = renderer.width;
		const canvasHeight = renderer.height;
		const centerX = canvasWidth/2;
		const centerY = canvasHeight/2;

		const starRadius = 25;

		const NUM_PARTICLES = +numParticles;
		const MAX_SPEED = 6;
		const FALLOFF = 2;
		const G = +gravity;

		const ps = new Particles(renderer, function(pjs){
			let gravX = 0;
			let gravY = 0;

			const head = pjs.list;
			let cur = head;
			while(cur.active){
				if(cur === this){
					cur = cur.next;
					if(cur === head){
						break;
					}
					continue;
				}

				const dist = xMath.distance(this.x, this.y, cur.x, cur.y);
				const theta = xMath.direction(this.x, this.y, cur.x, cur.y);
				const force = G * 3 / ((dist/3) ** FALLOFF);
				const forceX = force * Math.cos(theta);
				const forceY = force * Math.sin(theta);

				if(dist < 1){
					const theta = xMath.direction(this.x, this.y, cur.x, cur.y);
					const dx = Math.cos(theta);
					const dy = Math.sin(theta);

					const v1 = Math.hypot(this.dx, this.dy);
					const v2 = Math.hypot(cur.dx, cur.dy);

					this.dx = v2 * dx;
					this.dy = v2 * dy;
					cur.dx = v1 * dx;
					cur.dy = v1 * dy;
					break;
				}else if(dist < 3){
					gravX += -forceX * 2;
					gravY += -forceY * 2;
				}else{
					gravX += forceX;
					gravY += forceY;
				}

				// const collapsVel = Math.hypot(gravX, gravY);
				// if(collapsVel > MAX_SPEED){
				// 	gravX = 0;
				// 	gravY = 0;
				// }

				cur = cur.next;
				if(cur === head){
					break;
				}
			}

			this.ddx = gravX;
			this.ddy = gravY;

			const starDir = xMath.direction(this.x, this.y, centerX, centerY);
			const starDist = xMath.distance(this.x, this.y, centerX, centerY);
			const starForce = G * 7 / ((starDist/5) ** FALLOFF);
			const starGravX = starForce * Math.cos(starDir);
			const starGravY = starForce * Math.sin(starDir);

			if(starDist < starRadius){
				this.ddx += -starGravY * 2;
				this.ddy += -starGravX * 2;
			}else{
				this.ddx += starGravX;
				this.ddy += starGravY;
			}

			this.dx += this.ddx;
			this.dy += this.ddy;

			const speed = Math.hypot(this.dx, this.dy);
			if(speed > MAX_SPEED){
				this.dx = (this.dx / speed) * MAX_SPEED;
				this.dy = (this.dy / speed) * MAX_SPEED;
			}

			this.x += this.dx;
			this.y += this.dy;

			if(this.x >= canvasWidth - 1){
				this.x = canvasWidth - 1;
				this.dx *= -1;
			}else if(this.x < 0){
				this.x = 0;
				this.dx *= -1;
			}
			if(this.y >= canvasHeight - 1){
				this.y = canvasHeight - 1;
				this.dy *= -1;
			}else if (this.y < 0){
				this.y = 0;
				this.dy *= -1;
			}
			if(this.x === 0 && this.y === 0){
				this.x = xMath.roll(canvasWidth);
				this.y = xMath.roll(canvasHeight);
			}
		}, function(pjs){
			pjs.stroke(this.r, this.g, this.b, this.a);
			pjs.ellipse(this.x, this.y, 3, 3);
		});

		for(let i=0; i<NUM_PARTICLES; ++i){
			const force = MAX_SPEED;
			const theta = 1.25 + xMath.range(-0.088, 0.088);
			// ttl, x, y, dx, dy, r, g, b, a
			ps.createParticle(0, xMath.roll(centerX-100), xMath.roll(centerY), force * Math.cos(theta), force * Math.sin(theta), ...[255, 255, 196]);
		}

		renderer.stroke(0, 0, 0, 255);
		renderer.frame = function(){
			renderer.background(0);
			ps.render();

			renderer.fill(255, 255, 200);
			renderer.stroke(255, 255, 0);
			renderer.ellipse(centerX, centerY, starRadius, starRadius);
		};
		renderer.loop();
	},
	// lattice: function(){},
	lens: function(lensWidth=150, lensDepth=30){
		// renderer.init({
		// 	showFrameRate: true,
		// 	showRuler: true,
		// });
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

		renderer.frame = function(){
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
		* Any live cell with fewer than two live neighbours dies, as if by underpopulation.
		* Any live cell with two or three live neighbours lives on to the next generation.
		* Any live cell with more than three live neighbours dies, as if by overpopulation.
		* Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
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
		renderer.frame = function(){
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
	// orbit: function(){},
	pattern: function(full){
		const bg = renderer.createImage();
		const height = bg.height;
		for(let i=0; i<bg.length; ++i){
			bg[i] = checkerBoard(height, height/8, 255, i);
		}
		bg.update();
		renderer.background(bg);

		if(full === undefined){
			return;
		}
		renderer.init({
			showFrameRate: true,
			showRuler: true,
		});

		const Vector = renderer.PVector.bind(renderer);
		const tailPeriod = 20;
		const rotationPeriod = 360;
		const tailStartX = renderer.width/2;
		const tailStartY = renderer.height/2;
		const tailLength = Math.hypot(100, 100);

		renderer.frame = () => {
			renderer.background(0);

			const angle = Math.PI/rotationPeriod * renderer.frameCount;
			const cosAngle = Math.cos(angle);
			const sinAngle = Math.sin(angle);

			const CW = Math.PI/tailPeriod * renderer.frameCount;
			const cosCW = Math.cos(CW);
			const sinCW = Math.sin(CW);
			const cosCW2 = -sinCW;
			const sinCW2 = cosCW;

			const vTailStart = new Vector(tailStartX, tailStartY);
			const vTailDir = new Vector(cosAngle, sinAngle);
			vTailDir.setMag(tailLength);
			vTailDir.add(vTailStart);
			const v33 = new Vector(cosAngle, sinAngle);
			const v66 = new Vector(cosAngle, sinAngle);
			v33.setMag(tailLength * 0.33);
			v66.setMag(tailLength * 0.66);

			const vCtrl1 = new Vector(cosCW2, sinCW2);
			vCtrl1.setMag(v33.mag()*0.5);
			vCtrl1.add(v33);
			vCtrl1.add(vTailStart);
			const vCtrl2 = new Vector(cosCW, sinCW);
			vCtrl2.setMag(v66.mag()*0.5);
			vCtrl2.add(v66);
			vCtrl2.add(vTailStart);

			const a = new Vector(vTailDir.x, vTailDir.y);
			a.sub(vTailStart);
			const b = new Vector(vCtrl1.x, vCtrl1.y);
			b.sub(vTailStart);
			const height = (a.x * b.y - a.y * b.x) / a.mag() * 1.5;

			const vPerp = new Vector(vTailStart.x, vTailStart.y);
			vPerp.sub(vTailDir);
			const vTailEnd = new Vector(-vPerp.y, vPerp.x);
			vTailEnd.setMag(height);
			vTailEnd.add(vTailDir);

			//---------------------------------------------------

			renderer.fill(0,0,0,0);
			switch(full){
			case 'circles':
			case 'full':
				renderer.stroke(255, 0, 0, 255);
				renderer.line(vTailStart.x, vTailStart.y, vTailDir.x, vTailDir.y);
				renderer.ellipse(
					vTailStart.x+v33.x,
					vTailStart.y+v33.y,
					v33.mag(), v33.mag()
				);
				renderer.ellipse(
					vTailStart.x+v66.x,
					vTailStart.y+v66.y,
					v66.mag(), v66.mag()
				);

				renderer.stroke(0, 255, 0, 255);
				renderer.line(vTailStart.x+v33.x, vTailStart.y+v33.y, vCtrl1.x, vCtrl1.y);
				renderer.line(vTailStart.x+v66.x, vTailStart.y+v66.y, vCtrl2.x, vCtrl2.y);
				renderer.line(vTailDir.x, vTailDir.y, vTailEnd.x, vTailEnd.y);
				renderer.ellipse(
					vCtrl1.x,
					vCtrl1.y,
					3, 3
				);
				renderer.ellipse(
					vCtrl2.x,
					vCtrl2.y,
					3, 3
				);
				renderer.ellipse(
					vTailEnd.x,
					vTailEnd.y,
					3, 3
				);
				if(full === 'circles'){
					break;
				}
				/* falls through */
			case 'tail':
				renderer.stroke(255, 255, 255, 255);
				renderer.bezier(
					vTailStart.x,
					vTailStart.y,
					vCtrl1.x,
					vCtrl1.y,
					vCtrl2.x,
					vCtrl2.y,
					vTailEnd.x,
					vTailEnd.y,
				);
			}
		};
		renderer.loop();
	},
	// pendulum: function(){},
	plasma: function(){
		renderer.init({
			background: 0,
			// frameRate: 60,
			height: 300,
			width: 300
		});
		const canvasWidth = renderer.width;
		const canvasHeight = renderer.height;
		const bg = renderer.createImage();

		const sin = {};
		const colorPalette = {};

		function paletteFunc(i){
			const t = 1-(i/255);

			// const b = 255*Math.pow(t, 0.2);
			// const b = 255*Math.pow(t, 0.5);
			const b = 255*t;
			const g = 255*t*t;
			const r = 255*t*t*t*t;

			// const r = i;
			// const g = 255 - r + 1;
			// const b = Math.abs(i - 128) * 2;

			// const r = 255*Math.pow(t, 0.2);
			// const g = 255*t*t;
			// const b = 255*t*t*t*t;

			const a = 255;
			return [r, g, b, a];
		}
		for(let i=0; i<256; ++i){
			colorPalette[i] = paletteFunc(i);
		}
		for(let i = 0; i < 512; ++i){
			const rad =  (i * 0.703125) * 0.0174532; // 360 / 512 * degree to rad, 360 degrees spread over 512 values to be able to use AND 512-1 instead of using modulo 360
			sin[i] = Math.sin(rad) * 1024; // using fixed point math with 1024 as base
		}
		// console.dir(colorPalette);
		// console.dir(sin);

		let pos1 = 0;
		const pos2 = 0;
		let pos3 = 0;
		const pos4 = 0;
		let tpos1 = 0;
		let tpos2 = 0;
		let tpos3 = 0;
		let tpos4 = 0;
		renderer.frame = function(){
			tpos3 = pos3;
			tpos4 = pos4;

			for(let i=0; i < canvasHeight; ++i){
				// console.log(pos1, pos2, pos3, pos4);
				tpos1 = pos1 + 5;
				tpos2 = pos2 + 3;

				tpos3 &= 511;
				tpos4 &= 511;

				for(let j=0; j < canvasWidth; ++j){
					tpos1 &= 511;
					tpos2 &= 511;

					// renderer.point();
					const x = sin[tpos1] + sin[tpos2] + sin[tpos3] + sin[tpos4];
					const index = 128 + (x >> 4);

					// console.assert(index >= 0 && index <256, `index out of bounds: ${index}`);
					// console.log(index, colorPalette[index]);
					bg[i * canvasWidth + j] = colorPalette[index];

					tpos1 += 5;
					tpos2 += 3;
				}
				tpos3 += 1;
				tpos4 += 3;
			}
			pos1 += 9;
			pos3 += 8;

			// pos2 += 3;
			// pos4 += 5;

			bg.update();
			renderer.background(bg);
		};
		renderer.loop();
	},
	// rocks: function(){},
	rod: function(){
		const canvasWidth = renderer.width;
		const canvasHeight = renderer.height;
		const centerX = canvasWidth/2;
		const centerY = canvasHeight/2;

		let eggX = canvasWidth/2 + xMath.range(-100, 100.01),
			eggY = canvasWidth/2 + xMath.range(-100, 100.01),
			eggDx = xMath.roll(-3.01, 3),
			eggDy = xMath.roll(-3.01, 3);
		let swimX, swimY;
		const radius = 20;
		const tailLength = 12;
		const tailPeriod = 5;

		const NUM_BOIDS = 200;
		const MAX_SPEED = 3;
		const TURN_RATE = 0.0005;
		const NEIGHBOR_RADIUS = 100;
		const SEPARATION_RADIUS = 40;

		const ALIGNMENT_STRENGTH = 0.75;
		const COHESION_STRENGTH = 0.5;
		const SEPARATION_STRENGTH = 3;
		const ATTENTION_STRENGTH = 0.66;

		const ps = new Particles(renderer, function(ps){
			const alignment = {x: 0, y: 0};
			const cohesion = {x: 0, y: 0};
			const separation = {x: 0, y: 0};
			const distraction = {x: 0, y: 0};
			let total = 0;
			let separationCount = 0;

			const head = ps.list;
			let cur = head;
			while(cur.active){
				if(cur === this){
					cur = cur.next;
					if(cur === head){
						break;
					}
					continue;
				}
				const distance = Math.hypot(this.x - cur.x, this.y - cur.y);

				// Alignment
				if(distance < NEIGHBOR_RADIUS){
					alignment.x += cur.dx;
					alignment.y += cur.dy;
					cohesion.x += cur.x;
					cohesion.y += cur.y;
					total++;
				}

				// Separation
				if(distance < SEPARATION_RADIUS){
					const force = (SEPARATION_RADIUS - distance) / SEPARATION_RADIUS;
					separation.x += (this.x - cur.x) * force;
					separation.y += (this.y - cur.y) * force;
					separationCount++;
				}
				cur = cur.next;
				if(cur === head){
					break;
				}
			}
			swimX += this.x;
			swimY += this.y;

			if(total > 0){
				// Calculate alignment (average heading)
				alignment.x /= total;
				alignment.y /= total;
				const alignmentMag = Math.hypot(alignment.x, alignment.y);
				if(alignmentMag > 0){
					alignment.x = (alignment.x / alignmentMag) * TURN_RATE * ALIGNMENT_STRENGTH;
					alignment.y = (alignment.y / alignmentMag) * TURN_RATE * ALIGNMENT_STRENGTH;
				}

				// Calculate cohesion (move toward center of mass)
				cohesion.x = (cohesion.x / total - this.x) * TURN_RATE * COHESION_STRENGTH;
				cohesion.y = (cohesion.y / total - this.y) * TURN_RATE * COHESION_STRENGTH;
			}
			if(separationCount > 0){
				// Calculate separation (avoid crowding)
				separation.x /= separationCount;
				separation.y /= separationCount;
				const separationMag = Math.hypot(separation.x, separation.y);
				if(separationMag > 0){
					separation.x = (separation.x / separationMag) * TURN_RATE * SEPARATION_STRENGTH;
					separation.y = (separation.y / separationMag) * TURN_RATE * SEPARATION_STRENGTH;
				}
			}
			if(Math.random() > ATTENTION_STRENGTH){
				const theta = Math.atan2(this.dy, this.dx) + xMath.range(-0.1, 0.1);
				const force = Math.hypot(this.dx, this.dy);
				distraction.x = force * Math.cos(theta) - this.dx;
				distraction.y = force * Math.sin(theta) - this.dy;
			}

			// Apply forces to acceleration
			this.ddx = alignment.x + cohesion.x + separation.x + distraction.x + (eggX - this.x) * 0.0001;
			this.ddy = alignment.y + cohesion.y + separation.y + distraction.y + (eggY - this.y) * 0.0001;
			const eggProx = xMath.distance(this.x, this.y, eggX, eggY);
			if(eggProx < 50){
				this.ddx += (eggX - this.x) * 0.01;
				this.ddy += (eggY - this.y) * 0.01;
			}

			this.dx += this.ddx;
			this.dy += this.ddy;

			const speed = Math.hypot(this.dx, this.dy);
			if(speed > MAX_SPEED){
				this.dx = (this.dx / speed) * MAX_SPEED;
				this.dy = (this.dy / speed) * MAX_SPEED;
			}

			this.x += this.dx;
			this.y += this.dy;

			const theta = xMath.direction(this.x, this.y, this.x-this.dx, this.y-this.dy);
			const cosTheta = Math.cos(theta);
			const sinTheta = Math.sin(theta);

			const length33 = 0.33 * tailLength;
			const length66 = 0.66 * tailLength;
			const x33 = length33 * cosTheta;
			const y33 = length33 * sinTheta;
			const x66 = length66 * cosTheta;
			const y66 = length66 * sinTheta;
			const tailEndX = this.x + tailLength * cosTheta;
			const tailEndY = this.y + tailLength * sinTheta;

			this.unique ??= xMath.roll(Math.PI/2);
			const CW = Math.PI/tailPeriod * renderer.frameCount + this.unique;
			const cosCW = Math.cos(CW);
			const sinCW = Math.sin(CW);

			const ctrl1X = this.x + x33 + 0.5*(x33 * -sinCW - y33 * cosCW);
			const ctrl1Y = this.y + y33 + 0.5*(x33 * cosCW + y33 * -sinCW);
			const ctrl2X = this.x + x66 + 0.5*(x66 * cosCW - y66 * sinCW);
			const ctrl2Y = this.y + y66 + 0.5*(x66 * sinCW + y66 * cosCW);

			const deltaX = this.x - tailEndX;
			const deltaY = this.y - tailEndY;
			const length = Math.hypot(deltaX, deltaY);
			const perpX = -deltaY / length;
			const perpY = deltaX / length;
			const perpOsc = sinCW * 3;
			const tailX = tailEndX + perpX * perpOsc;
			const tailY = tailEndY + perpY * perpOsc;
			renderer.bezier(
				this.x,
				this.y,
				ctrl1X,
				ctrl1Y,
				ctrl2X,
				ctrl2Y,
				tailX,
				tailY
			);

			if(this.x >= canvasWidth - 1){
				this.x = canvasWidth - 1;
				this.dx *= -1;
			}else if(this.x < 0){
				this.x = 0;
				this.dx *= -1;
			}
			if(this.y >= canvasHeight - 1){
				this.y = canvasHeight - 1;
				this.dy *= -1;
			}else if (this.y < 0){
				this.y = 0;
				this.dy *= -1;
			}
		}, function(pjs){
			pjs.stroke(this.r, this.g, this.b, this.a);
			pjs.ellipse(this.x, this.y, 2, 2);
		});

		const direction = xMath.range(0, 2*Math.PI);
		for(let i=0; i<NUM_BOIDS; ++i){
			const force = xMath.range(0.001, 1) * MAX_SPEED;
			const theta = xMath.range(-0.1, 0.1);
			// ttl, x, y, dx, dy, r, g, b, a
			ps.createParticle(0, xMath.range(centerX-10.01, centerX+10), xMath.range(centerY-10.01, centerY+10), force * Math.cos(theta+direction), force * Math.sin(theta+direction), ...[255, 255, 255, 255]);
		}

		renderer.frame = function(){
			swimX = 0;
			swimY = 0;
			renderer.background(0);

			renderer.fill(0,0,0,0);
			renderer.stroke(255, 255, 255, 255);
			ps.render();

			swimX /= ps.count;
			swimY /= ps.count;
			eggDx += -(swimX - eggX) * 0.0001 + (centerX - eggX) * 0.0001;
			eggDy += -(swimY - eggY) * 0.0001 + (centerY - eggY) * 0.0001;
			const speed = Math.hypot(eggDx, eggDy);
			if(speed > MAX_SPEED*1.4){
				eggDx = (eggDx / speed) * MAX_SPEED*1.4;
				eggDy = (eggDy / speed) * MAX_SPEED*1.4;
			}

			eggX += eggDx;
			eggY += eggDy;

			if(eggX < 0){
				eggX = 0;
				eggDx = -eggDx;
			}
			if(eggX > canvasWidth-radius){
				eggX = canvasWidth-radius;
				eggDx = -eggDx;
			}
			if(eggY < 0){
				eggY = 0;
				eggDy = -eggDy;
			}
			if(eggY > canvasHeight-radius){
				eggY = canvasHeight-radius;
				eggDy = -eggDy;
			}

			renderer.stroke(196, 128, 196);
			renderer.fill(255, 128, 164, 128);
			renderer.ellipse(eggX, eggY, radius, radius);
		};
		renderer.loop();
	},
	// sand: function(){},
	// shader: function(){
	// 	renderer.init({
	// 		width: 600,
	// 		height: 600,
	// 		showFrameRate: true,
	// 		renderer: 'P3D'
	// 		// renderer: 'WEBGL'
	// 	});
	// 	const canvasWidth = renderer.width;
	// 	const canvasHeight = renderer.height;

	// 	const vertShaderSrc = `
	// 		attribute vec3 aPosition;
	// 		void main(){
	// 			gl_PointSize = 10.0;
	// 			gl_Position = vec4(aPosition, 1.0);
	// 		}
	// 	`;
	// 	const fragShaderSrc = `
	// 		precision mediump float;
	// 		void main(){
	// 			gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0); // Green
	// 		}
	// 	`;

	// 	const gl = renderer.externals.context;
	// 	gl.viewport(0, 0, canvasWidth, canvasHeight);

	// 	console.log('Canvas width:', gl.canvas.width, 'Height:', gl.canvas.height);
	// 	console.log('Viewport dimensions:', gl.getParameter(gl.VIEWPORT));
	// 	console.log('Max viewport dims:', gl.getParameter(gl.MAX_VIEWPORT_DIMS));
	// 	console.log('Supported extensions:', gl.getSupportedExtensions());
	// 	console.log('Max vertex attribs:', gl.getParameter(gl.MAX_VERTEX_ATTRIBS));
	// 	console.log('Max texture size:', gl.getParameter(gl.MAX_TEXTURE_SIZE));

	// 	const vertShader = compileShader(gl, vertShaderSrc, gl.VERTEX_SHADER);
	// 	const fragShader = compileShader(gl, fragShaderSrc, gl.FRAGMENT_SHADER);

	// 	// Link shaders into a program
	// 	const shaderProgram = gl.createProgram();
	// 	gl.attachShader(shaderProgram, vertShader);
	// 	gl.attachShader(shaderProgram, fragShader);
	// 	gl.linkProgram(shaderProgram);

	// 	if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
	// 		console.error('Could not link shaders:', gl.getProgramInfoLog(shaderProgram));
	// 	}

	// 	gl.useProgram(shaderProgram);

	// 	// const vertices = new Float32Array([
	// 	// 	0.0,  0.8, 0.0,  // Top
	// 	// 	-0.8, -0.8, 0.0,  // Bottom left
	// 	// 	0.8, -0.8, 0.0   // Bottom right
	// 	// ]);
	// 	const vertices = new Float32Array([
	// 		0.0, 0.0, 0.0  // Center point
	// 	]);

	// 	const vertexBuffer = gl.createBuffer();
	// 	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	// 	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	// 	const bufferData = gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE);
	// 	console.log('Buffer size (bytes):', bufferData);

	// 	const aPosition = gl.getAttribLocation(shaderProgram, 'aPosition');
	// 	gl.enableVertexAttribArray(aPosition);
	// 	gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

	// 	if(aPosition === -1){
	// 		console.error('Attribute aPosition not found in shader');
	// 		return;
	// 	}
	// 	console.log('aPosition location: ', gl.getAttribLocation(shaderProgram, 'aPosition'));

	// 	gl.disable(gl.CULL_FACE);
	// 	gl.disable(gl.DEPTH_TEST);

	// 	const error = gl.getError();
	// 	if(error !== gl.NO_ERROR){
	// 		console.error('WebGL error during setup:', error);
	// 	}

	// 	renderer.frame = function(){
	// 		gl.clearColor(0.0, 0.0, 0.0, 1.0);
	// 		gl.clear(gl.COLOR_BUFFER_BIT);

	// 		gl.drawArrays(gl.POINTS, 0, 1);
	// 		// gl.drawArrays(gl.TRIANGLES, 0, 3);
	// 		gl.flush();

	// 		const error = gl.getError();
	// 		if(error !== gl.NO_ERROR){
	// 			console.error('WebGL error during draw:', error);
	// 		}
	// 	};
	// 	renderer.loop();
	// },
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

		renderer.frame = function(){
			renderer.background(0);
			// ttl, x, y, dx, dy, r, g, b, a
			ps.createParticle(0, xMath.range(-canvasWidth/2, canvasWidth-1), 0, xMath.range(0, 0.25), xMath.range(0.4, 0.6), 255, 255, 255, xMath.range(96, 255));
			ps.render();
		};
		renderer.loop();
	},
	spiro: function(outer=true, inner=false, trace=true){
		const canvasWidth = renderer.width;
		const canvasHeight = renderer.height;
		const Vector = renderer.PVector.bind(renderer);
		const vCenter = new Vector(canvasWidth/2, canvasHeight/2);
		const vPrevInner = new Vector(0, 0);
		const vPrevOuter = new Vector(0, 0);

		const rotationPeriod = trace==='false' ? 360 : 36;
		const outerRadius = canvasWidth/2;
		const innerRadius = 100;
		const randRadius = xMath.roll(innerRadius);
		const randRadius2 = xMath.roll(outerRadius);
		const randPoint = Math.random();
		const randPoint2 = Math.random();

		const rollingRatio = (innerRadius+randRadius)/randRadius;
		const rollingRatio2 = (outerRadius-randRadius2)/randRadius2;

		renderer.frame = function(){
			const angle = Math.PI/rotationPeriod * renderer.frameCount;
			const cosAngle = Math.cos(angle);
			const sinAngle = Math.sin(angle);
			const innerAngle = Math.PI/rotationPeriod * renderer.frameCount * rollingRatio;
			const outerAngle = -Math.PI/rotationPeriod * renderer.frameCount * rollingRatio2;

			const vOuter = new Vector(cosAngle, sinAngle);
			vOuter.setMag(outerRadius - randRadius2);
			vOuter.add(vCenter);

			const vInner = new Vector(cosAngle, sinAngle);
			vInner.setMag(innerRadius + randRadius);
			vInner.add(vCenter);

			const vInnerWheel = new Vector(Math.cos(innerAngle), Math.sin(innerAngle));
			vInnerWheel.setMag(randRadius*randPoint);
			vInnerWheel.add(vInner);

			const vOuterWheel = new Vector(Math.cos(outerAngle), Math.sin(outerAngle));
			vOuterWheel.setMag(randRadius2*randPoint2);
			vOuterWheel.add(vOuter);

			if(trace === 'false'){
				renderer.background(0);

				renderer.fill(0, 0, 0, 0);
				renderer.stroke(0, 255, 0, 255);
				renderer.ellipse(vCenter.x, vCenter.y, outerRadius*2, outerRadius*2);
				renderer.ellipse(vCenter.x, vCenter.y, innerRadius*2, innerRadius*2);

				if(outer && outer !== 'false'){
					renderer.stroke(255, 255, 255, 255);
					renderer.line(vCenter.x, vCenter.y, vOuter.x, vOuter.y);
					renderer.line(vOuter.x, vOuter.y, vOuterWheel.x, vOuterWheel.y);

					renderer.stroke(255, 0, 0, 255);
					renderer.ellipse(vOuter.x, vOuter.y, randRadius2*2, randRadius2*2);
					renderer.ellipse(vOuterWheel.x, vOuterWheel.y, 2, 2);
				}

				if(inner && inner !== 'false'){
					renderer.stroke(255, 255, 255, 255);
					renderer.line(vCenter.x, vCenter.y, vInner.x, vInner.y);
					renderer.line(vInner.x, vInner.y, vInnerWheel.x, vInnerWheel.y);

					renderer.stroke(255, 0, 0, 255);
					renderer.ellipse(vInner.x, vInner.y, randRadius*2, randRadius*2);
					renderer.ellipse(vInnerWheel.x, vInnerWheel.y, 2, 2);
				}
			}else{
				renderer.stroke(255, 255, 255, 255);
				// eslint-disable-next-line no-extra-boolean-cast
				if(outer && outer !== 'false'){
					if(vPrevOuter.mag() === 0){
						vPrevOuter.set(vOuterWheel);
					}
					renderer.line(vPrevOuter.x, vPrevOuter.y, vOuterWheel.x, vOuterWheel.y);
					vPrevOuter.set(vOuterWheel);
				}

				renderer.stroke(128, 255, 128, 255);
				// eslint-disable-next-line no-extra-boolean-cast
				if(inner && inner !== 'false'){
					if(vPrevInner.mag() === 0){
						vPrevInner.set(vInnerWheel);
					}
					renderer.line(vPrevInner.x, vPrevInner.y, vInnerWheel.x, vInnerWheel.y);
					vPrevInner.set(vInnerWheel);
				}
			}
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
			const x = this.x - (3 * this.dx);
			const y = this.y - (3 * this.dy);
			this.x += this.dx;
			this.y += this.dy;
			renderer.line(this.x, this.y, x, y);
			if(this.x >= canvasWidth-1 || this.y >= canvasHeight-1 || this.x<0 || this.y<0){
				this.active = false;
			}
			const vel = Math.hypot(this.dx, this.dy);
			const dist = Math.min(xMath.distance(this.x, this.y, centerX, centerY), centerX);
			// dimmer when:
			// - slower & further
			// - faster & closer
			// - older
			//
			// the slower the less effect that distance has
			this.a = (128*Math.max(1-(dist/penumbra), 0)) + (64*(vel/10)) + (64*Math.max(1-this.t++, 0));
		});

		renderer.frame = function(){
			renderer.background(0);
			for(let i=0; i<20; ++i){
				// ttl, x, y, dx, dy, r, g, b, a
				const x = (xMath.roll(canvasWidth) + xMath.roll(canvasWidth)) / 2;
				const y = xMath.roll(canvasHeight) + xMath.roll(canvasHeight) / 2;
				const dist = Math.min(xMath.distance(x, y, centerX, centerY), centerX);
				const theta = -Math.atan2(centerY-y, x-centerX);
				const force = 10*(dist/centerX)+1;
				ps.createParticle(0, x, y, Math.cos(theta)*force, Math.sin(theta)*force, 255, 255, 255, 0);
			}
			ps.render();
		};
		renderer.loop();
	},
	// spacewar: function(){},
	// wormhole: function(){},
	// zaxxon: function(){}
};
module.exports = demos;
