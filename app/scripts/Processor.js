function Processor(canvas){
	if(!(this instanceof Processor)){
		return new Processor(canvas);
	}
	if(Processor.instance instanceof Processor){
		return Processor.instance;
	}
	Object.defineProperty(Processor, 'instance', {
		value: this
	});

	var processing;
	var pjs;
	var properties = {};

	Object.defineProperties(this, {
		'draw': {
			value: function(){
				pjs.noLoop();
			},
			writable: true
		},
		'getProcessing': {
			value: function(){
				return pjs;
			}
		},
		'getProperties': {
			value: function(){
				return properties;
			}
		},
		'getProperty': {
			value: function(name){
				return properties[name];
			}
		},
		'init': {
			value: function(fn){
				processing = new Processing(canvas, function(processingjs){
					pjs = processingjs;
					var instance = Processor.instance;

					console.log('Processing instances: %d', Processing.instances.length);
					var setupFn = fn || function(){
						pjs.size(properties['canvasWidth'], properties['canvasHeight'], pjs.P3D);
						pjs.frameRate(properties['fps'] || 60);
						console.log('using 2d');
					};
					Object.defineProperty(pjs, 'setup', {
						value: function(){
							setupFn(pjs);
						}
					});
					Object.defineProperty(pjs, 'draw', {
						value: function(){
							instance.draw();
						}
					});
					Object.defineProperty(pjs, 'keyPressed', {
						value: function(){
							switch(pjs.keyCode){
								case pjs.UP:
									pjs.loop();
									break;
								case pjs.DOWN:
									pjs.noLoop();
									break;
								case pjs.LEFT:
									pjs.save('image.png');
								case pjs.RIGHT:
									pjs.redraw();
							}
						}
					});
				});
			}
		},
		'setProperty': {
			value: function(prop, val){
				properties[prop] = val;
			}
		},
		'setup': {
			value: function(){
				console.log('default setup');
				pjs.size(properties['canvasWidth'], properties['canvasHeight']);
			},
			writable: true
		}
	});
}
