<template>
	<view class="tool-v">
		<view class="statement u-text-center u-m-t-20">所有视频,图片归平台及作者所有，本应用不储存任何内容</view>
		<u-toast ref="uToast" />
		<view class="u-m-t-20" style="background-color: #fff;border-radius: 18rpx;">
			<u-swiper :list="imgList"></u-swiper>
		</view>
		<view class="tool-content">
			<view class="u-m-t-20 url-input">
				<view class="u-flex u-m-b-10">
					<kxSwitch @change="switchChange"></kxSwitch>
					<kxSwitch @change="openTutorial" label="使用教程" class="u-m-l-10" labelColor="#07c160"></kxSwitch>
				</view>
				<u-input v-model="url" type="textarea" :border="true" :clearable="true" placeholder="此处粘贴分享链接"
					border-color="#fcc31f" />
				<view class="u-flex btn-box">
					<u-button v-if="isBach" size="mini" type="primary" @click="processUrl">粘贴并解析</u-button>
					<u-button size="mini" type="primary" @click="processUrl" v-else>粘贴并解析</u-button>
				</view>
			</view>
			<video style="width: 100%;" class="u-m-t-20"
				src="https://mp-89c324e5-79a8-4fa7-ab60-b83b46b5dd6b.cdn.bspapp.com/tutorial/94069d034ceff71eefa709524a998643.mp4"
				v-show="tutorial"></video>
			<view class="apply-list">
				<view class="part">
					<view class="caption u-line-1">
						更多功能
					</view>
					<view class="item-box">
						<view class="u-flex u-flex-wrap">
							<view class="item u-flex-col u-col-center" @click="jumWebview('5')">
								<text class="u-font-40 item-icon icon-kx icon-kx-duanju"
									:style="{ background:  '#f2b0ff' }" />
								<text class="u-font-24 u-line-1 item-text">热播短剧</text>
							</view>
							<view class="item u-flex-col u-col-center" @click="jumWebview('6')">
								<text class="u-font-40 item-icon icon-kx icon-kx-jilu"
									:style="{ background:  '#ff0000' }" />
								<text class="u-font-24 u-line-1 item-text">历史记录</text>
							</view>
							<view class="item u-flex-col u-col-center" @click="jumWebview('3')">
								<text class="u-font-40 item-icon icon-kx icon-kx-MD51"
									:style="{ background:  '#008cff' }" />
								<text class="u-font-24 u-line-1 item-text">修改MD5</text>
							</view>
							<view class="item u-flex-col u-col-center">
								<button class="shareBtn" open-type="share">
									<text class="item-icon icon-kx icon-kx-wechat-fill"></text>
								</button>
								<text class="u-font-24 u-line-1 item-text">分享</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<kxCustomer></kxCustomer>
	</view>
