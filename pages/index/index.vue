<template>
	<view class="tool-v">
		<view class="statement u-text-center u-m-t-20">所有视频,图片归平台及作者所有，本应用不储存任何内容</view>
		<u-toast ref="uToast" />
		<view class="u-m-t-20" style="background-color: #fff;border-radius: 18rpx;">
			<u-swiper :list="imgList"></u-swiper>
			<view class="u-m-b-20 u-m-t-20">
				<ad-custom unit-id="adunit-8b48ae39936f9fa5" ad-intervals="30"></ad-custom>
			</view>
		</view>
		<view class="tool-content">
			<view class="u-m-t-20 url-input">
				<view class="u-flex u-m-b-10">
					<kxSwitch @change="switchChange" label="主页解析"></kxSwitch>
					<kxSwitch @change="openTutorial" label="使用教程" class="u-m-l-10" labelColor="#07c160"></kxSwitch>
				</view>
				<u-input v-model="url" type="textarea" :border="true" :clearable="true" placeholder="此处粘贴分享链接"
					border-color="#fcc31f" />
				<view class="u-flex btn-box">
					<u-button size="mini" type="primary" @click="url = ''">清空</u-button>
					<u-button size="mini" type="primary" open-type="share">
						分享
						<text class="u-m-l-10 item-icon icon-kx icon-kx-wechat-fill"></text>
					</u-button>
					<u-button v-if="isBach" size="mini" type="primary" @click="processUrl">粘贴并解析</u-button>
					<u-button size="mini" type="primary" @click="processUrl" v-else>粘贴并解析</u-button>
				</view>
			</view>
			<video style="width: 100%;" class="u-m-t-20"
				src="https://mp-89c324e5-79a8-4fa7-ab60-b83b46b5dd6b.cdn.bspapp.com/tutorial/94069d034ceff71eefa709524a998643.mp4"
				v-show="tutorial"></video>
			<view class="card u-flex u-m-t-20">
				<view class="card-item u-p-20 u-flex" @click="jumWebview('ad')">
					<view class="card-item-r">
						<view class="title">大红包</view>
						<view class="content">美团，饿了么，电影票，流量卡，打车优惠券等</view>
					</view>
					<view class="card-item-l">
						<text class="icon-kx icon-kx-hongbao1 icon-sty" style="color: #e60012;"></text>
					</view>
				</view>
				<view class="card-item u-p-20 u-flex" @click="jumWebview('translate')">
					<view class="card-item-r">
						<view class="title">AI翻译</view>
						<view class="content">将输入的文本翻译成指定语言</view>
					</view>
					<view class="card-item-l">
						<text class="icon-kx icon-kx-fanyi-full icon-sty" style="color: #4e5a5a;"></text>
					</view>
				</view>
				<view class="card-item u-p-20 u-flex" @click="jumWebview('record')">
					<view class="card-item-r">
						<view class="title">解析记录</view>
						<view class="content">查看解析记录</view>
					</view>
					<view class="card-item-l">
						<text class="icon-kx icon-kx-jilu icon-sty" style="color: #73aa2b;"></text>
					</view>
				</view>
				<view class="card-item u-p-20 u-flex" @click="jumWebview('md5')">
					<view class="card-item-r">
						<view class="title">修改MD5</view>
						<view class="content">提高视频原创度</view>
					</view>
					<view class="card-item-l">
						<text class="icon-kx icon-kx-MD51 icon-sty" style="color: #5a491f;"></text>
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
	import comMixin from './mixin'
	let videoAd = null
	export default {
		mixins: [comMixin],
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
				isBach: false,
				tutorial: false
			}
		},
		onShareAppMessage() {
			return {
				title: '不限次数,免费去水印',
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
			if (uni.getStorageSync('uni_id_token')) this.getVoucher()
			this.showVideoAd();
		},
		methods: {
			//打开使用教程
			openTutorial(e) {
				this.tutorial = e
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
			/* 粘贴 */
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
					videoAd.show()
				} else {
					this.watermark();
				}
			},
			// 激励广告
			showVideoAd() {
				if (wx.createRewardedVideoAd) {
					videoAd = wx.createRewardedVideoAd({
						adUnitId: 'adunit-1dc983d402c3db58'
					})
					videoAd.onError((err) => {
						videoAd.load()
					})
					videoAd.onClose((res) => {
						if (!res.isEnded) return uni.showModal({
							title: "解析失败",
							content: "还没看完呢！不能偷懒哦！",
							confirmText: "重新开始",
							success: (res) => {
								if (res.confirm) videoAd.show()
							}
						})
						this.authorWorkWatermark();
					})
				}
			},
			//短视频解析
			watermark() {
				let todayCount = this.userData.watermark_count++
				let allCount = this.userData.cumulative++
				let updateData = {
					watermark_count: todayCount,
					cumulative: allCount
				}
				watermark({
					link: this.url
				}).then(res => {
					console.log(res, 336);
					let data = JSON.parse(JSON.stringify(res.data)) || {}
					let imgUrl = this.ensureHttps(data.imageSrc)
					let videoUrl = this.ensureHttps(data.videoSrc)
					let imageAtlas = data.imageAtlas.map(o => this.ensureHttps(o))
					this.detialData = {
						...data,
						imageSrc: imgUrl,
						videoSrc: videoUrl,
						imageAtlas: imageAtlas, // 初始化为传入的 imageAtlas
					};
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
					justify-content: space-between;
					margin-top: 20rpx;
				}
			}
		}
	}
</style>