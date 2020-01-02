/**
 * 构建下载对象进行下载文件
 * @param {Object} options:
 *  {*} res 需要下载的文件对象
 *  {*} filename 文件名，包含后缀名，下载的文件将以此名字命名
 *  {*} fileTypeName 文件类型名称，主要在提示消息用
 *  {Function} callback 回调函数， 文件开始下载之后执行
 */
export function fDownload(options = {}, context) {
    // console.log(options)
    let {
        res,
        filename,
        fileTypeName,
        callback,
    } = options
    if (!res) {
        throw new Error('找不到需要下载的文件')
    }
    if (!filename) {
        throw new Error('没有填写要下载的文件名')
    }
    context = context || this
    if (!context || context === window) {
        throw new Error('没有正确的上下文对象')
    }
    const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
    let url = window.URL.createObjectURL(blob)
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    setTimeout(() => {
        try {
            callback && callback()
            context.$message({
                message: `开始下载${fileTypeName}文件,请留意浏览器下载栏.`,
                type: 'success',
            })
        } catch (e) {
            console.error('error on function fDownload:', e)
        }
        document.body.removeChild(link)

        window.URL.revokeObjectURL(url)
    }, 0)
}