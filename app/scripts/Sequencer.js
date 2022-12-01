/*
 * JavaScript Sequencer
 *	executes a sequence of actions based on both time-based and conditional triggers
 *
 *	triggers:
 *		global time in millis
 *		ticks?
 *		local/relative time, timer
 *		conditions?
 *	actions:
 *		registered functions, call by name
 *		callback
 *
 * line:= (event type, trigger value, action, action params)
 * 
 * event types:
 * t - global time
 * r - relative time since last event
 * e - condition: end of previous event
 * c - condition: fn (called every frame; return boolean)
 * re - shortcut for e then r
 */

/*
 *	Req:
 *		event:= (trigger,action)
 *		load script json
 *		sort event heap
 *	notes:
 *		all actions should get wrapped so that we can determine when they are done
*/

function SequencerJS(script){
	if(!(this instanceof SequencerJS)){
		return new SequencerJS(script);
	}
	if(this instanceof SequencerJS.instance){
		// load json then return instance
		loadScript(script);
		return SequencerJS.instance;
	}
	Object.defineProperty(SequencerJS, 'instance', {
		value: this
	});

	var controller = this;
	var stats = {
		globalTime: 0
	};
	function SequencedEvent(){
		if(!(this instanceof SequencedEvent)){
			return new SequencedEvent();
		}

		Object.defineProperties(this, {
			'fire': {
				value: function(){
				}
			},
			'trigger': {
				value: function(){
					
				}
			}
		});
	}

	function eventComparator(e1, e2){
	}
	function loadScript(script){
		var lines = script.split(/\n/);
		lines.map(function(e){
			var terms = e.split(/,/);
			schedule.call(terms);
		});
	}

	var heap = [];
	var actions = {};
	Object.defineProperties(this, {
		'batch': {
			value: function(newEvent){
				if(newEvent===undefined){
					heap.sort(eventComparator);
				}else{
					heap.push(newEvent);
				}
			}
		},
		/*
		 *	Registers a function as a new action
		 */
		'register': {
			value: function(name, action){
				actions[name] = action;
			}
		},
		/*
		 *	Creates a new trigger-action item
		 *	- trigger can be time string or trigger function
		 *	- action can be a function or a string referencing a registered action
		 */
		'schedule': {
			value: function(trigger, triggerValue, action, actionParams){
				this.batch(new SequencedEvent(trigger, triggerValue, action, actionParams));
				this.batch();
			}
		},
		/*
		 *	Intended to be called every frame
		 */
		'tick': {
			value: function(){
				if(heap[0].trigger()){
					var nextEvent = heap.unshift();
					nextEvent.fire();
				}
			}
		}
	});

	loadScript(script);
}
