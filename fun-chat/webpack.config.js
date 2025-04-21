import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { fileURLToPath } from 'url';
// import CopyPlugin from 'copy-webpack-plugin';
// import { plugin } from 'typescript-eslint';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  // plugins: [
  //   new CopyPlugin({
  //     patterns: [{ from: 'src/header/favicon.png', to: 'favicon.png' }],
  //   }),
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      favicon: './src/header/my-favicon.png',
    }),
  ],
  devtool: 'source-map',
  mode: 'development',

  devServer: {
    static: './dist',
    compress: true,
    historyApiFallback: true,
    hot: true,
  },
};
