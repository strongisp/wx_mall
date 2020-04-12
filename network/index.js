// 同时发送异步请求的次数
let ajaxTimes = 0;
export const request = (params) => {
	ajaxTimes++;
	// 现在正在加载中 loading效果；
	wx.showLoading({
		title: '正在加载中',
		mask: true
	})

	// 定义公共的url；
	const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
	return new Promise((resolve, reject) => {
		wx.request({
			...params,
			url: baseUrl + params.url,
			success: resolve,
			fail: reject,
			complete: () => {
				ajaxTimes--;
				if (ajaxTimes === 0) {
					// 关闭loading效果；
					wx.hideLoading();
				}
			}
		})
	})
}