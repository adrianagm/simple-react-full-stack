const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const outputDirectory = 'dist';

module.exports = {
	entry: {
		tableLogos: './src/client/TableLogos/index.js',
		editLogo: './src/client/EditLogo/index.js'
	},

	output: {
		path: path.join(__dirname, outputDirectory),
		filename: '[name].js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.css$/,
				use: [ 'style-loader', 'css-loader' ]
			},
			{
				test: /\.(png|woff|woff2|eot|ttf|svg)$/,
				loader: 'url-loader?limit=100000'
			}
		]
	},
	devServer: {
		port: 3000,
		open: true,
		proxy: {
			'/api': 'http://localhost:8080'
		}
	},
	plugins: [
		new HtmlWebpackPlugin({
			chunks: [ 'tableLogos' ],
			favicon: './public/favicon.ico',
			template: './public/index.html',
			filename: 'index.html'
		}),
		new HtmlWebpackPlugin({
			chunks: [ 'editLogo' ],
			favicon: './editLogo/favicon.ico',
			template: './editLogo/index.html',
			filename: './editLogo/index.html'
		})
	]
};
