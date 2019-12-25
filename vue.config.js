const fs = require('fs')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
const isProduction = process.env.NODE_ENV === 'production'

let pages = {}
const fGetConfigPages = async function() {
    await fs.readdirSync('./src/pages/').forEach((val) => {
        if (val !== 'login') {
            pages[val] = {
                // page entry
                entry: `src/pages/${val}/index.js`,
                // 模板来源
                template: `src/pages/${val}/index.html`,
                // 在 dist/index.html 的输出
                filename: `${val}.html`
            }
        }
    })
}
fGetConfigPages('./src/pages/') // readdirSync

module.exports = {
    pages: pages,
    // lintOnSave: true,
    assetsDir: 'static',
    publicPath: process.env.VUE_APP_PUBLIC_PATH,
    productionSourceMap: !isProduction, // 关闭map文件
    devServer: { port: 8080, open: true, openPage: 'lz-plat' },
    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        extract: true,
        sourceMap: !isProduction,
        loaderOptions: {},
        // 启用 CSS modules for all css / pre-processor files.
        modules: false
    },
    chainWebpack: (config) => {
        config.optimization.splitChunks({
            cacheGroups: {
                vendors: {
                    name: 'chunk-vendors',
                    minChunks: 2,
                    test: /node_modules/,
                    priority: -10,
                    chunks: 'initial'
                },
                common: {}
            }
        })
    },
    configureWebpack: config => {
        if (isProduction) {
            config.plugins.push(new CompressionWebpackPlugin({
                algorithm: 'gzip',
                test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                threshold: 10240,
                minRatio: 0.8
            }))
            // config.externals = {
            //     'vue': 'Vue',
            //     'vue-router': 'VueRouter',
            // }
        }
    },
}