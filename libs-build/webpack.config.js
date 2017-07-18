const webpack = require("webpack");
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const path = require('path');
// node.js 命令行框架 yargs,获取里面的配置项信息
const env = require('yargs').argv.env;
// 你的lib的名字，可以考虑可配
let libraryName = 'swiper';
// 插件列表和将要输出的文件名
let plugins = [], outputFile;
// 根据判断要构建什么样的版本
if(env === 'build'){
	plugins.push(new UglifyJsPlugin({ minimize: true }));
	outputFile = libraryName + '.min.js';
}else{
	outputFile = libraryName + '.js';
}
// webpack配置
const config = {
	devtool: 'source-map',
	// 入口文件
	entry: __dirname + '/src/swiper.js',
	// 出口文件
	output: {
		path: __dirname + '/lib',
		filename: outputFile,
		//如果设置此选项，会将 bundle 导出为 library。output.library 是 library 的名称。
		//如果你正在编写 library，并且需要将其发布为单独的文件，请使用此选项。
		library: libraryName, 	
		// library 的导出格式				
		libraryTarget: 'umd',   
		umdNamedDefine: true
	},
	// 指定了每个文件在处理过程中将被哪些模块处理,因为我们是es6写的，所以用babel,eslint也可以打开
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
	// 解析
	resolve: {
		modules: [path.resolve('./src')], // 告诉 webpack 解析模块时应该搜索的目录。
		extensions: ['.json', '.js']  // 自动解析确定的扩展。默认值为：
	},
	plugins: plugins
};

module.exports = config;