Function.prototype.bind = function(){ 
	var fn = this,
		args = Array.prototype.slice.call(arguments),
		object = args.shift(); 
	return function(){ 
		return fn.apply(object, args.concat(Array.prototype.slice.call(arguments))); 
	}; 
};

var processor = new Processor();
var windowHeight = $(window).height();
processor.setProperty('canvasWidth', windowHeight);
processor.setProperty('canvasHeight', windowHeight);
processor.init($('#canvas')[0]);

$('#console').width($(window).width()-windowHeight);
var terminal = $('#console').terminal(commands, {
	prompt: '> ',
	greetings: 'Processing.js Lab'
});
