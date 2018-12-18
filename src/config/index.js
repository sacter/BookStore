/**
 * @file 配置文件，提供各种接口的域名、判断当前浏览器的系统，可新增
 */
let api

// api = 'http://csm.api.iserious.cn/' // 测试环境域名
// api = 'http://m.api.iserious.cn/' // 正式环境域名
if (window.location.host == 'csbookmgr.iserious.cn') {
    api = 'http://csm.api.iserious.cn/'
} else {
    api = 'http://m.api.iserious.cn/'
}

export const URL = api