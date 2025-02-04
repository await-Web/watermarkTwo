export default {
	data() {
		return {

		}
	},
	methods: {
		/* 跳转相关 */
		jumWebview(type) {
			const navigateToMiniProgram = (appId, path, envVersion = 'release') => {
				uni.navigateToMiniProgram({
					appId,
					path,
					envVersion,
					success(res) {
						// 可以在这里添加统一的成功处理逻辑  
						console.log('小程序打开成功', res);
					},
					fail(err) {
						// 可以在这里添加统一的失败处理逻辑  
						console.error('小程序打开失败', err);
					}
				});
			};
			switch (type) {
				case 'md5':
					uni.navigateTo({
						url: '/pages/analysis/mdFive/index'
					});
					break;
				case 'record':
					uni.navigateTo({
						url: '/pages/my/dataLog/index'
					});
					break;
				case 'translate':
					uni.switchTab({
						url: "/pages/index/translate"
					})
					break;
				case 'ad':
					uni.navigateTo({
						url: "/pages/coupon/index"
					})
					break;
				default:

					break;
			}
		},
	}
}