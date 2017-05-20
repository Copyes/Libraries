const webpack = require("webpack");
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const path = require('path');
const env = require('yargs').argv.env;

let libraryName = 'Gesture';

let plugins = [], outputFile;

if(env === 'build'){
	plugins.push(new UglifyJsPlugin({ minimize: true }));
	outputFile = libraryName + '.min.js';
}else{
	outputFile = libraryName + '.js';
}
const config = {
	devtool: 'source-map',
	// 入口文件
	entry: __dirname + '/src/index.js',
	// 出口文件
	output: {
		path: __dirname + '/lib',
		filename: outputFile,
		library: libraryName,
		libraryTarget: 'umd',
		umdNamedDefine: true
	},
	// 指定了每个文件在处理过程中将被哪些模块处理
	module: {	
		rules: [
			{
				test: /(\.jsx|.\js)$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},
			// {
			// 	test: /(\.jsx|.\js)$/,
			// 	loader: 'eslint-loader',
			// 	exclude: /node_modules/
			// }
		]
	},
	resolve: {
		modules: [path.resolve('./src')],
		extensions: ['.json', '.js']
	},
	plugins: plugins
};

module.exports = config;