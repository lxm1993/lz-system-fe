//用 'unsafe-inline' 和 'unsafe-eval' 都是不安全的，它们会使您的网站有跨站脚本攻击风险。
// 'self' 代表和文档同源，包括相同的 URL 协议和端口号
module.exports.cspConfig = {
    directives: {
        // 默认的资源白名单
        defaultSrc: ["'self'"],
        // 允许的脚本资源：本站点资源
        scriptSrc: ["'self'"],
        // 允许的样式文件资源
        styleSrc: ["'self'"],
        // 允许的图片文件资源
        imgSrc: ["'self'", 'data:'],
        // child-src 指定定义了 web workers 以及嵌套的浏览上下文（如 <frame> 和 <iframe> ）的源
        childSrc: ["'self'"],
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