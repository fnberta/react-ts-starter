import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { resolve } from 'path';
import * as webpack from 'webpack';

const { NODE_ENV } = process.env;

const SRC_DIR = resolve(__dirname, 'src');
const BUILD_DIR = resolve(__dirname, 'build');
const PUBLIC_DIR = resolve(__dirname, 'public');
const DEV_API_PROXY_URL = 'http://localhost:3001';

const PRODUCTION = NODE_ENV === 'production';

const commonPlugins = [
  new HtmlWebpackPlugin({
    template: resolve(PUBLIC_DIR, 'index.html'),
    inject: 'body',
  }),
];

const prodPlugins = [
  new MiniCssExtractPlugin({
    filename: '[name].css',
  }),
];

const plugins = PRODUCTION ? commonPlugins.concat(prodPlugins) : commonPlugins;

const config: webpack.Configuration = {
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
        enforce: 'pre',
        loader: 'tslint-loader',
        options: {
          emitErrors: PRODUCTION,
          failOnHint: PRODUCTION,
        },
      },
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/,
        options: {
          configFileName: PRODUCTION ? 'tsconfig.build.json' : 'tsconfig.json',
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

export default config;
