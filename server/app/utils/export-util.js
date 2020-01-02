const NXlSX = require("node-xlsx");

exports.exportExcel = (config) => {
    let { data, headers, colums, name } = config
    let rows = data.rows || []
    let exportData = []
    rows.forEach(row => {
        let arr = []
        colums.forEach(key => {
            arr.push(row[key])
        })
        exportData.push(arr)
    })
    exportData.unshift(headers)
    let buffer = NXlSX.build([{ name: `${name}-${new Date().getTime()}`, data: exportData }])
    return buffer
}