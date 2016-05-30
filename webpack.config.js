var path = require('path');

module.exports = {
  entry: {
    Vote: './vote.js',
    Create: './create.js'
  },
  output: {
		filename: '[name].js',
    path: path.join('../dist/'),
		library: ['Polldozer', '[name]'],
		libraryTarget: 'var'
  }
};
