const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const webpack = require('webpack');

const isProduction = process.env.NODE_ENV === 'production';
module.exports = {
	mode: isProduction ? 'production' : 'development',
	entry: './index.js',
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].[contenthash].js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.css$/,
				use: [
					isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
					'css-loader',
				],
			},
		]
	},
	optimization: {
		runtimeChunk: {
			name: 'runtime',
		},
		splitChunks: {
			chunks: 'all',
		},
	},
	plugins: [
		new webpack.EnvironmentPlugin('NODE_ENV'),
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash].css',
		}),
		new HtmlWebpackPlugin({
			template: 'index.html',
		}),
	]
};
