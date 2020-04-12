// Promise 形式的 getSetting(获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限);
export const getSetting = () => {
    return new Promise((reslove, reject) => {
        wx.getSetting({
            success: (result) => {
                reslove(result)
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}

// Promise 形式的 chooseAddress(获取用户收货地址。调起用户编辑收货地址原生界面，并在编辑完成后返回用户选择的地址);
export const chooseAddress = () => {
    return new Promise((reslove, reject) => {
        wx.chooseAddress({
            success: (result) => {
                reslove(result)
            }
        })
    })
}

// Promise 形式的 openSetting(设置界面只会出现小程序已经向用户请求过的权限);
export const openSetting = () => {
    return new Promise((reslove, reject) => {
        wx.openSetting({
            success: (result) => {
                reslove(result)
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}



