<template>
	<view class="page_v">
		<view>
			<!-- 解析完成页 -->
			<!-- 	<view class=" u-m-t-20 u-m-b-20">
				<ad-custom unit-id="adunit-25663b600ce971b2" ad-intervals="30"></ad-custom>
			</view> -->
			<view class="activity u-m-t-20 u-p-l-20 u-p-r-20" @click="jumWebview('1')">
				<view class="life_item">
					<view class="banner_box">
						<image mode="scaleToFill"
							src="https://mp-7c084917-6399-4468-8aac-cfaca7df5b39.cdn.bspapp.com/activity/cover_783065.png"
							class="banner"></image>
					</view>
					<view class="name">春节假期想去哪就去哪</view>
					<view class="u-flex u-p-b-10" style="justify-content: center;">
						<u-button type="primary" size="medium" @click="jumWebview('1')">立即领取</u-button>
					</view>
				</view>
			</view>
			<view class="u-flex-col content  u-p-l-20 u-p-r-20">
				<!-- 描述 -->
				<view class="u-m-t-20 url-input u-m-b-20">
					<view class="u-flex u-m-b-10">
						<u-button size="mini" type="primary" @click="copy(title)" v-if="title">复制标题</u-button>
						<u-button v-if="detialData.description" size="mini" type="primary"
							@click="copy(detialData.description)" class="u-m-l-10">复制文案</u-button>
					</view>
					<view class="u-p-20 textareaStyle" v-if="title">
						<u-input v-model="title" type="textarea" disabled maxlength="9999999" />
					</view>
					<view class="u-p-20 textareaStyle u-m-t-10" v-if="detialData.description">
						<u-input v-model="detialData.description" disabled />
					</view>
				</view>
				<!-- 图片 -->
				<view class="u-m-t-20 u-flex top-btn" v-if="imageAtlas?.length">
					<view>
						<u-button size="mini" type="warning" @click="clearAll" class="u-m-r-10">{{`清空`}}</u-button>
						<u-button size="mini" type="primary" v-if="multipleUrlList.length"
							@click="batchDownload">{{`批量下载 (${multipleUrlList.length})`}}</u-button>
						<u-button size="mini" type="primary" v-else @click="batchDownload">{{`批量下载`}}</u-button>
					</view>
				</view>
				<view class="imgs-box u-flex" v-if="imageAtlas?.length">
					<scroll-view scroll-y="true" class="scroll-Y" @scrolltoupper="upper" @scrolltolower="lower"
						@scroll="scroll">
						<view class="u-flex scroll-box">
							<view class="img-item-box" v-for="(item,index) in imageAtlas" :key="index">
								<view class="img-item">
									<view class="img-item-checkbox">
										<u-checkbox @change="checkboxChange($event,item)" v-model="item.checked"
											:name="index"></u-checkbox>
									</view>
									<image :src="item.url" class="image-sty" @tap="previewImage(index)"></image>
									<u-button v-if="!isMultiple" type="primary" size="mini"
										@click="handleDownloads(index,'img')"
										style="position: absolute;bottom: 8rpx;left: 8rpx;">下载</u-button>
								</view>
							</view>
							<view class="glare-effect" @click="jump">
								查看更多壁纸
							</view>
						</view>
					</scroll-view>
				</view>
				<!-- 视频 -->
				<view class="u-m-t-20 video-box" v-else>
					<video id="myVideo" :src="detialData.videoSrc" controls></video>
				</view>

				<view class="u-flex btn-box" v-if="detialData.videoSrc && !detialData.isMP">
					<u-button type="primary" size="medium"
						@click="handleDownloads(detialData.videoSrc,'video')">下载视频</u-button>
					<u-button type="primary" size="medium"
						@click="handleDownloads(detialData.imageSrc,'img')">下载封面</u-button>
					<u-button type="success" size="medium" @click="copy(detialData.videoSrc)">复制无水印视频链接</u-button>
					<u-button type="success" size="medium" @click="copy(detialData.imageSrc)">复制无水印封面链接</u-button>
				</view>

			</view>
		</view>
		<kxCustomer></kxCustomer>
	</view>
