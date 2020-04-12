import {
	request
} from "../../network/index.js"

// pages/category/category.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		// 左侧菜单数据；
		leftMenuList: [],
		// 右侧商品数据；
		rightContent: [],
		//被点击的左侧的菜单；
		currentIndex: 0,
		// 每次切换右侧的初始位置；
		scrollTop: 0
	},
	// 接口的	返回数据
	Cates: [],

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// 2.分类数据函数调用;

		// 1.获取本地存储中的数据(小程序也是存在本地存储的)
		const Cates = wx.getStorageSync("cates");
		// 2.判断本地是否存在数据
		if (!Cates) {
			//不存在，请求数据
			this.getCates();
		} else {
			//存在，并且有效期没过则显示，有效期过了重新请求(有效期为5分钟)
			if (Date.now() - Cates.time > 1000 * 300) {
				//超过重新发送请求；
				this.getCates();
			} else {
				//没超过,渲染
				this.Cates = Cates.data;
				let leftMenuList = this.Cates.map(v => v.cat_name);
				let rightContent = this.Cates[0].children;
				this.setData({
					leftMenuList,
					rightContent
				})
			}
		}
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	},

	// 发送异步请求：获取分类数据
	getCates() {
		request({
			url: '/categories',
			method: 'get'
		}).then(res => {
			this.Cates = res.data.message;

			//把接口数据存储到本地中；
			wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });

			// 获取部分数据，左侧菜单数据；
			let leftMenuList = this.Cates.map(v => v.cat_name);
			// 获取部分数据，右侧商品数据；
			let rightContent = this.Cates[0].children;
			this.setData({
				leftMenuList,
				rightContent
			})
		})
	},
	// 左侧点击事件
	handleItemTap(e) {
		// 获取当前左侧点击下标
		const { index } = e.currentTarget.dataset
		// 改变渲染的右侧商品内容
		let rightContent = this.Cates[index].children;
		this.setData({
			currentIndex: index,
			rightContent,
			//重新设置 右侧内容的scroll-view标签距离顶部的距离；
			scrollTop: 0
		})

	}
})