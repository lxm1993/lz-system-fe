// -----------------------------pages config----------------------------------
const fs = require('fs')
let pages = {}
const fGetConfigPages = async function() {
    await fs.readdirSync('./src/pages/').forEach((val) => {
        pages[val] = {
            // page entry
            entry: `src/pages/${val}/index.js`,
            // 模板来源
            template: `src/pages/${val}/index.html`,
            // 在 dist/index.html 的输出
            filename: `${val}.html`
        }
    })
}
fGetConfigPages('./src/pages/') // readdirSync

// ---------------------------vue config------------------------------------

module.exports = {
    pages: pages,
    lintOnSave: true,
    assetsDir: 'static',
    publicPath: process.env.VUE_APP_PUBLIC_PATH,
    productionSourceMap: process.env.VUE_APP_CURRENTMODE !== 'production', // 关闭map文件
    devServer: { port: 8080, open: true, },
}