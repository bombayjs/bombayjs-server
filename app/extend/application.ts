
module.exports = {
    /* 生成随机字符串 */
    randomString(len?: number) {
        len = len || 7;
        const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        const maxPos = $chars.length;
        let pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd + Date.now();
    },
    retResult (data, msg = 'success', code = 200) {
      return {
        code,
        data,
        msg,
      };
    },
    retError (errorMsg = 'fail', errorCode = -1, data = {}) {
      return this.retResult(data, errorMsg, errorCode);
    },
    format(date, fmt) {
        const o = {
            'M+': date.getMonth() + 1, // 月份
            'd+': date.getDate(), // 日
            'h+': date.getHours(), // 小时
            'H+': date.getHours() > 12 ? date.getHours() - 12 : date.getHours(),
            'm+': date.getMinutes(), // 分
            's+': date.getSeconds(), // 秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        for (const k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
        return fmt;
    },
};
