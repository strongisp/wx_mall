//导入Promise包装的获取权限地址api；
import { getSetting, chooseAddress, openSetting } from '../../utils/asyncWx.js'
Page({

	data: {
		address: {},
		cart: [],
		allGoods: 0,
		allChecked: false,
		totalPrice: 0,
		totalNum: 0,
		goods_id: 0
	},
	onShow() {
		// 1.获取缓存中的收货地址信息
		let address = wx.getStorageSync("address");
		// 2.获取缓存中的商品数据
		const cart = wx.getStorageSync("cart") || [];

		this.setData({ cart, address });
		this.setCart(cart);

		cart.forEach((v, i) => {
			this.setData({
				allGoods: i + 1
			})
		})

	},
	// 监听点击事件，获取地址按钮
	handleChooseAddress() {
		// 1.调用权限api；
		getSetting().then(res => {
			// 2.获取权限状态；
			const scopeAddress = res.authSetting["scope.address"];
			// 3.判断是否已经授权权限，没有授权，则诱导用户授予权限；
			if (scopeAddress === false) openSetting()
			// 4.授予权限，执行收获地址；
			chooseAddress().then(res => {
				// 5.将用户选择的地址，存储在本地；
				wx.setStorageSync("address", res)
			})
		})
	},
	// 监听点击事件，重新选择地址按钮
	handleChooseAddress2() {
		getSetting().then(res => {
			chooseAddress().then(res => {
				// 5.将用户选择的地址，存储在本地；
				wx.setStorageSync("address", res)
			})
		})
	},
	// 商品选中
	handeItemChange(e) {
		// 1.获取被修改的商品id
		const goods_id = e.currentTarget.dataset.id;
		// 2.获取购物车的商品对象
		let { cart } = this.data;

		// 3.找到被修改的商品对象
		let index = cart.findIndex(v => v.goods_id === goods_id);
		// 4.选中状态取反
		cart[index].checked = !cart[index].checked;

		this.setCart(cart);

	},
	//设置全选按钮，取反
	handleItemAllCheck() {
		// 1.获取data中的数据
		let { cart, allChecked } = this.data;
		// 2.取反
		allChecked = !allChecked;
		// 3.循环修改数组cart中的商品选中状态；
		cart.forEach(v => v.checked = allChecked);
		// 4.把设置后的值，填充回data或者缓存中；
		this.setCart(cart);
	},
	// 实现按钮加减功能
	handleItemNumEdt(e) {
		// 1.获取传递过来的	参数
		const { operation, id } = e.currentTarget.dataset;
		// 2.获取购物车数组
		let { cart } = this.data;
		// 3.找到需要修改商品的索引
		const index = cart.findIndex(v => v.goods_id === id);
		// (后插)判断是否要执行删除；
		if (cart[index].num === 1 && operation === -1) {
			// 1.弹窗提示
			wx.showModal({
				title: "提示",
				content: "您是否要删除商品？",
				success: (res) => {
					if (res.confirm) {
						// 删除cart数据中的当前值
						cart.splice(index, 1);
						// 重新赋值给data和缓存中
						this.setCart(cart);
						// 重新改变标题的商品数量；
						this.setData({
							allGoods: this.data.allGoods - 1
						})
					}
				}
			})
		} else {
			// 4.进行修改数量
			cart[index].num += operation;
			// 5.设置回缓存和data中
			this.setCart(cart);
		}
	},
	// 1.点击结算按钮
	handlePay() {
		// 1.判断收货地址
		const { address, totalNum } = this.data;
		if (!address.userName) {
			wx.showToast({
				title: '您还没有选择收货的详细地址',
				icon: 'none'
			})
			return;
		}
		// 2.判断用户有没有选中商品；
		if (totalNum === 0) {
			wx.showToast({
				title: '您还没有选择需要购买的商品',
				icon: 'none'
			})
			return;
		}
		// 3.跳转到 支付页面；
		wx.navigateTo({
			url: '/pages/pay/pay'
		});
	},
	// 设置购物车状态，同时重新计算底部工具栏数据(全选、总价格、购买数量)；
	setCart(cart) {
		let allChecked = true;
		//总价格
		let totalPrice = 0;
		//总数量
		let totalNum = 0;
		//循环整个数据数组
		cart.forEach((item, index) => {
			if (item.checked) {
				totalPrice += item.num * item.goods_price;
				totalNum += item.num;
			} else {
				allChecked = false;
			}
		});
		//判断存储的商品数组是否为空，则为false；
		allChecked = cart.length != 0 ? allChecked : false;
		this.setData({
			cart,
			totalPrice,
			totalNum,
			allChecked
		});
		wx.setStorageSync("cart", cart);
	}
})
