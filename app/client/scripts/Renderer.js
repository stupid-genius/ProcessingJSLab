const Logger = require('log-ng').default;
// const Processing = require('https://cdnjs.cloudflare.com/ajax/libs/processing.js/1.4.7/processing.min.js');
// import * as Processing from 'https://cdnjs.cloudflare.com/ajax/libs/processing.js/1.4.7/processing.min.js';
// import 'https://cdnjs.cloudflare.com/ajax/libs/processing.js/1.4.7/processing.min.js';
// let Processing;

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
			logger.silly(`getting ${prop}`);
			if(typeof prop === 'string' && !isNaN(prop)){
				const index = +prop;
				if(Number.isInteger(index) && index >= 0 && index < length){
					logger.silly(`get index ${index}, value ${pixels[index]}`);
					return pixels[index];
				}
			}else{
				// logger.debug(`getting ${prop}`);
				return Reflect.get(target, prop, receiver);
			}
		},
		set: function(target, prop, value, receiver){
			logger.silly(`setting ${prop}`);
			if(typeof prop === 'string' && !isNaN(prop)){
				const index = +prop;
				if(Number.isInteger(index) && index >= 0 && index < length){
					logger.silly(`set index ${index}, value ${value}`);
					pixels[index] = Array.isArray(value) ? pjs.color.apply(this, value) : value;
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
				logger.debug('pixels updated');
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
				logger.debug(`flipped to ${selector}`);
			}
		},
		read: {
			get: function(){
				logger.debug(`read selector: ${selector}`);
				return this[selector ^ 1];
			}
		},
		write: {
			get: function(){
				logger.debug(`write selector: ${selector ^ 1}`);
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
				logger.debug('flip buffers');
				// console.assert(buffers.write !== buffers.read, 'Read/Write buffers should not be the same object');
				const writeBuf = buffers.write;
				const buffer = writeBuf.buffer;
				buffer.update();
				renderer.background(buffer);
				buffers.flip();
			}
		},
		readBuffer: {
			get: function(){
				logger.debug(`get read buffer (${selector})`);
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

	// { Processing, PFont } = await import('https://cdnjs.cloudflare.com/ajax/libs/processing.js/1.4.7/processing.min.js');
	// console.dir(Processing);

	let setupFn = (pjs)=>{
		pjs.background(10, 17, 10);
		// pjs.background(0xA110AFF);
		pjs.frameRate(60);
		pjs.noLoop();
	};
	let drawFn = ()=>{};
	let keyFn = ()=>{
		switch(pjs.keyCode){
		case pjs.UP:
			pjs.loop();
			break;
		case pjs.DOWN:
			pjs.noLoop();
			break;
		case pjs.LEFT:
			pjs.save('image.png');
			break;
		case pjs.RIGHT:
			pjs.redraw();
		}
	};
	/* eslint-disable-next-line no-undef */
	const pjs = new Processing(canvas, (pjs) => {
		logger.info('Processing.js created');
		logger.debug(`canvas width (${canvas.width}) height (${canvas.height})`);
		pjs.size(canvas.width, canvas.height);
		logger.debug(`pjs width (${pjs.width}) height (${pjs.height})`);

		Object.defineProperties(pjs, {
			draw: {
				get: function(){
					return drawFn;
				}
			},
			keyPressed: {
				get: function(){
					return keyFn;
				}
			},
			setup: {
				get: function(){
					return setupFn.bind(this, pjs);
				}
			}
		});
	});

	Object.defineProperties(this, {
		createImage: {
			value: function(width, height){
				const img = pjs.createImage(width ?? canvas.width, height ?? canvas.height, pjs.WEBGL);
				return new Image(img, pjs);
			}
		},
		draw: {
			set: function(fn){
				logger.debug('drawFn set');
				drawFn = fn;
			}
		},
		doubleBuffer: {
			value: function(){
				return new DoubleBuffer(this);
			}
		},
		init: {
			value: () => pjs.setup()
		},
		input: {
			set: function(fn){
				logger.debug('keyFn set');
				keyFn = fn;
			}
		},
		setup: {
			set: function(fn){
				logger.debug('setupFn set');
				setupFn = fn;
			}
		}
	});

	const proxy = new Proxy(this, {
		get: function(target, prop){
			return target[prop] ?? pjs[prop];
		}
	});

	Object.defineProperty(Renderer, 'instance', {
		value: proxy
	});

	return proxy;
}

module.exports = {
	DoubleBuffer,
	Image,
	Renderer
};
