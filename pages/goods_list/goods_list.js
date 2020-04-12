// pages/goods_list/goods_list.js

//导入 异步请求封装；
import {
	request
} from '../../network/index.js'


Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		tabs: [
			{
				id: 0,
				value: "综合",
				isActive: true
			}, {
				id: 1,
				value: "销量",
				isActive: false
			}, {
				id: 2,
				value: "价格",
				isActive: false
			}
		],
		goodsList: []
	},

	// 发送接口的参数
	QueryParams: {
		query: "",
		cid: "",
		pagenum: 1,
		pagesize: 10
	},

	// 总页数
	totalPages: 1,

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.QueryParams.cid = options.cid || "";
		this.QueryParams.query = options.query || "";
		this.getGoodsList();
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
		//下拉刷新执行的三步骤：重置数据数组、重置页面、重新发送请求,手动关闭等待效果；
		this.setData({
			goodsList: []
		})
		this.QueryParams.pagenum = 1;
		this.getGoodsList();
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
		// 判断是否到最后一页；
		if (this.QueryParams.pagenum >= this.totalPages) {
			//已经是最后一页；
			wx.showToast({
				title: '已经没有商品了哦',
				icon: "none"
			})
		} else {
			wx.showLoading({
				title: '正在加载商品'
			})
			this.QueryParams.pagenum++;
			this.getGoodsList();
		}
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	},

	// 标题点击事件，从组件中传递过来的；
	handleTabsTiemChange(e) {
		// 1.获取被点击的标题下标；
		const { index } = e.detail;
		// 2.修改源数组；
		let { tabs } = this.data;
		tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
		// 3.赋值到data中；
		this.setData({
			tabs
		})
	},

	// 发送异步请求：获取商品列表数据
	getGoodsList() {
		request({
			url: '/goods/search',
			data: this.QueryParams
		}).then(res => {
			//将数据传递到data中；
			this.setData({
				//拼接数组，将已经请求到的数据全部保存下来；
				goodsList: [...this.data.goodsList, ...res.data.message.goods]
			})
			//获取商品总条数
			const total = res.data.message.total;
			this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
			// 关闭下拉刷新窗口,没有调用下拉窗口，执行这个也没事；
			wx.stopPullDownRefresh();
		})
	}

})