function FastTrig(){
	if(FastTrig.instance instanceof FastTrig){
		return FastTrig.instance;
	}
	if(!new.target){
		return new FastTrig(...arguments);
	}
	Object.defineProperty(FastTrig, 'instance', {
		value: this
	});

	const RADIANS = Math.PI/180;
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
	for(let d=0; d<=360; ++d){
		Object.defineProperty(this.cos, d, {
			value: Math.cos(d*RADIANS)
		});
		Object.defineProperty(this.sin, d, {
			value: Math.sin(d*RADIANS)
		});
	}
}

const xMath = Object.freeze({
	addColors: (...colors) => {
		if(colors.length === 0){
			return [];
		}

		return colors[0].map((_, index) =>
			// Math.min(colors.reduce((sum, color) => sum + color[index], 0), 255)
			colors.reduce((sum, color) => sum + color[index], 0)
		);
	},
	decodeColor: (ARGB) => {
		return [
			(ARGB >> 16) & 0xFF,
			(ARGB >> 8) & 0xFF,
			ARGB & 0xFF,
			(ARGB >>> 24)
		];
	},
	direction: (x, y, x2, y2) => {
		return Math.atan2(y2-y, x2-x);
	},
	distance: (x, y, x2, y2) => {
		return Math.hypot(Math.abs(x2-x), Math.abs(y2-y));
	},
	// this is not fast, at all!
	fastInvSqrt: (x) => {
		const threeHalfs = 1.5;

		const i = new Float32Array([x]);
		const y = new Float32Array([x]);
		const i32 = new Int32Array(i.buffer);

		i32[0] = 0x5f3759df - (i32[0] >> 1);
		y[0] = i[0];
		y[0] = y[0] * (threeHalfs - (x * 0.5 * y[0] * y[0]));

		return y[0];
	},
	fastTrig: FastTrig(),
	intersection: (x1, y1, x2, y2, x3, y3, x4, y4) => {
		const d = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4);
		if(d === 0){
			return null;
		}

		const a = x1*y2 - y1*x2;
		const b = x3*y4 - y3*x4;
		const x = (a*(x3-x4) - (x1-x2)*b) / d;
		const y = (a*(y3-y4) - (y1-y2)*b) / d;

		return [x, y];
	},
	invSqrt: (x) => {
		return 1 / Math.sqrt(x);
	},
	randomColor: (alpha=false) => {
		const color = Array.from({length: 3}, () => xMath.roll(255));
		color.push(alpha ? xMath.roll(255) : 255);
		return color;
	},
	randomGrayscale: (alpha=false) => {
		const component = xMath.roll(255);
		const color = Array.from({length: 3}, () => component);
		color.push(alpha ? xMath.roll(255) : 255);
		return color;
	},
	range: (min, max) => {
		let real = Math.random() * (max - min);
		if(Number.isInteger(min) && Number.isInteger(max)){
			real = Math.floor(real);
		}
		return real + min;
	},
	roll: (d) => {
		return Math.floor(Math.random() * d??Number.MAX_SAFE_INTEGER);
	}
});

module.exports = xMath;
