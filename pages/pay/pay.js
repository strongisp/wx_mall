//导入Promise包装的获取权限地址api；
import { request } from '../../network/index.js'
Page({

	data: {
		address: {},
		cart: [],
		totalPrice: 0,
		totalNum: 0
	},
	onShow() {
		// 1.获取缓存中的收货地址信息
		let address = wx.getStorageSync("address");
		// 2.获取缓存中的商品数据
		let cart = wx.getStorageSync("cart") || [];

		// 过滤后的购物车数组；
		cart = cart.filter(v => v.checked);
		this.setData({ address });


		//总价格
		let totalPrice = 0;
		//总数量
		let totalNum = 0;
		//循环整个数据数组
		cart.forEach((item, index) => {
			totalPrice += item.num * item.goods_price;
			totalNum += item.num;
		});
		this.setData({
			cart,
			totalPrice,
			totalNum,
			address
		});
	},
	// 支付按钮点击事件
	handleOrderPay() {
		// 1.判断缓存中有没有token
		const token = wx.getStorageSync("token");
		// 2.判断是否存在的操作
		if (!token) {
			wx.navigateTo({
				url: '/pages/auth/auth'
			});
			return;
		}
		// 3.创建订单
		const header = { Authorization: token };		//请求头参数；
		// 请求参数
		const order_price = this.data.totalPrice;		//总价格；
		const consignee_addr = this.data.address.provinceName + this.data.address.cityName + this.data.address.countyName + this.data.address.detailInfo;				//详细地址；
		const cart = this.data.cart;
		let goods = [];
		cart.forEach(v => goods.push({
			goods_id: v.goods_id,
			goods_number: v.num,
			goods_price: v.goods_price
		}));
		const prderParams = { order_price, consignee_addr, goods };
		// 4.发送请求(创建订单)
		request({
			url: '/my/orders/create',
			methods: 'post',
			data: prderParams,
			header
		}).then(res => {
			// console.log(res);	因服务器原因服务获取订单编号；
			//模拟：获取到的并单编号；
			const order_number = "HMDD20200401000000001058";
		})
		const order_number = "HMDD20200401000000001058";
		// 5.发起 预支付请求
		const res = request({ url: '/my/orders/req_unifiedorder', method: 'post', header, data: { order_number } })
		// 6.调微信支付接口,本id是私人的所以无法调用微信支付接口；
		wx.requestPayment({
			timeStamp: '1562346079',
			nonceStr: 'U6tYjNdYvm3RekgI',
			package: 'prepay_id=wx09182118256902a15c8b8d071931343000',
			signType: 'MD5',
			paySign: 'C514E29387794F84004C983AFF4707F',
			success: res => {
				console.log(res);	//此时就调用了微信支付，然后还可以查询订单是否生效，在这里就不进行下去了；
			}
		})
		// 7.支付成功清除本地的缓存；
		let newCart = wx.getStorageSync("cart");
		newCart = newCart.filter(v => !v.checked);
		wx.setStorageSync("cart", newCart);
		// 8.跳转到订单页面
		wx.navigateTo({ url: '/pages/order/order' })

	}
})
