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
				case 'mp':
					navigateToMiniProgram('wx848300787475c5e6',
						'/pages/home/home'
					);
					break;
				case 'mp2':
					navigateToMiniProgram('wx2600396f84069a12',
						'/pages/index/square'
					);
					break;
				default:

					break;
			}
		},
	}
}