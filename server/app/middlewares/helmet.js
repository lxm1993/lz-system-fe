module.exports.cspConfig = {
    directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'"]
        //styleSrc: ["'self'", 'maxcdn.bootstrapcdn.com']
    },
    defaultSrc: ['\'none\''],
    connectSrc: ['*'],
    scriptSrc: ['\'self\'', '\'unsafe-eval\'', '\'unsafe-inline\''],
    styleSrc: ['\'self\'', 'fonts.googleapis.com', '\'unsafe-inline\''],
    fontSrc: ['\'self\'', 'fonts.gstatic.com'],
    mediaSrc: ['\'self\''],
    objectSrc: ['\'self\''],
    imgSrc: ['*', 'data:'],
    childSrc: ['\'self\'']
}