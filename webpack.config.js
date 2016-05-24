var path = require('path');

module.exports = {
  entry: {
    Vote: './vote.js',
    Create: './create.js'
  },
  output: {
		filename: "[name].js",
    path: path.join('../polldozer/app/assets/javascripts/lib'),
		library: ["Polldozer", "[name]"],
		libraryTarget: "var"
  }
};
