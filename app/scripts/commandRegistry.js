var commands = {
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
	}
};

var pages = {
	'help': 'Lists all commands; usage: help <command>',
	'load': 'Run a demo; usage: load <demo>',
	'ls': 'Lists all demos',
};
