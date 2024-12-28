// 引入uni-subscribemsg公共模块
const UniSubscribemsg = require('uni-subscribemsg');

module.exports = {
	_before: function() { // 通用预处理器

	},
	async sendSubscribeMessage(data) {
		let {
			openid,
			result,
			tmplIds
		} = data
		// 初始化实例
		let uniSubscribemsg = new UniSubscribemsg({
			dcloudAppid: "__UNI__C4DFF39",
			provider: "weixin-mp",
		});
		// 发送订阅消息
		await uniSubscribemsg.sendSubscribeMessage({
			touser: openid,
			template_id: tmplIds,
			page: "pages/index/tool", // 小程序页面地址
			miniprogram_state: "formal", // 跳转小程序类型：developer为开发版；trial为体验版；formal为正式版；默认为正式版
			lang: "zh_CN",
			data: {
				phrase1: {
					value: result
				},
				thing6: {
					value: '收藏不迷路'
				}
			}
		});
	}
}