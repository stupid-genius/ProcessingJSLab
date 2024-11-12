const { expect } = require('chai');
const xMath = require('../../app/client/scripts/Math');

describe('Client Tests', function(){
	describe('xMath', function(){
		it('direction', function(){
			const testCases = [
				{ x: 0, y: 0, x2: 1, y2: 1, expected: Math.PI / 4 },          // 45 degrees
				{ x: 0, y: 0, x2: -1, y2: 1, expected: (3 * Math.PI) / 4 },   // 135 degrees
				{ x: 0, y: 0, x2: -1, y2: -1, expected: -(3 * Math.PI) / 4 }, // -135 degrees
				{ x: 0, y: 0, x2: 1, y2: 0, expected: 0 },                    // 0 degrees
				{ x: 1, y: 1, x2: 4, y2: 5, expected: Math.atan2(4 - 1, 5 - 1) } // Arbitrary values
			];

			testCases.forEach(({ x, y, x2, y2, expected }) => {
				it(`calculates direction between (${x}, ${y}) and (${x2}, ${y2})`, () => {
					const result = xMath.direction(x, y, x2, y2);
					expect(result).to.be.closeTo(expected, 1e-10);
				});
			});
		});
		it('inverse sqrt', function(){
			const start = performance.now();
			for(let i=0; i<10e3; ++i){
				xMath.invSqrt(i+1);
			}
			const duration = performance.now() - start;
			console.log(`inverse sqrt: ${duration}`);
		});
		it('fast inverse sqrt', function(){
			const start = performance.now();
			for(let i=0; i<10e3; ++i){
				xMath.fastInvSqrt(i+1);
			}
			const duration = performance.now() - start;
			console.log(`fast inverse sqrt: ${duration}`);
		});
	});
});
