const path = require("path");

module.exports = {
	entry: "./src/ts/index.ts",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
			{
				test: /\.wasm$/,
				type: "javascript/auto",
				loader: "file-loader",
				options: {
					name: "[name].[ext]",
				},
			},
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
	output: {
		filename: "index.js",
		path: path.resolve(__dirname, "dist"),
		library: "MyCppLib",
		libraryTarget: "umd",
		globalObject: "this",
	},
};