</template>
<script>
	// #ifdef MP-WEIXIN
	const fs = wx.getFileSystemManager()
	// #endif
	export default {
		data() {
			return {
				show: false,
				showTips: false,
				newTime: +new Date(),
				detialData: {},
				batchCont: 0,
				imageAtlas: [],
				multipleUrlList: [],
				isBatch: false,
				userIds: ['66f7b4f321821bdf93d152f9'],
				title: ''
			}
		},
		onLoad(e) {
			/* 插屏广告 */
			this.tools.wxAd('adunit-11214e4ee21b294f')
			this.detialData = JSON.parse(decodeURIComponent(e.config));
			this.title = this.detialData.title
			this.imageAtlas = JSON.parse(JSON.stringify(this.detialData.imageAtlas))
			this.handleImageAtlas()
		},
		computed: {
			isAdvertisement() {
				return this.tools.isCurrentUser(this.userIds) || this.tools.isAdminRole()
			},
			isMultiple() {
				return this.multipleUrlList.length
			}
		},
		methods: {

			jumWebview(type) {
				const navigateToMiniProgram = (appId, path, envVersion = 'release') => {
					uni.navigateToMiniProgram({
						appId,
						path,
						envVersion,
						success(res) {},
						fail(err) {}
					});
				};
				switch (type) {
					case '1':
						navigateToMiniProgram('wxaf35009675aa0b2a',
							'/pages/index/index?scene=YoZ591b&source_id=26b88e0a7f02ca189c71&ref_from=dunion&dunion_callback=%7B%22partner_mark%22%3A%2226b88e0a7f02ca189c71%22%7D'
						);
						break;
					default:
						break;
				}
			},

			//处理图片数据
			handleImageAtlas() {
				if (this.imageAtlas?.length) {
					this.imageAtlas = this.imageAtlas.map((element, i) => {
						if (element) {
							return {
								url: element,
								name: i
							}
						}
					}).filter(item => item !== null)
				}
			},
			//清空选择
			clearAll() {
				this.multipleUrlList = []
				this.imageAtlas.map(o => (o.checked = false))
			},
			//多选
			checkboxChange(e, item) {
				if (e.value) {
					this.multipleUrlList.push(item)
				} else {
					this.multipleUrlList = this.multipleUrlList.filter(o => o.url != item.url)
				}
				this.multipleUrlList = [...new Set(this.multipleUrlList)]
			},
			// 批量下载
			batchDownload() {
				this.isBatch = true
				this.batchCont = 0
				this.handleDownloads(this.batchCont, 'img')
				// this.$nextTick(() => {
				// 	if (this.isAdvertisement) return this.handleDownloads(this.batchCont, 'img')
				// 	this.showVideoAd()
				// })
			},
			// 激励广告
			showVideoAd() {
				let videoAd = null
				if (wx.createRewardedVideoAd) {
					videoAd = wx.createRewardedVideoAd({
						adUnitId: 'adunit-4c2607506a97bbdd'
					})
					videoAd.onLoad(() => {})
					videoAd.onError((err) => {})
					videoAd.onClose((res) => {
						if (!res.isEnded) return uni.showModal({
							title: "下载失败",
							content: "还没看完呢！不能偷懒哦！",
							confirmText: "重新开始",
							success: (res) => {
								if (res.confirm) this.showVideoAd()
								if (res.cancel) this.resetValue()
							}
						})
						this.handleDownloads(this.batchCont, 'img')
					})
				}
				// 用户触发广告后，显示激励视频广告
				if (videoAd) {
					videoAd.show().catch(() => {
						// 失败重试
						videoAd.load().then(() => videoAd.show()).catch(err => {
							console.error('激励视频 广告显示失败', err)
						})
					})
				}
			},
			//重置部分值
			resetValue() {
				this.isBatch = false;
				this.batchCont = 0
			},
			jump() {
				uni.navigateTo({
					url: '/pages/my/dataLog/index?index=1'
				});
			},
			// 预览图片
			previewImage(i) {
				uni.previewImage({
					urls: this.detialData.imageAtlas,
					current: i,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			//处理解析后的数据
			handleDownloads(index, type) {
				let imgData = this.isMultiple ? this.multipleUrlList : this.imageAtlas
				let url = type === 'img' ? imgData[index].url : index
				var downloadTask = uni.downloadFile({
					url: url,
					timeout: 6000000,
					success: (res) => {
						if (res.statusCode === 200) {
							if (type === 'img') this.saveImage(res.tempFilePath)
							if (type === 'video') this.handleVideoFile('video', `${this.newTime}.mp4`, res
								.tempFilePath)
						}
					},
					fail: (err) => {
						this.resetValue()
						if (err.errMsg == 'downloadFile:fail exceed max file size') {
							uni.showModal({
								title: "下载失败",
								content: "该文件超过200M，无法直接在微信下载，请复制链接去外部浏览器下载",
								confirmText: "复制链接",
								showCancel: false
							})
							return
						}
						uni.showToast({
							title: "下载失败，请复制链接去浏览器下载",
							icon: "none"
						})
					}
				});
				downloadTask.onProgressUpdate((res) => {
					uni.showLoading({
						title: '正在下载' + res.progress + '%'
					})
					if (res.progress == 100) uni.hideLoading()
				});
			},
			// 保存图片
			saveImage(tempFilePath) {
				let imgData = this.isMultiple ? this.multipleUrlList : this.imageAtlas
				uni.saveImageToPhotosAlbum({
					filePath: tempFilePath,
					success: () => {
						if ((this.isMultiple || this.isBatch) && this.batchCont < imgData.length) {
							this.batchCont++
							if (this.batchCont >= imgData.length) {
								this.resetValue()
								uni.showToast({
									title: '已保存在手机相册中',
									icon: 'none',
								});
								return
							}
							this.handleDownloads(this.batchCont, 'img')
						}
						uni.showToast({
							title: '已保存在手机相册中',
							icon: 'none',
						});
					},
					fail: (err) => {
						if (err.errMsg === 'saveImageToPhotosAlbum:fail cancel') {
							this.isMultiple && (this.batchCont = 0, this.isMultiple = false);
							return;
						}
						uni.showToast({
							title: '无法保存到手机,复制无水印视频链接',
							icon: 'none',
						});
					}
				})
			},

			//保存视频
			saveVideoFile(tempFilePath) {
				uni.saveVideoToPhotosAlbum({
					filePath: tempFilePath,
					success: (res) => {
						this.delContents()
						uni.showToast({
							title: '已保存在手机相册中',
							icon: 'none',
						});
					},
					fail: (err) => {
						if (err.errMsg == 'saveVideoToPhotosAlbum:fail cancel') return //取消，不做操作
						uni.showToast({
							title: '无法保存到手机,复制无水印视频链接',
							icon: 'none',
						});
					}
				})
			},
			/* 删除目录 */
			delContents() {
				try {
					fs.rmdirSync(`${wx.env.USER_DATA_PATH}/video`, true)
				} catch (e) {
					console.error('fsrmdir', e)
				}
			},
			//处理视频文件
			async handleVideoFile(dir, filePath, tempFilePath) {
				await this.delContents()
				await this.handleDirectory(dir)
				this.$nextTick(() => {
					this.saveVideoFile(tempFilePath)
				})
			},
			//处理文件目录
			handleDirectory(url) {
				//判断文件/目录是否存在
				try {
					fs.accessSync(`${wx.env.USER_DATA_PATH}/${url}`)
				} catch (e) {
					try {
						fs.mkdirSync(`${wx.env.USER_DATA_PATH}/${url}`, true)
					} catch (e) {}
				}
			},
			//复制
			copy(text) {
				uni.setClipboardData({
					data: text,
					showToast: false,
					success: () => {
						uni.hideToast(); // 隐藏弹出提示
						uni.hideKeyboard(); //  隐藏软键盘
						uni.showToast({
							title: '已复制'
						})
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #f0f2f6;
	}

	.page_v {
		padding-bottom: 40rpx;

		.activity {
			.life_item {
				width: 100%;
				overflow: hidden;

				border-radius: .5rem;
				box-shadow: 0 3px 10px hsla(0, 0%, 85.1%, .5);
				background-color: #fff;

				.banner_box {
					width: 100%;
					height: 100%;
					position: relative;

					.banner {
						width: 100%;
						height: 10rem;
					}
				}

				.name {
					width: 100%;
					height: 2.5rem;
					margin: 20rpx 0;
					line-height: 2.5rem;
					padding: 0 0.2rem;
					font-size: 1rem;
					font-weight: 700;
					word-break: keep-all;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
		}

		.title-box {
			display: flex;
			align-items: center;
			height: 100rpx;
			padding: 0 16rpx !important;

			.backIcon {
				font-size: 40rpx;
				color: #000;
			}

			.title {
				flex: 1;
				text-align: center;
				padding-right: 40rpx;
				font-size: 32rpx;
			}
		}

		.content {
			background-color: #f0f2f6;

			.top-btn {
				padding: 0 20rpx;
				justify-content: flex-start;
				border-radius: 8rpx;
				width: 100%;
				height: 88rpx;
				background-color: #fff;
			}

			.notice-bar-box {
				border-radius: 40rpx;
				margin-top: 20rpx;

				::v-deep uni-notice-bar {
					.uni-noticebar {
						border-radius: 80rpx;
					}
				}
			}

			.video-box {
				width: 100%;

				::v-deep video {
					width: 100%;
				}
			}

			.btn-box {
				flex-wrap: wrap;
				justify-content: space-between;
				margin-top: 20rpx;

				::v-deep button {
					width: 340rpx !important;
					margin-bottom: 20rpx;
				}
			}



			.url-input {
				width: 100%;
				background-color: #fff;
				padding: 20rpx;
				border-radius: 10rpx;
				box-shadow: 1rpx 1rpx 2rpx 1rpx rgba(0, 0, 0, 0.1);

				.textareaStyle {
					padding: 10rpx 20rpx;
					max-height: 160rpx;
					overflow-y: auto;
					border: 1rpx solid #fcc31f;
					border-radius: 8rpx;
				}
			}

			.imgs-box {
				border: 1px solid #ee8a1c;
				overflow-y: scroll;
				flex-wrap: wrap;
				justify-content: space-between;
				margin-top: 20rpx;
				padding: 20rpx;
				border-radius: 8rpx;

				.scroll-Y {
					max-height: 1000rpx;

					.scroll-box {
						flex-wrap: wrap;
						justify-content: space-between;

						.img-item-box {
							width: 48%;
						}
					}

					.img-item {
						position: relative;
						width: 100%;
						height: 440rpx;
						align-items: center;
						flex-wrap: wrap;
						justify-content: space-between;
						margin-bottom: 10rpx;

						.img-item-checkbox {
							position: absolute;
							top: 8rpx;
							left: 8rpx;

							::v-deep .u-checkbox {
								.u-checkbox__icon-wrap {
									width: 48rpx !important;
									height: 48rpx !important;
									box-shadow: 2rpx 0rpx 7rpx 0rpx rgba(0, 0, 0, .23);
								}
							}
						}

						.image-sty {
							width: 100%;
							height: 100%;
						}
					}

					.glare-effect {
						position: relative;
						width: 48%;
						height: 460rpx;
						/* 根据需要设置高度 */
						background-color: rgba(255, 255, 255, 0.8);
						/* 背景颜色 */
						backdrop-filter: blur(8rpx);
						/* 模糊度 */
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 36rpx;
						letter-spacing: 8rpx;
						color: orangered;


						&::before {
							content: '';
							position: absolute;
							top: 0;
							left: 0;
							right: 0;
							bottom: 0;
							// backdrop-filter: blur(2rpx);
							// background-color: rgba(255, 255, 255, 0.4);
						}
					}
				}
			}
		}
	}
</style>