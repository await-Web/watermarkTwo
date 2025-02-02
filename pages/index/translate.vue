<template>
	<view class="translate-v">
		<kxDiyTitleBar></kxDiyTitleBar>
		<view class="title u-flex">
			<view>翻译成</view>
			<view class="u-m-l-12" style="flex: 0.4;">
				<uni-data-select v-model="lang" :localdata="range" @change="change" placeholder="目标语言"
					:clear="false"></uni-data-select>
			</view>
		</view>
		<view class="u-flex-col u-m-t-20 translate-box">
			<view class="translate-top u-flex-col translate">
				<view class="input-box">
					<u-input v-model="value" type="textarea" :auto-height="autoHeight" height="400" maxlength='999'
						placeholder="输入文本" />
				</view>
				<view class="u-flex u-p-l-24 u-p-r-24 btn">
					<view class="u-flex">
						<view class="icon-kx icon-kx-delete icon-sty u-m-r-5" @click="clear"></view>
						<view class="icon-kx icon-kx-niantie icon-sty u-m-l-5" @click="pasteContent"></view>
						<view class="icon-kx icon-kx-fuzhi2 icon-sty u-m-l-5" @click="copyContent"></view>
					</view>
					<view>
						<u-button type="primary" size="mini" @click="getCozeApi">翻译</u-button>
					</view>
				</view>
			</view>
			<view class="icon-kx icon-kx-zhuanhuan3 icon-sty2"></view>
			<view class="translate-bottom translate">
				<view class="input-box">
					<u-input v-model="translationRes" type="textarea" :auto-height="autoHeight" height="400"
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
</template>

<script>
	import {
		getCozeTranslate
	} from "@/api/coze.js";
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
				lang: '英语'
			}
		},
		computed: {
			translationResPlaceholder() {
				return this.lang ? `目标语言-${this.lang}` : '目标语言'
			}
		},
		onShow() {
			this.clear()
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
			getCozeApi() {
				if (!this.value) return this.$u.toast("好的，请提供一下需要翻译成日语的内容吧。")
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
		padding: 0 28rpx;

		.translate-box {
			width: 100%;
			height: 100%;
			border-radius: 20rpx;

			.translate {
				height: 480rpx;
				background-color: #fff;
				border-radius: 20rpx;

				.input-box {
					width: 100%;
					height: 400rpx;
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
				font-size: 88rpx;
				line-height: 88rpx;
				color: #8dd3e0;
			}
		}

		.title {
			font-weight: bold;
			letter-spacing: 4rpx;
			font-family: fantasy;
			font-size: 48rpx;
		}
	}
</style>