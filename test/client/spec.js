const { expect } = require('chai');
const { Space } = require('../../app/client/scripts/Space');
const xMath = require('../../app/client/scripts/Math');

describe('Processing.js Lab', function(){
	describe.skip('FastTrig', function(){
		it('should create a singleton instance', function(){
			const trig1 = new xMath.FastTrig();
			const trig2 = new xMath.FastTrig();
			expect(trig1).to.equal(trig2);
		});
		it('should have a cosine and sine lookup table', function(){
			const trig = new xMath.FastTrig();
			expect(trig.cos).to.be.an('object');
			expect(trig.sin).to.be.an('object');
		});
	});
	describe('Space', function(){
		it('should add an item to the space', function(){
			const space = new Space();
			space.add(0, 0, 'item');
			const result = space.get(0, 0);
			expect(result).to.include('item');
		});
		it('should get all items in the cell at the given location', function(){
			const space = new Space();
			space.add(0, 0, 'item');
			space.add(9, 9, 'item2');
			const result = space.get(0, 0);
			expect(result).lengthOf(2);
			expect(result).to.include('item');
			expect(result).to.include('item2');
		});
		it('should remove an item from the space', function(){
			const space = new Space();
			space.add(0, 0, 'item');
			space.remove(0, 0, 'item');
			const result = space.get(0, 0);
			expect(result).to.not.include('item');
		});
	});
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
		// not faster at all, but just wanted to see
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
