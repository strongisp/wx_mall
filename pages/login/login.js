// pages/login/login.js
Page({
	handleGetUserInfo(e) {
		const { userInfo } = e.detail;
		wx.setStorageSync("userInfo", userInfo);
		wx.navigateBack({ belta: 1 })
	}
})