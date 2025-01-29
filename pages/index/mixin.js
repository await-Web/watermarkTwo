export default {
	data() {
		return {

		}
	},
	onload() {
		console.log(6665);
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
				case '1':
					// navigateToMiniProgram('wx307a4b6152c1100f', '/pages/index/index');
					break;
				case '2':
					// navigateToMiniProgram('wx307a4b6152c1100f', '/pages/index/wallpaper');
					break;
				case 'md5':
					uni.navigateTo({
						url: '/pages/analysis/mdFive/index'
					});
					break;
				case '5':
					this.jumpApplet();
					navigateToMiniProgram('wxda2c3eef7d7e3413',
						'/pages/home/index?id=1817925578915618817&memberId=1825489540767150081'
					);
					break;
				case 'record':
					uni.navigateTo({
						url: '/pages/my/dataLog/index'
					});
					break;
				case '7':
					navigateToMiniProgram('wxde8ac0a21135c07d',
						'/index/pages/h5/h5?weburl=https%3A%2F%2Fclick.meituan.com%2Ft%3Ft%3D1%26c%3D2%26p%3D-jozSr9zj3Yl'
					);
					break;
				case '8':
					navigateToMiniProgram('wxaf35009675aa0b2a',
						'/webx/entry/block-prevention?scene=WQxGmKK&source_id=26b88e0a7f02ca189c71&ref_from=dunion&dunion_callback=%7B%22partner_mark%22%3A%2226b88e0a7f02ca189c71%22%7D'
					);
					break;
				case '9':
					navigateToMiniProgram('wxaf35009675aa0b2a',
						'/pages/index/index?scene=WwKxqxb&source_id=26b88e0a7f02ca189c71&ref_from=dunion&dunion_callback=%7B%22partner_mark%22%3A%2226b88e0a7f02ca189c71%22%7D'
					);
					break;
				case 'translate':
					uni.switchTab({
						url: "/pages/translate/index"
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