const path = require('path');

module.exports = {
  // transpileDependencies: ['vuetify'],
  // lintOnSave: false,
  configureWebpack: {
    resolve: {
      alias: {
        'lib': path.resolve(__dirname, './lib'),
        // 'vuetify': path.resolve(__dirname, 'node_modules/vuetify'),
        'ag-grid-community': path.resolve(__dirname, 'node_modules/ag-grid-community'),
        'ag-grid-enterprise': path.resolve(__dirname, 'node_modules/ag-grid-enterprise')
      }
    }
  },

  transpileDependencies: [
    'vuetify'
  ]
}
