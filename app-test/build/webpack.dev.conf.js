const path = require('path')


module.exports = {
	entry: ['./src/Gesture.js'],
	output: {
		path: path.resolve(__dirname, '../dist/'),
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
	devtool: '#eval-source-map'
}