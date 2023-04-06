module.exports = {
  mode: 'production',
  devtool: 'inline-source-map',
    entry: './src/slider.js',
    output: {
        filename: 'main.js'
    },
    
    module: {
        rules: [
          {
            test: /\.css$/i,
            
            use: ["style-loader", "css-loader"],
            
          },
          {
            test: /\.(?:js|mjs|cjs)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: "defaults" }]
                ]
              }
            }
          },
          
        ],
        
      },
}