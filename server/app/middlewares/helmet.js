module.exports.cspConfig = {
    directives: {
        // 默认的资源白名单
        defaultSrc: ["'self'"],
        // 允许的脚本资源：本站点、cdn.bootcss.com、hm.baidu.com、inline资源（常见的style属性,onclick,inline js和inline css等等）
        scriptSrc: ["'self'", 'cdn.bootcss.com', 'hm.baidu.com', "'unsafe-inline'"],
        // 允许的样式文件资源
        styleSrc: ["'self'", "'unsafe-inline'", 'hm.baidu.com'],
        // 允许的图片文件资源
        imgSrc: ["'self'", 'data:', 'hm.baidu.com'],
        // 不太清楚
        sandbox: ['allow-forms', 'allow-scripts', 'allow-same-origin', 'allow-top-navigation', 'allow-popups'],
        // 违反上述规则后发送错误报告到下面路由
        reportUri: '/report-violation',
        objectSrc: ["'none'"]
    },
    // 设为true后上述的规则不起作用，只会打印出信息
    reportOnly: false,
    //如果设置true, 将会添加已经被抛弃的兼容头部 X-WebKit-CSP, and X-Content-Security-Policy
    setAllHeaders: false,
    disableAndroid: false,
    browserSniff: true
}