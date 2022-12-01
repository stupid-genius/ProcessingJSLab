var commands = {
	'get': function(prop){
		return processor.getProperty(prop);
	},
	'help': function(cmd){
		if(cmd===undefined){
			this.echo('Available commands:');
			var cmds = Object.keys(commands);
			for(var cmd in cmds){
				this.echo(cmds[cmd]);
			}
		}else{
			return pages[cmd];
		}
	},
	'init': function(){
		
		processor.init();
	},
	'load': function(demoName){
		var args = [].slice.call(arguments);
		args.shift();
		demos[demoName].bind(processor, args)();
	},
	'ls': function(){
		this.echo('Available demos:');
		var cmds = Object.keys(demos);
		for(var demo in cmds){
			this.echo(cmds[demo]);
		}
	},
	'set': function(prop, val){
		return processor.setProperty(prop, val);
	}
};

var pages = {
	'help': 'Lists all commands; usage: help <command>',
	'load': 'Run a demo; usage: load <demo>',
	'ls': 'Lists all demos',
};
