const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const config = require('./build/webpack.dev.conf.js');


config.entry.unshift("webpack-dev-server/client?http://localhost:9090/");
const compiler = webpack(config);

const server = new webpackDevServer(compiler, {});

server.listen(9090);
