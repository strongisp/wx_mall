// pages/goods_detail/goods_detail.js
// 导入网络请求封装；
import { request } from '../../network/index.js'

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		goodsData: {},
		isCollect: false
	},

	// 商品对象(总数据)
	GoodsInfo: {},

	onShow: function () {
		//获取页面page对象传递过来的参数；
		let pages = getCurrentPages();
		let currentPage = pages[pages.length - 1];
		let options = currentPage.options;
		//获取点击商品的id；
		const { goods_id } = options;
		//调用请求数据封装函数，并把id当参数传递过去；
		this.getGoodsDetail(goods_id);
	},

	// 发送异步请求：获取商品详情数据；
	getGoodsDetail(goods_id) {
		request({
			url: '/goods/detail',
			data: { goods_id }
		}).then(res => {
			this.setData({
				goodsData: {
					//单个赋值，优化小程序
					goods_name: res.data.message.goods_name,
					goods_price: res.data.message.goods_price,
					//iphone部分手机不识别webp图片格式，最好找后台让他们修改，或者临时自己改(确保后台数据中存在这种格式)，
					goods_introduce: res.data.message.goods_introduce.replace(/\.webp/g, '.jpg'),
					pics: res.data.message.pics
				},
			})
			//存储总数据
			this.GoodsInfo = res.data.message;			// 1.获取缓存中的商品收藏的数组；
			let collect = wx.getStorageSync("collect") || [];
			// 2.判断当前商品是否被收藏；
			let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
			this.setData({
				isCollect
			})
		})
	},
	//轮播图片点击 放大预览
	handlePrevewImage(e) {
		// 1.构造要预览的图片数组(所有图片的url)
		const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
		// 2.接收传递过来的图片url(当前点击的图片url)
		const current = e.currentTarget.dataset.url;
		wx.previewImage({
			current,
			urls
		})

	},
	//点击添加到购物车
	handleCartAdd() {
		// 1.获取本地缓存中的购物车 数组
		let cart = wx.getStorageSync("cart") || [];

		// 2.判断商品是否存在于购物车中；
		let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
		if (index === -1) {
			// 不存在
			// 添加一个数量属性
			this.GoodsInfo.num = 1;
			// 添加是否选中的数据属性
			this.GoodsInfo.checked = true;
			cart.push(this.GoodsInfo);
			//设置添加至购物车	
			wx.showToast({
				title: '加入购物车成功',
				icon: 'none',
				mask: 'true'
			})
		} else {
			//已经存在了
			cart[index].num++;
			//设置添加至购物车	
			wx.showToast({
				title: '当前商品数量+1',
				icon: 'none',
				mask: 'true'
			})
		}
		// 3.把购物车购物车添加到缓存中
		wx.setStorageSync("cart", cart);

	},
	// 点击商品收藏
	handleCollect() {
		let isCollect = false;
		// 1.获取缓存中的商品数组；
		let collect = wx.getStorageSync("collect") || [];
		// 2.获取用户登录信息；
		let user = wx.getStorageSync("userInfo");
		// 3.判断时候用户已经登录；
		if (user.nickName) {
			// 登录后的操作；
			//判断是否已经收藏过
			let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
			// 当index !=-1就表示已经收藏过
			if (index !== -1) {
				//已经收藏过,在缓存数组中删除该商品；
				collect.splice(index, 1);
				isCollect = false;
				//弹窗提示
				wx.showToast({
					title: '取消收藏',
					icon: 'none',
					mask: 'true'
				})
			} else {
				// 没有收藏过
				collect.push(this.GoodsInfo);
				isCollect = true;
				//弹窗提示
				wx.showToast({
					title: '收藏成功',
					icon: 'none',
					mask: 'true'
				})
			}
			//将数组存入到缓存中；
			wx.setStorageSync("collect", collect);
		} else {
			// 弹窗提示
			wx.showToast({
				title: '请先进行登录',
				icon: 'none',
				mask: 'true'
			})
			//跳转登录页面
			wx.navigateTo({ url: '/pages/login/login' })
		}
		this.setData({
			isCollect
		})
	}
})