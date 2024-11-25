const Logger = require('log-ng').default;
// const Processing = require('https://cdnjs.cloudflare.com/ajax/libs/processing.js/1.4.7/processing.min.js');
// import * as Processing from 'https://cdnjs.cloudflare.com/ajax/libs/processing.js/1.4.7/processing.min.js';
// import 'https://cdnjs.cloudflare.com/ajax/libs/processing.js/1.4.7/processing.min.js';
// let Processing;

/*
 * TODO
 * - [ ] Implement `showFrameRate`
 * - [ ] Implement `showRuler`
 * - [ ] Implement `pixelWidth`
 * - [ ] Implement `pixelHeight`
 */

const logger = new Logger('Renderer.js');

function Image(pimage, pjs){
	if(!new.target){
		return new Image(...arguments);
	}

	const pixels = pimage.pixels.toArray();
	const length = pixels.length;
	// if this ends up being too slow, just expose pixels, directly
	const proxy = new Proxy(pimage, {
		get: function(target, prop, receiver){
			// logger.trace(`getting ${JSON.stringify(prop)}`);
			if(typeof prop === 'string' && !isNaN(prop)){
				const index = +prop;
				if(Number.isInteger(index) && index >= 0 && index < length){
					// logger.trace(`get index ${index}, value ${pixels[index]}`);
					return pixels[index];
				}
			}else{
				// logger.debug(`getting ${prop}`);
				return Reflect.get(target, prop, receiver);
			}
		},
		set: function(target, prop, value, receiver){
			// logger.trace(`setting ${JSON.stringify(prop)}`);
			if(typeof prop === 'string' && !isNaN(prop)){
				const index = Math.round(+prop);
				if(Number.isInteger(index) && index >= 0 && index < length){
					// logger.trace(`set index ${index}, value ${value}`);
					pixels[index] = Array.isArray(value) ? pjs.color(...value) : value;
				}else{
					logger.noop(`index ${index} out of range, ${length}`);
				}
			}else{
				// logger.debug(`setting ${prop}`);
				return Reflect.set(target, prop, value, receiver);
			}
		}
	});

	pimage.loaded = true;
	Object.defineProperties(proxy, {
		blit: {
			value: function(x, y){
				pimage.pixels.set(pixels);
				pjs.image(pimage, x, y);
			}
		},
		length: {
			value: pixels.length
		},
		update: {
			value: function(){
				// logger.debug('pixels updated');
				pimage.pixels.set(pixels);
			}
		}
	});
	return proxy;
}

function DoubleBuffer(renderer){
	if(!new.target){
		return new DoubleBuffer(...arguments);
	}

	let selector = 0;
	const buffers = [];
	Object.defineProperties(buffers, {
		flip: {
			value: function(){
				selector ^= 1;
				// logger.debug(`flipped to ${selector}`);
			}
		},
		read: {
			get: function(){
				// logger.debug(`read selector: ${selector}`);
				return this[selector ^ 1];
			}
		},
		write: {
			get: function(){
				// logger.debug(`write selector: ${selector ^ 1}`);
				return this[selector];
			}
		}
	});
	const buffer1 = renderer.createImage();
	buffers.push({
		buffer: buffer1,
		get pixels(){
			return buffer1.pixels.toArray();
		}
	});
	const buffer2 = renderer.createImage();
	buffers.push({
		buffer: buffer2,
		get pixels(){return buffer2.pixels.toArray();}
	});

	Object.defineProperties(this, {
		flip: {
			value: function(){
				// logger.debug('flip buffers');
				// console.assert(buffers.write !== buffers.read, 'Read/Write buffers should not be the same object');
				const buffer = buffers.write.buffer;
				buffer.update();
				renderer.background(buffer);
				buffers.flip();
			}
		},
		readBuffer: {
			get: function(){
				// logger.debug(`get read buffer (${selector})`);
				return buffers.read.pixels;
			}
		},
		writeBuffer: {
			get: function(){
				return buffers.write.buffer;
			}
		}
	});
}

