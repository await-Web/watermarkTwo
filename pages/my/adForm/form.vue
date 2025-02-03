<template>
	<view class="page_v" :style="{paddingBottom:safeAreaInsets+'px'}">
		<uni-section title="添加推广列表" type="line">
			<view class="example">
				<uni-forms ref="form" v-model="formData" label-position="top">
					<uni-forms-item label="推广品牌">
						<uni-easyinput v-model="formData.brand" placeholder="请输入" />
					</uni-forms-item>
					<uni-forms-item label="推广类型">
						<uni-easyinput v-model="formData.type" placeholder="请输入" />
					</uni-forms-item>
					<uni-forms-item label="推广描述">
						<uni-easyinput v-model="formData.goodsDescription" placeholder="请输入" />
					</uni-forms-item>
					<uni-forms-item label="小程序id">
						<uni-easyinput v-model="formData.appId" placeholder="请输入" />
					</uni-forms-item>
					<uni-forms-item label="小程序页面路径">
						<uni-easyinput v-model="formData.pagePath" placeholder="请输入" />
					</uni-forms-item>
					<uni-forms-item label="推广封面url">
						<uni-easyinput v-model="formData.promotionImgUrl" placeholder="请输入" />
					</uni-forms-item>
					<uni-forms-item label="推广口令">
						<uni-easyinput v-model="formData.psw" placeholder="请输入" />
					</uni-forms-item>
					<uni-forms-item label="短链接">
						<uni-easyinput v-model="formData.shortLink" placeholder="请输入" />
					</uni-forms-item>
					<uni-forms-item label="长链接">
						<uni-easyinput v-model="formData.longLink" placeholder="请输入" />
					</uni-forms-item>
					<uni-forms-item label="二维码海报">
						<uni-easyinput v-model="formData.QRCodeSrc" placeholder="请输入" />
					</uni-forms-item>
					<uni-forms-item label="推广封面">
						<view class="u-flex-col">
							<u-button type="primary" size="mini" @click="upload"
								style="margin-bottom: 40rpx;">添加图片</u-button>
							<image v-if="formData.promotionImg" mode="scaleToFill" :src="formData.promotionImg">
							</image>
						</view>
					</uni-forms-item>
				</uni-forms>
			</view>
			<view class="bottom-box" :style="{minHeight:safeAreaInsets+'px'}">
				<view class="btn" :style="{bottom:safeAreaInsets+'px'}">
					<button type="primary" @click="submit()" :loading="loading" class="button">提交</button>
				</view>
			</view>
		</uni-section>
	</view>
</template>
<script>
	const db = uniCloud.database();
	const setAdList = db.collection('advertisement-list')
	const getAdList = db.collection('advertisement-list')
	export default {
		data() {
			return {
				formData: {
					brand: '',
					psw: '',
					type: "",
					goodsDescription: '',
					promotionImg: '',
					appId: '',
					pagePath: '',
					shortLink: '',
					longLink: '',
					QRCodeSrc: '',
					promotionImgUrl: ''
				},
				safeAreaInsets: 0,
				percentCompleted: 0,
			}
		},
		onReady() {

		},
		onShow() {

		},
		onLoad() {
			const {
				safeAreaInsets
			} = uni.getSystemInfoSync();
			this.safeAreaInsets = safeAreaInsets.bottom;
		},
		computed: {

		},
		methods: {

			upload(e) {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						if (res.tempFilePaths.length) {
							let filePath = res.tempFilePaths[0]
							uniCloud.uploadFile({
								filePath,
								cloudPath: `adImg/${this.tools.formatDate(Date.now(), "yyyyMMdd")}/${Date.now()}.jpg`,
								cloudPathAsRealPath: true,
								success: (res) => {
									this.formData.promotionImg = res.fileID
								}
							})
						}
					}
				})
			},
			submit() {
				uni.showLoading({
					title: "正在提交"
				})
				setAdList.add({
					dateTimestamp: this.tools.getCurrentDateTime('timestamp'),
					date: this.tools.getCurrentDateTime(),
					...this.formData
				}).then(res => {
					Object.assign(this.$data.formData, this.$options.data().formData);
					uni.hideLoading()
				}).catch(err => {
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $background-color;
	}

	.page_v {
		display: flex;
		flex-direction: column;
		/* #ifdef MP-WEIXIN */
		height: 100%;
		/* #endif */
		/* #ifndef MP-WEIXIN */
		height: calc(100vh - 2.85rem);
		/* #endif */

	}

	.example {
		padding: 15px;
		background-color: #fff;
	}

	.bottom-box {
		position: fixed;
		width: 100%;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #fff;
		z-index: 99;

		.btn {
			width: 100%;
			height: 80rpx;
			position: absolute;
			margin: 0 auto;
			display: flex;
			align-items: center;
			justify-content: center;

			.button {
				width: 100%;
				border-radius: 0;
			}
		}
	}





	.form-item {
		display: flex;
		align-items: center;
	}
</style>