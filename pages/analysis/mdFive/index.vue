<template>
	<!-- 这页面直接从插件市场套用的，只修改UI -->
	<view>
		<view class="u-p-30">
			<view class="box-shadow2">
				<view class="camera-box u-flex">
					<view class="u-flex-col up" v-if="xiugaistate == 1" @click="addVideo()">
						<view class="u-p-20 camera-box-inner u-flex">
							<u-icon name="camera-fill" color="#2979ff" size="40"></u-icon>
						</view>
						<view class="u-m-t-20">
							点击添加需要修改MD5的视频文件
						</view>
					</view>
					<video :src="urldata" v-if="xiugaistate == 2" style="" class="video-sty"></video>
				</view>
			</view>
			<view class="box-shadow2 u-m-t-30">
				<view class="content_z_c u-p-30" v-if="xiugaistate==2">
					<view class="">
						<span class="fwbold">视频时间：</span>{{durationtime}}
					</view>
					<view class="u-m-t-30">
						<span class="fwbold">视频大小：</span>{{videosize}}
					</view>
					<view class="u-m-t-30">
						<span class="fwbold">修改前MD5：</span>{{oldmd5}}
					</view>
					<view class="u-m-t-30">
						<span class="fwbold">修改后MD5：</span>{{newmd5}}
					</view>
				</view>
			</view>
			<view class="u-m-t-30 u-flex" v-if="xiugaistate==2">
				<button class="bg-gradual-blue" size="mini" style="width: 48%;" @click="resetvideo()">清空内容</button>
				<button class="bg-gradual-orange" size="mini" style="width: 48%;" @click="savevideo()">保存视频</button>
			</view>
			<view class="u-m-t-30 u-p-b-30" style="text-align: center;text-decoration:underline;"
				@click="showTips('有效解决视频的唯一性，防重检测，达到原创效果，轻松上热门')">
				修改MD5可以干嘛？
			</view>
			<!-- md52 -->
			<view class=" u-m-t-20 u-m-b-20">
				<ad-custom unit-id="adunit-6b184a1fdf776cbd" ad-intervals="30"></ad-custom>
			</view>
		</view>
		<kxCustomer></kxCustomer>
	</view>
</template>

<script>
	import util from '@/utils/util.js';
	export default {
		data() {
			return {
				xiugaistate: 1,
				urldata: '',
				oldmd5: "",
				newmd5: "",
				durationtime: "",
				videosize: ""
			}
		},
		onShow() {
			/* 插屏广告 */
			this.tools.wxAd('adunit-7aa1c46635182c64')
		},
		methods: {
			showTips(msg) {
				uni.showModal({
					content: msg,
					confirmText: '确定'
				})
			},
			// 添加视频
			addVideo() {
				// #ifndef MP-WEIXIN
				return;
				// #endif
				var t = this;
				uni.chooseVideo({
					sourceType: ["album"],
					success: function(res) {
						var n = util.duration(res.duration),
							s = util.kb(res.size),
							o = uni.getFileSystemManager();
						uni.getFileInfo({
								filePath: res.tempFilePath,
								success: function(e) {
									t.oldmd5 = e.digest
									t.durationtime = n
									t.videosize = s
								}
							}),
							o.saveFile({
								tempFilePath: res.tempFilePath,
								filePath: wx.env.USER_DATA_PATH + "/test.mp4",
								success: function(e) {
									console.log(e);
									o.appendFile({
										filePath: wx.env.USER_DATA_PATH + "/test.mp4",
										data: "01",
										success: function(e) {
											uni.getFileInfo({
												filePath: wx.env.USER_DATA_PATH +
													"/test.mp4",
												success: function(e) {
													if (e.errMsg ==
														"getFileInfo:ok") {
														t.newmd5 = e.digest
														t.urldata = wx.env
															.USER_DATA_PATH +
															"/test.mp4"
														t.xiugaistate = 2
													}

												}
											});
										}
									});
								}
							});
					}
				});
			},
			// 清空视频
			resetvideo() {
				// #ifndef MP-WEIXIN
				return;
				// #endif
				var e = this;
				uni.getFileSystemManager().unlink({
					filePath: wx.env.USER_DATA_PATH + "/test.mp4",
					success: function(t) {
						if ("unlink:ok" == t.errMsg) {
							e.xiugaistate = 1
						}
					}
				});
			},
			// 保存视频
			savevideo() {
				// #ifndef MP-WEIXIN
				return;
				// #endif
				var e = this,
					t = wx.getFileSystemManager();
				wx.saveVideoToPhotosAlbum({
					filePath: wx.env.USER_DATA_PATH + "/test.mp4",
					success: function(i) {
						"saveVideoToPhotosAlbum:ok" == i.errMsg && t.unlink({
							filePath: wx.env.USER_DATA_PATH + "/test.mp4",
							success: function(t) {
								if ("unlink:ok" == t.errMsg) {
									e.xiugaistate = 1
									uni.showToast({
										icon: 'none',
										title: '视频保存成功，请到手机相册中查看'
									})
								}
							}
						});
					},
					fail: function(t) {
						if ("saveVideoToPhotosAlbum:fail auth deny" == t.errMsg) {
							wx.showModal({
								title: "保存失败",
								content: "你需要设置授权保存到相册",
								cancelText: "不设置",
								confirmText: "去设置",
								success: function(e) {
									e.confirm ? wx.openSetting({
										success: function(e) {}
									}) : e.cancel;
								}
							})
						}

						if ("saveVideoToPhotosAlbum:fail invalid video" == t.errMsg) {
							uni.showToast({
								icon: 'none',
								title: '视频保存失败，联系客服修复'
							})
						}

					}
				});
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F9F9F9;
	}

	.addClass {
		font-size: 150rpx;
	}


	.content_z_c {
		overflow: hidden;
		width: 100%;
		height: 100%;
		font-size: 26rpx;
		color: #333;
	}

	.bg-gradual-orange {
		background-image: linear-gradient(45deg, #ff9700, #ed1c24);
		color: #ffffff;
	}

	.bg-gradual-blue {
		background-image: linear-gradient(45deg, #2979ff, #7909ff);
		color: #ffffff;
	}

	.box-shadow2 {
		box-shadow: 0px 5px 5px 0px #EDEDED;
		border-radius: 16rpx;
		background-color: #fff;

		.camera-box {
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 400rpx;

			.up {
				align-items: center;
			}

			.camera-box-inner {
				width: 94rpx;
				height: 94rpx;
				border-radius: 50%;
				align-items: center;
				justify-content: center;
				border: 1rpx solid #2979ff;
			}

			.video-sty {
				width: 100%;
				max-height: 400rpx;
			}
		}
	}

	.cu-btn {
		position: relative;
		border: 0upx;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		padding: 0 30upx;
		font-size: 28upx;
		height: 64upx;
		line-height: 1;
		text-align: center;
		text-decoration: none;
		overflow: visible;
		margin-left: initial;
		transform: translate(0upx, 0upx);
		margin-right: initial;
	}

	.cu-btn::after {
		display: none;
	}

	.shadow {
		box-shadow: 0 -1upx 6upx rgba(0, 0, 0, 0.1);
	}
</style>