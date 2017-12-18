
let path = require('path');


let config = {
	module: {
		rules: [{
			test:    /\.js$/,
			exclude: /(node_modules)/,
			use: {
				loader:  'babel-loader',
				options: {
					presets: ['env']
				}
			}
		}]
	}
};

let lib = Object.assign({}, config, {
	entry: "./src/density-plot.js",
	output: {
		libraryTarget: "var",
		library: "densityPlot",
		path: path.resolve(__dirname, 'dist'),
		filename: 'density-plot.js'
	}
});

let app = Object.assign({}, config,{
	entry: "./example/app.js",
	output: {
		path: path.resolve(__dirname, 'example/assets'),
		filename: "app.js"
	}
});


module.exports = [lib, app];