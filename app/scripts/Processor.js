function Processor(){
	var processing;
	var pjs;
	var properties = {};

	if(!(this instanceof Processor)){
		return new Processor();
	}
	if(Processor.instance instanceof Processor){
		return Processor.instance;
	}
	Object.defineProperty(Processor, 'instance', {
		value: this
	});

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
			value: function(canvas){
				processing = new Processing(canvas, function(processingjs){
					pjs = processingjs;
					var instance = Processor.instance;

					Object.defineProperty(pjs, 'setup', {
						value: function(){
							pjs.size(properties['canvasWidth'], properties['canvasHeight']);
							instance.setup();
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
									//pjs.save('image.png');
								case pjs.RIGHT:
								default:
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
			value: function(){},
			writable: true
		},
	});
}
