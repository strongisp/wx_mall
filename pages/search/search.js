// pages/search/search.js
import { request } from '../../network/index.js'
Page({
	data: {
		goods: [],
		isFocus: false,
		inputValue: ''
	},
	timeId: -1,
	// 监听输入框值改变事件
	handleInput(e) {
		// 1.获取输入框的值
		const { value } = e.detail;
		// 2.检查合法性验证
		if (!value.trim()) {
			clearTimeout(this.timeId);
			this.setData({ goods: [], isFocus: false });
			return;
		}
		this.setData({ isFocus: true })
		// 3.发送网络请求
		clearTimeout(this.timeId);
		this.timeId = setTimeout(() => {
			this.qsearch(value)
		}, 1000)
	},
	// 发送请求封装函数
	qsearch(query) {
		request({ url: '/goods/qsearch', data: { query } }).then(res => {

			this.setData({
				goods: res.data.message
			})
		})
	},
	// 取消按钮功能实现
	handleCancel() {
		this.setData({
			inputValue: '',
			isFocus: false,
			goods: []
		})
	}
})