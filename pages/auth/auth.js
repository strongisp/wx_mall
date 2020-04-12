// pages/auth/auth.js
import { request } from '../../network/index.js'
Page({
	// 获取用户信息
	handleGetUserInfo(e) {
		// 1.获取用户信息
		const { encryptedData, rawData, iv, signature } = e.detail;
		// 2.获取小程序登录后的code值
		wx.login({
			timeout: 10000,
			success: res => {
				// 获取参数
				const { code } = res
				const loginParams = { encryptedData, rawData, iv, signature, code };
				// 发起请求,获取用户token；
				request({
					url: '/users/wxlogin',
					method: 'post',
					data: loginParams
				}).then(res => {
					// 后台没有token，自己模拟
					const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJ1aWQiOjIzLCJpYXQi0jE1njUzMzY2MjQsImV4cCI6MTAwMTU2NTMzNJY";
					// 4.把token存入缓存中，同时跳转回上一个页面；
					wx.setStorageSync("token", token);
					wx.navigateBack({
						delta: 1
					})
				})

			}
		})
	}
})
