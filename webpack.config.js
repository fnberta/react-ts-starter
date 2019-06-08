const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { resolve } = require('path');

const { NODE_ENV } = process.env;

const SRC_DIR = resolve(__dirname, 'src');
const BUILD_DIR = resolve(__dirname, 'build');
const PUBLIC_DIR = resolve(__dirname, 'public');
const DEV_API_PROXY_URL = 'http://localhost:3001';

const PRODUCTION = NODE_ENV === 'production';

const plugins = [
  new HtmlWebpackPlugin({
    title: 'React TS Starter Kit',
    template: resolve(PUBLIC_DIR, 'index.ejs'),
  }),
];

if (PRODUCTION) {
  plugins.push(new MiniCssExtractPlugin({ filename: '[name].css' }));
}

module.exports = {
  mode: PRODUCTION ? 'production' : 'development',
  entry: [resolve(SRC_DIR, 'index.tsx')],
  output: {
    path: BUILD_DIR,
    filename: '[name].bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.mjs', '.js', '.json', '.jsx'],
  },
  devtool: PRODUCTION ? 'hidden-source-map' : 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          configFile: PRODUCTION ? 'tsconfig.build.json' : 'tsconfig.json',
          onlyCompileBundledFiles: true,
        },
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
        },
      },
      {
        test: /\.css$/,
        use: [
          PRODUCTION
            ? MiniCssExtractPlugin.loader
            : {
                loader: 'style-loader',
                options: {
                  insertAt: 'top',
                },
              },
          'css-loader',
        ],
      },
    ],
  },
  plugins,
  devServer: {
    compress: true,
    port: 9000,
    historyApiFallback: true,
    proxy: {
      '/api': DEV_API_PROXY_URL,
      '/graphql': DEV_API_PROXY_URL,
    },
  },
};
