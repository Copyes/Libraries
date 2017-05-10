
const path = require('path')
module.exports = {
	// entry: [path.resolve(__dirname, '../src/Gesture.js')],
	entry: ['./src/Gesture.js'],
	output: {
		path: path.resolve(__dirname, '../dist'),
		publicPath: '/',
		filename: 'Gesture.js',
		library: 'Gesture',
		libraryTarget: 'umd'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader'
			}
		]
	},

}