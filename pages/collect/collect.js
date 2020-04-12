// pages/collect/collect.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		collect: [],
		tabs: [
			{
				id: 0,
				value: "商品收藏",
				isActive: true
			}, {
				id: 1,
				value: "品牌收藏",
				isActive: false
			}, {
				id: 2,
				value: "店铺收藏",
				isActive: false
			}, {
				id: 3,
				value: "浏览足迹",
				isActive: false
			}

		]
	},
	onShow: function () {
		const collect = wx.getStorageSync("collect") || [];
		this.setData({
			collect
		})

	},
	handleTabsItemchange(e) {
		// 获取被点击的标collect:[],题索引
		const { index } = e.detail;
		let { tabs } = this.data;
		tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
		this.setData({
			tabs
		})
	}
})