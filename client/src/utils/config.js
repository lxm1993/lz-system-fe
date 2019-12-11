import { getSystemName } from '@/utils/tokenSso'; // 验权
import lzAdmin from "../pages/lz-admin/config";
import lz from "../pages/lz/config";

let env = process.env.VUE_APP_CURRENTMODE
let configs = {
    'lz': lz,
    'lz-admin': lzAdmin
}
let systemConfig = (configs[getSystemName()])[env]
console.log('systemConfig', systemConfig)

export default systemConfig