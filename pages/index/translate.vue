<template>
	<view class="translate-v">
		<kxDiyTitleBar bgc="#ececf1"></kxDiyTitleBar>
		<view class="translate-content">
			<view class="title u-flex">
				<view>翻译成</view>
				<view class="u-m-l-12" style="flex: 0.4;">
					<uni-data-select v-model="lang" :localdata="range" @change="change" placeholder="目标语言"
						:clear="false"></uni-data-select>
				</view>
			</view>
			<view class="u-m-b-20 u-m-t-20">
				<ad-custom unit-id="adunit-f9d6f7ec79c67426" ad-intervals="30"></ad-custom>
			</view>
			<view class="u-flex-col u-m-t-20 translate-box">
				<view class=" u-flex-col translate">
					<view class="input-box">
						<u-input v-model="value" type="textarea" :auto-height="autoHeight" height="340" maxlength='999'
							placeholder="输入文本" />
					</view>
					<view class="u-flex u-p-l-24 u-p-r-24 btn">
						<view class="u-flex">
							<view class="icon-kx icon-kx-delete icon-sty u-m-r-5" @click="clear"></view>
							<view class="icon-kx icon-kx-niantie icon-sty u-m-l-5" @click="pasteContent"></view>
							<view class="icon-kx icon-kx-fuzhi2 icon-sty u-m-l-5" @click="copyContent"></view>
						</view>
						<view>
							<u-button size="mini" type="success" open-type="share">
								分享
								<text class="u-m-l-10 item-icon icon-kx icon-kx-wechat-fill"></text>
							</u-button>
							<u-button type="primary" size="mini" class="u-m-l-12" @click="openAd">翻译</u-button>
						</view>
					</view>
				</view>
				<view class="icon-kx icon-kx-zhuanhuan3 icon-sty2"></view>
				<view class="u-flex-col translate">
					<view class="input-box">
						<u-input v-model="translationRes" type="textarea" :auto-height="autoHeight" height="340"
							maxlength='999' :placeholder="translationResPlaceholder" disabled />
					</view>
					<view class="u-flex u-p-l-24 u-p-r-24 btn">
						<view class="u-flex">
							<view class="icon-kx icon-kx-fuzhi2 icon-sty u-m-l-5" @click="copyContent('res')"></view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getCozeTranslate
	} from "@/api/coze.js";
	let videoAd = null
	export default {
		data() {
			return {
				range: [{
						value: "英语",
						text: "英语"
					},
					{
						value: "印尼语",
						text: "印尼语"
					},
					{
						value: "泰语",
						text: "泰语"
					},
					{
						value: "日语",
						text: "日语"
					},
					{
						value: "中文",
						text: "中文"
					},
					{
						value: "法语",
						text: "法语"
					},
					{
						value: "菲律宾语",
						text: "菲律宾语"
					},
					{
						value: "葡萄牙语",
						text: "葡萄牙语"
					},
					{
						value: "德语",
						text: "德语"
					}
				],
				value: '',
				type: 'textarea',
				autoHeight: true,
				translationRes: "",
				translationcopy: '',
				lang: '英语',
				userIds: ['66f7b4f321821bdf93d152f9'],
			}
		},
		computed: {
			translationResPlaceholder() {
				return this.lang ? `目标语言-${this.lang}` : '目标语言'
			},
			/* 免广告 */
			isAdvertisement() {
				return this.tools.isCurrentUser(this.userIds) || this.tools.isAdminRole()
			},
		},
		onShow() {
			this.clear()
			/* 插屏广告 */
			this.tools.wxAd('adunit-7aa1c46635182c64')
		},
		onShareAppMessage(e) {
			return {
				title: '简单易操作的翻译工具',
				path: '/pages/index/translate.vue'
			}
		},
		onLoad() {
			this.showVideoAd();
		},
		methods: {
			clear() {
				this.translationRes = ""
				this.value = ""
			},
			change(e) {
				this.clear()
				if (e) this.lang = e
			},
			/* 复制 */
			copyContent(type) {
				if (!this.value) return this.$u.toast("复制失败！输入框为空")
				uni.setClipboardData({
					data: type === 'res' ? this.translationRes : this.value,
					success: () => {
						this.$u.toast("复制成功")
					}
				});
			},
			/* 粘贴 */
			pasteContent() {
				uni.getClipboardData({
					success: (res) => {
						this.value = this.value + res.data;
					},
					fail: () => {
						this.$u.toast("无法从剪贴板获取到内容");
					}
				});
			},
			// 激励广告
			showVideoAd() {
				if (wx.createRewardedVideoAd) {
					videoAd = wx.createRewardedVideoAd({
						adUnitId: 'adunit-d24ce93de7de23a8'
					})
					videoAd.onLoad(() => {})
					videoAd.onError((err) => {})
					videoAd.onClose((res) => {
						if (!res.isEnded) return uni.showModal({
							title: "翻译失败",
							content: "还没看完呢！不能偷懒哦！",
							confirmText: "重新开始",
							success: (res) => {
								if (res.confirm) this.openAd()
							}
						})
						this.getCozeApi()
					})
				}
			},
			// 激励广告
			openAd() {
				if (this.isAdvertisement) return this.getCozeApi();
				if (!this.value) return this.$u.toast("好的，请提供一下需要翻译成日语的内容吧。")
				videoAd.show()
			},
			getCozeApi() {
				let data = {
					parameters: {
						content: this.value,
						lang: this.lang,
					}
				}
				getCozeTranslate(data).then(res => {
					const data = res?.data && JSON.parse(res.data)
					this.translationRes = data.data
				}).catch(err => {})
			},
		}
	}
</script>

<style lang="scss">
	.translate-v {
		width: 100%;
		height: 100%;


		.translate-content {
			padding: 0 28rpx;

			.title {
				font-weight: bold;
				letter-spacing: 4rpx;
				font-family: fantasy;
				font-size: 48rpx;
			}

			.translate-box {
				width: 100%;
				height: 100%;
				border-radius: 20rpx;

				.translate {
					height: 420rpx;
					background-color: #fff;
					border-radius: 20rpx;

					.input-box {
						width: 100%;
						height: 340rpx;
						overflow: scroll;
					}

					.btn {
						width: 100%;
						border-top: 1px solid #f2f2f7;
						flex: 1;
						border-radius: 0 0 20rpx 20rpx;
						justify-content: space-between;

						.icon-sty {
							width: 100rpx;
							height: 80rpx;
							line-height: 80rpx;
							font-size: 44rpx;

							text-align: center;
							color: #8dd3e0;
						}
					}

					::v-deep {
						.input--u-input__textarea {
							padding: 24rpx;
						}
					}
				}

				.icon-sty2 {
					width: 100;
					height: 88rpx;
					text-align: center;
					font-size: 74rpx;
					line-height: 88rpx;
					color: #8dd3e0;
				}
			}
		}
	}
</style>