function Renderer(canvas){
	if(Renderer.instance !== undefined){
		return Renderer.instance;
	}
	if(!new.target){
		return new Renderer(...arguments);
	}
	const proxy = new Proxy(this, {
		get: function(target, prop){
			return target[prop] ?? pjs[prop];
		}
	});

	Object.defineProperty(Renderer, 'instance', {
		value: proxy
	});

	// { Processing, PFont } = await import('https://cdnjs.cloudflare.com/ajax/libs/processing.js/1.4.7/processing.min.js');
	// console.dir(Processing);

	const defaultConfig = {
		background: 0xFF0A110A,
		frameRate: 60,
		height: canvas.height,
		showFrameRate: false,
		showRuler: false,
		width: canvas.width
	};
	let pjs;
	let showFrameRate = false;
	let showRuler = false;
	const rulerInc = 50;

	// text output location
	// const xOut = 0;
	// const yOut = 0;
	// const sizeOut = 12;
	const maxOut = 5;
	const out = [];

	Object.defineProperties(this, {
		createImage: {
			value: function(width, height){
				const img = pjs.createImage(width ?? canvas.width, height ?? canvas.height);
				return new Image(img, pjs);
			}
		},
		frame: {
			set: function(fn){
				const xCenter = pjs.width/2;
				const yCenter = pjs.height/2;

				const newFn = new Proxy(fn, {
					apply: function(target, thisArg, args){
						target.apply(thisArg, args);
						if(showFrameRate){
							pjs.fill(255);
							pjs.textSize(12);
							pjs.text(pjs.__frameRate, pjs.width-50, pjs.height-10);
						}
						if(showRuler){
							pjs.stroke(255);
							pjs.line(0, yCenter, pjs.width, yCenter);
							pjs.line(xCenter, 0, xCenter, pjs.height);
							for(let i=rulerInc; i<pjs.width; i+=rulerInc){
								pjs.point(xCenter+i, yCenter-1);
								pjs.point(xCenter-i, yCenter-1);
								pjs.point(xCenter+i, yCenter+1);
								pjs.point(xCenter-i, yCenter+1);
							}
							for(let i=rulerInc; i<pjs.height; i+=rulerInc){
								pjs.point(xCenter-1, yCenter+i);
								pjs.point(xCenter-1, yCenter-i);
								pjs.point(xCenter+1, yCenter+i);
								pjs.point(xCenter+1, yCenter-i);
							}
						}
					}
				});
				Object.defineProperty(pjs, 'draw', {
					value: newFn,
					writable: true
				});
				logger.debug('pjs.draw set');
			}
		},
		doubleBuffer: {
			value: function(){
				return new DoubleBuffer(this);
			}
		},
		echo: {
			value: function(text){
				out.push(text);
				if(out.length > maxOut){
					out.shift();
				}
			}
		},
		init: {
			value: function(custom){
				if(pjs !== undefined){
					pjs.exit();
					pjs = undefined;
					const newCanvas = document.createElement('canvas');
					canvas.replaceWith(newCanvas);
					canvas = newCanvas;
				}
				const config = Object.assign({}, defaultConfig, custom);
				/* eslint-disable-next-line no-undef */
				pjs = new Processing(canvas, (processingjs) => {
					logger.info('Processing.js created');
					logger.debug(`canvas width (${canvas.width}) height (${canvas.height})`);

					Object.defineProperties(processingjs, {
						keyPressed: {
							value: function(){
								switch(processingjs.keyCode){
								case processingjs.UP:
									processingjs.loop();
									break;
								case processingjs.DOWN:
									processingjs.noLoop();
									break;
								case processingjs.LEFT:
									processingjs.save('image.png');
									break;
								case processingjs.RIGHT:
									processingjs.redraw();
								}
							},
							writable: true
						},
						setup: {
							value: function(){
								processingjs.size(config.width, config.height, processingjs[config.renderer]);
								logger.debug(`processingjs width (${processingjs.width}) height (${processingjs.height}) ${processingjs.use3DContext}`);
								processingjs.frameRate(config.frameRate);
								processingjs.noLoop();
								processingjs.background(config.background);

								showFrameRate = config.showFrameRate;
								showRuler = config.showRuler;
								logger.info('Processing.js setup');
							},
							writable: true
						}
					});
				});
			}
		},
		input: {
			set: function(fn){
				logger.debug('keyPressed set');
				Object.defineProperty(pjs, 'keyPressed', {
					value: fn,
					writable: true
				});
			}
		},
		pixelHeight: {
			get: function(){
				return 0;
			}
		},
		pixelWidth: {
			get: function(){
				return 0;
			}
		},
	});
	this.init();

	return proxy;
}


module.exports = {
	DoubleBuffer,
	Image,
	Renderer
};