</template>
<script>
	const db = uniCloud.database();
	const analysisTable = db.collection('analysis-dataLog')
	const setJumpAppletTable = db.collection('jump-applet')
	const usersTable = db.collection('uni-id-users')
	import {
		useUserStore
	} from "@/store/user.js"
	const userStore = useUserStore()
	import {
		getVoucher,
		watermark,
		authorWorkWatermark
	} from "@/api/external.js";
	const subscribemsg = uniCloud.importObject('subscribeMessage')
	export default {
		data() {
			return {
				imgList: [{
					image: 'https://mp-13dd589c-4432-4fb1-866e-9e4ead5819bb.cdn.bspapp.com/carousel/969.jpg',
					id: 1
				}, {
					image: 'https://mp-13dd589c-4432-4fb1-866e-9e4ead5819bb.cdn.bspapp.com/carousel/99.jpg',
					id: 2
				}, {
					image: 'https://mp-13dd589c-4432-4fb1-866e-9e4ead5819bb.cdn.bspapp.com/carousel/kEm74VfIMVSV75mxEd4G73Xvz4SIvg.jpg',
					id: 3
				}],
				url: '',
				todayCount: 0,
				allCount: 0,
				detialData: {},
				subscribeId: ['UU3SfNdbK8zevjVTLyDd43aqeGvdO4V6ND-VcoIRTYk'],
				isBach: false,
				isMP: false,
				tutorial: false
			}
		},
		onShareAppMessage() {
			return {
				title: '免费壁纸,自由获取',
				path: '/pages/index/index'
			}
		},
		computed: {
			currentUser() {
				let hostUserInfo = uni.getStorageSync('uni-id-pages-userInfo') || {}
				return hostUserInfo
			},
			userData() {
				return userStore.userInfo
			},
			isAdmin() {
				return this.tools.isAdminRole()
			}
		},
		onLoad() {
			this.share()
			this.getVoucher()
			// this.getUserList()
			// this.upDateUserInfo()
		},
		methods: {
			//打开使用教程
			openTutorial(e) {
				this.tutorial = e
			},
			async upDateUserInfo() {
				const dbCmd = db.command
				let res = await usersTable.where({
					watermark_count: dbCmd.eq(1),
					cumulative: dbCmd.eq(1)
				}).update({
					watermark_count: 0,
					cumulative: 0,
				})
			},
			// getUserList() {
			// 	uniCloud.callFunction({
			// 		name: 'getUserList',
			// 	}).then(res => {

			// 	});
			// },

			share() {
				//分享
				// #ifdef MP-WEIXIN
				wx.showShareMenu({
					withShareTicket: false,
					menus: ['shareAppMessage', 'shareTimeline']
				})
				// #endif
			},
			//获取接口调用凭据
			getVoucher() {
				let data = {
					appid: '66bc5fb2a5d7e1241SihJ',
					appsecret: '6B0TruSB7SvwczwF4vZ0iTiOXPZOcJST'
				}
				getVoucher(data).then(res => {
					uni.setStorageSync('externalToken', res.data.token) || ''
				})
			},
			//获取次数
			getWatermarkCount() {
				uniCloud.callFunction({
					name: 'getWatermark',
					data: {
						user_id: this.currentUser._id
					},
				}).then(res => {});
			},

			//批量解析开关
			switchChange(e) {
				this.url = '';
				if (e) {
					this.$refs.uToast.show({
						title: '主页解析支持抖音,快手,小红书',
						type: 'warning',
						duration: 2500
					})
				}
				this.isBach = e
			},
			//读取剪切板
			processUrl() {
				if (!this.url) {
					this.tryGetClipboardUrl();
				} else {
					this.handleWatermark();
				}
			},
			tryGetClipboardUrl() {
				uni.getClipboardData({
					success: (res) => {
						this.url = res.data;
						if (!this.url) {
							this.$u.toast("分享链接不能为空");
							return;
						}
						this.handleWatermark();
					},
					fail: () => {
						this.$u.toast("无法从剪贴板获取分享链接");
					}
				});
			},
			// 提取的公共方法
			handleWatermark() {
				if (this.isBach) {
					this.authorWorkWatermark();
				} else {
					this.watermark();
				}
			},
			//短视频解析
			watermark() {
				let todayCount = this.userData.watermark_count++
				let allCount = this.userData.cumulative++
				this.isMP = this.url.includes("mp.weixin.qq.com");
				let updateData = {
					watermark_count: todayCount,
					cumulative: allCount
				}
				//订阅
				watermark({
					link: this.url
				}).then(res => {
					// userStore.updateUserInfo(updateData)
					let data = JSON.parse(JSON.stringify(res.data)) || {}
					let imgUrl = this.ensureHttps(data.imageSrc)
					let videoUrl = this.ensureHttps(data.videoSrc)
					let imageAtlas = data.imageAtlas.map(o => this.ensureHttps(o))
					this.detialData = {
						...data,
						imageSrc: imgUrl,
						videoSrc: videoUrl,
						imageAtlas: imageAtlas, // 初始化为传入的 imageAtlas
						isMP: this.isMP
					};
					// 如果 isMP 为真，则处理 videoUrl 中的图像链接
					if (this.isMP) {
						const imgSrcHttpsRegex =
							/<img\s+[^>]*?src=['"](https:[^'"]*)['"][^>]*?>/g;
						const urls = [];
						let match;
						while ((match = imgSrcHttpsRegex.exec(videoUrl)) !== null) {
							urls.push(match[1]);
						}
						// 只更新 imageAtlas 属性
						this.detialData.imageAtlas = urls;
					}
					if (!this.isMP) this.setDataLog()
					this.url = ""
					uni.navigateTo({
						url: '/pages/analysis/analysisDetial/index?config=' +
							encodeURIComponent(JSON
								.stringify(this.detialData))
					})
				}).catch(err => {})
			},
			/* 添加解析记录 */
			async setDataLog() {
				await analysisTable.add({
					dateTimestamp: this.tools.getCurrentDateTime('timestamp'),
					date: this.tools.getCurrentDateTime(),
					watermarkObj: this.detialData
				})
			},
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
					case '3':
						uni.navigateTo({
							url: '/pages/analysis/mdFive/index'
						});
						break;
					case '5':
						this.jumpApplet();
						navigateToMiniProgram('wxda2c3eef7d7e3413',
							'/pages/home/index?id=1817925578915618817&memberId=1825489540767150081');
						break;
					case '6':
						uni.navigateTo({
							url: '/pages/my/dataLog/index'
						});
						break;
						// case '7':
						// 	navigateToMiniProgram('wxfd2e340553ce980d', '/pages/home/index');
						// 	break;
					default:

						break;
				}
			},
			//跳转到短剧小程序
			async jumpApplet() {
				await setJumpAppletTable.add({
					dateTimestamp: this.tools.getCurrentDateTime('timestamp'),
					date: this.tools.getCurrentDateTime()
				})
			},
			//批量解析
			authorWorkWatermark() {
				let data = {
					appid: '66bc5fb2a5d7e1241SihJ',
					appsecret: '6B0TruSB7SvwczwF4vZ0iTiOXPZOcJST',
					link: this.url
				}
				authorWorkWatermark(data).then(res => {
					let data = JSON.parse(JSON.stringify(res.data)) || {}
					if (res.code == '1') {
						this.url = ""
						this.isBach = false
						uni.navigateTo({
							url: '/pages/analysis/batch/index?config=' +
								encodeURIComponent(JSON
									.stringify(data))
						})
					}
				})
			},
			ensureHttps(url) {
				return url.replace(/^http:\/\//i, 'https://');
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f0f2f6;
	}

	.tool-v {
		width: 100%;
		height: 100%;
		padding: 0 20rpx;

		.statement {
			width: 100%;
			color: red;
		}

		.wrap {
			padding: 20rpx 0;
		}

		.tool-content {
			padding-bottom: 20rpx;

			.url-input {
				width: 100%;
				background-color: #fff;
				padding: 20rpx;
				border-radius: 10rpx;
				box-shadow: 1rpx 1rpx 2rpx 1rpx rgba(0, 0, 0, 0.1);

				.btn-box {
					justify-content: flex-end;
					margin-top: 20rpx;
				}
			}
		}
	}
</style>