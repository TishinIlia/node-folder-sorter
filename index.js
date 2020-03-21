const system = require('./files_systematization');
const consoleCommands = require('./console_commands');

system.filesSystematization(consoleCommands.argv.src, consoleCommands.argv.dist, consoleCommands.argv.delete);