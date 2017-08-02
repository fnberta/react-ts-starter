import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import { resolve } from 'path';
import * as webpack from 'webpack';

const NODE_ENV = process.env.NODE_ENV;
const SRC_DIR = resolve(__dirname, 'src');
const BUILD_DIR = resolve(__dirname, 'build');
const PUBLIC_DIR = resolve(__dirname, 'public');
const DEV_API_PROXY_URL = 'http://localhost:3001';

const isProd = NODE_ENV === 'production';

const config: webpack.Configuration = {
  entry: [
    resolve(SRC_DIR, 'index.tsx'),
  ],
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.jsx'],
  },
  devtool: isProd ? 'source-map' : 'eval',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(PUBLIC_DIR, 'index.html'),
      inject: 'body',
    }),
  ],
  devServer: {
    compress: true,
    port: 9000,
    historyApiFallback: true,
    proxy: {
      '/api': DEV_API_PROXY_URL,
    },
  },
};

export default config;
