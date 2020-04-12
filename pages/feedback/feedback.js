// pages/feedback/feedback.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		tabs: [
			{
				id: 0,
				value: "体验问题",
				isActive: true
			},
			{
				id: 1,
				value: "商品、商家投诉",
				isActive: false
			}
		],
		chooseImgs: [],
		textVal: ''
	},
	UpLoadImgs: [],
	//监听tab点击事件
	handleTabsItemChange(e) {
		// 1.获取被点击的标题索引值
		const { index } = e.detail;
		// 2.修改源数组
		let { tabs } = this.data;
		tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
		// 3.赋值给data
		this.setData({ tabs });
	},
	// 点击按钮添加图片
	handleChooseImg() {
		// 1.调用小程序内置得选择图片API
		wx.chooseImage({
			count: 9,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: (res) => {

				this.setData({
					//图片数组 进行拼接
					chooseImgs: [...this.data.chooseImgs, ...res.tempFilePaths]
				})
			}
		})
	},
	// 点击 自定义图片组件
	handleRemoveImg(e) {
		// 获取被点击的组件索引
		const { index } = e.currentTarget.dataset;
		// 获取data中得图片数组
		let { chooseImgs } = this.data;
		// 删除元素
		chooseImgs.splice(index, 1);
		this.setData({
			chooseImgs
		})
	},
	// 文本域 的输入事件 
	handleTextInp(e) {
		this.setData({
			textVal: e.detail.value
		})
	},
	// 点击提交按钮
	handleFormSubmit() {
		// 1.获取文本域的内容 图片数组；
		const { textVal, chooseImgs } = this.data;
		// 2.合法性验证
		if (!textVal.trim()) {
			wx.showToast({
				title: '输入不合法',
				icon: 'none',
				mask: true
			})
			return;
		}
		// 显示正在等待的图片
		wx.showLoading({
			title: '正在上传',
			mask: true
		})
		// 3.上传图片到专门的图片服务器
		chooseImgs.forEach((v, i) => {
			wx.uploadFile({
				url: 'https://api-hmugo-web.itheima.net/api/public/v1',
				filePath: v,
				name: "file",
				formData: {},
				success: (res) => {
					wx.hideLoading();
					// console.log(res);

					// let url = JSON.parse(res.data);
					// this.UpLoadImgs.push(url);
					// console.log(this.UpLoadImgs);
					// 服务器失效了 ，无法继续完成；
					//重置页面
					this.setData({ textVal: '', chooseImgs: [] })
					//返回上一页
					wx.navigateBack({ delta: 1 })
					wx.showToast({
						title: '反馈成功，非常感谢您的宝贵建议',
						icon: 'none'
					})
				}
			})

		})
	}

})