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
	distance: (x, y, x2, y2) => {
		return Math.hypot(Math.abs(x2-x), Math.abs(y2-y));
	},
	fastInvSqrt: () => {
		return 1;
	},
	fastTrig: FastTrig(),
	randomColor: (alpha=false) => {
		const color = Array.from({length: 3}, () => xMath.roll(255));
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
