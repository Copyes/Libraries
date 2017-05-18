const webpack = require("webpack");
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

const path = require('path');
const env = require('yargs').argv.env;

let libraryName = 'Library';

let plugins = [], outputFile;

if(env === 'build'){
	
	plugins.push(new UglifyJsPlugin({ minimize: true }));

}else{
	outputFile = libraryName + '.js';
}
const config = {
	devtool: 'source-map',
	entry: __dirname + '/src/index.js',
	output: {
		path: __dirname + '/lib',
		filename: outputFile,
		library: libraryName,
		libraryTarget: 'umd',
		umdNameDefine: true
	},
	// 指定了每个文件在处理过程中将被哪些模块处理
	module: {	
		rules: [
			{
				test: /(\.jsx|.\js)$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		modules: [path.resolve('./src')],
		extensions: ['.json', '.js']
	},
	plugins: plugins
};

module.exports = config;