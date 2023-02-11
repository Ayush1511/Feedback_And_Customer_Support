const path = require('path');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');
// eslint-disable-next-line no-unused-vars
const CompressionPlugin = require('compression-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const { CONTEXT_PATH } = require('./server/config');

var entries = {
  '/main.js': '/src/main.js',
  '/main.css': '/src/assets/styles/main.scss',
};
module.exports = {
  entry: entries,
  experiments: {
    topLevelAwait: true
  },
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: CONTEXT_PATH,
    filename: '[name]',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      // babel
      {
        test: /\.m?jsx?$/,
        exclude: (file) => {
          // always transpile js in vue files
          if (/\.vue\.jsx?$/.test(file)) {
            return false
          }
          // Don't transpile node_modules
          return /node_modules/.test(file)
        },
        use: ['thread-loader', 'babel-loader'],
      },

      // ts
      {
        test: /\.tsx?$/,
        use: [
          'thread-loader',
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              appendTsSuffixTo: ['\\.vue$'],
              happyPackMode: true,
            },
          },
        ],
      },
      {
      test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            // options: {
            //   esModule: false,
            // },
            // options: { hmr: !env.prod }
          },
          {
            loader: "css-loader",
            options: {
              url: false
            }
          },
          {
            // Then we apply postCSS fixes like autoprefixer and minifying
            loader: "postcss-loader",
          },
          {
            // First we transform SASS to standard CSS
            loader: "sass-loader",
            options: {
              implementation: require("sass"),
            },
          },
        ],
      },
      {

        test: /\.(png|jpe?g|gif|svg)$/,

        type: "asset/resource",
        generator: {

          filename: "src/assets/images/[name][ext]",

        },
        

      },
      {

        // Apply rule for fonts files

        test: /\.(woff|woff2|ttf|otf|eot)$/,

        type: "asset/resource",
        generator: {

          filename: "src/assets/fonts/global/[name][ext]",

        },

      },
      {

        test: /\.(cur|ani)$/,

        loader: "file-loader",

        options: {

          name: "[name].[ext]?[hash]",

          publicPath: "/",

        },

      },
      // {
      // test: /\.(png|jpe?g|gif)$/i,
      // use: [
      //    {
      //       loader: 'file-loader',
      //    },
      // ],
      // }
    ],
  },
  devServer: {
    port: 4000,
    hot: true,
    writeToDisk:true,
    static: {
      directory: path.join(__dirname, '/dist'),
      publicPath: CONTEXT_PATH,
    },
    historyApiFallback: {
      index: CONTEXT_PATH,
    },
  },
  resolve: {
    alias: {
      utils: path.resolve(__dirname, '/src/utils/'),
    },
  },
  plugins: [
    new CaseSensitivePathsPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
      meta: { viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no' },
      hash: true,
      title: 'New Generation Wallet',
    }),
    new webpack.ProvidePlugin({
      // process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.DefinePlugin({
      'process.env.API_END_POINT': JSON.stringify(process.env.API_END_POINT),
      'process.env.VERIFY_USER': JSON.stringify(process.env.VERIFY_USER),
    }),
    new CopyPlugin({
      patterns: 
      [
        { from: path.resolve("./src/assets/fonts"), to: path.resolve("./dist/src/assets/fonts") },
        
        // { from: './default/src/logo512.png', to: '' },
      ],
      
    }),
    //    new CompressionPlugin({
    //     filename(info) {
    //        return `${info.path}.gz${info.query}`;
    //     },
    //     algorithm: 'gzip',
    //     test: /\.(jsx|js|css|html|svg)$/,
    //     threshold: 8192,
    //     minRatio: 0.8
    //  })
  ],
};
