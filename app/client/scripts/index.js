const Logger = require('log-ng').default;
const { Executor } = require('./Executor');
require('./Terminal');
const { Renderer } = require('./Renderer');

// Logger.setLogLevel('debug');
const logger = new Logger('index.js');

window.addEventListener('load', () => {
	logger.info('Creating renderer');
	const canvas = document.querySelector('canvas');
	const rect = canvas.getBoundingClientRect();
	canvas.width = rect.width;
	canvas.height = rect.height;
	logger.debug(`initial canvas width (${canvas.width}) height (${canvas.height})`);
	Renderer(canvas);

	logger.info('Creating executor');
	const terminal = document.querySelector('ng-terminal');
	const execLogger = new Logger('Executor.js');
	terminal.executor = Executor.bind(terminal)(execLogger, require('./registry'));
});
