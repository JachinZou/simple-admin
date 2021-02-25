module.exports = {
  transpileDependencies: ['vuex-module-decorators', 'vuex-persist'],
  lintOnSave: 'error',
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@/assets/style/utils.scss";'
      }
    }
  }
}