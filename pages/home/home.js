// pages/home/home.js

//导入 异步请求封装；
import {
	request
} from '../../network/index.js'

Page({
	/** 页面的初始数据 */
	data: {
		// 轮播图数据
		swiperList: [],
		// 导航数据
		catesList: [],
		// 楼层数据
		floorList: []
	},

	/** 生命周期函数--监听页面加载 */
	onLoad: function (options) {
		// 2.轮播图数据函数调用；
		this.getSwiperList();
		// 2.导航数据函数调用；
		this.getCatesList();
		// 3.楼层数据函数调用；
		this.getfloor();
	},
	// 1.发送异步请求：获取轮播图数据;
	getSwiperList() {
		request({
			url: '/home/swiperdata',
			method: 'get'
		}).then(res => {
			res.data.message.forEach(v => {
				v.navigator_url = v.navigator_url.replace(/main/, "goods_detail")
			});
			this.setData({
				swiperList: res.data.message
			})
		})
	},

	// 2.发送异步请求：获取导航数据
	getCatesList() {
		request({
			url: '/home/catitems',
			method: 'get'
		}).then(res => {
			this.setData({
				catesList: res.data.message
			})
		})
	},

	// 3.发送异步请求：获取楼层数据
	getfloor() {
		request({
			url: '/home/floordata',
			method: 'get'
		}).then(res => {
			this.setData({
				floorList: res.data.message
			})
		})
	}
})