const yargs = require('yargs');
const path = require('path');
const paths = {
  src: null,
  dist: null
};

const argv = yargs
.usage('Usage: $0 [options]')
.help('help')
.alias('help', 'h')
.version('0.0.1')
.alias('version', 'v')
.example('$0 --entry ./filesSort --output ./dist  --delete => Sorting folder')
.option('entry', {
  alias: 'e',
  describe: 'Set source directory',
  demandOption: true,
  type: "string"
})
.option('output', {
  alias: 'o',
  describe: 'Set dist path',
  default: '/dist',
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

console.log(argv);