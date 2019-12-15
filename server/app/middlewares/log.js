module.exports = async function(ctx, next) {
    console.log(`${new Date().toDateString()}: ${ctx.method} ${ctx.path}`)
    await next();
    if (ctx.path.includes('/api')) {
        console.log('response', ctx.response.body)
    }
};