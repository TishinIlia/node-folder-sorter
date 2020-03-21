const yargs = require('yargs');
const path = require('path');

const argv = yargs
.usage('Usage: $0 [options]')
.help('help')
.alias('help', 'h')
.version('0.0.2')
.alias('version', 'v')
.example('$0 --src ./filesSort --dist ./dist  --delete => Sorting folder')
.option('src', {
  alias: 's',
  describe: 'Set source directory',
  demandOption: true,
  type: "string"
})
.option('dist', {
  alias: 'd',
  describe: 'Set dist path',
  default: path.join(__dirname, '/dist'),
  type: "string"
})
.option('delete', {
  alias: 'D',
  describe: 'Remove source directory',
  default: false,
  boolean: true,
  type: "boolean"
})
.epilog('Node file sorter')
.argv;

exports.argv = argv;

