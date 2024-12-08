const Logger = require('log-ng').default;
const xMath = require('./Math');
const Particles = require('./Particles');
const { Renderer } = require('./Renderer');

Logger.setLogLevel('debug');
const logger = new Logger('rod.js');
let renderer;

window.addEventListener('load', () => {
	logger.info('Creating renderer');
	const canvas = document.querySelector('canvas');
	const rect = canvas.getBoundingClientRect();
	canvas.width = rect.width;
	canvas.height = rect.height;
	logger.debug(`initial canvas width (${canvas.width}) height (${canvas.height})`);
	renderer = Renderer(canvas);

	demo.apply(renderer);
});

function demo(){
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
}
