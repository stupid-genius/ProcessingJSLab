/**
 * Event Orchestrator
 * executes a sequence of actions based on both time-based and conditional triggers
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
