<template>
	<view class="self">
		<view class="userinfo">
			<view class="left">
				<view class="avatar">
					<view class="box">
						<view class="inner">
							<image :src="avatar || '../../static/image/defAvatar.png'" mode=""></image>
							<button open-type="chooseAvatar" @chooseavatar="onChooseAvatar" class="btn">按钮</button>
							<view class="mask" v-if="uploadState">
								上传{{percentCompleted}}%
							</view>
						</view>
						<view class="icon">
							<uni-icons type="camera" color="#fff" size="16"></uni-icons>
						</view>
						<view class="text">点击更换头像</view>
					</view>
				</view>
				<view class="info">
					<view class="username">{{username}}</view>
				</view>
			</view>
			<view class="right" @click="jumPage('/pages/my/personalDetails/index')">
				<view class="text">编辑资料</view>
				<view class="icon">
					<uni-icons type="right" size="20" color="#999"></uni-icons>
				</view>
			</view>
		</view>
		<view class=" my-group-box">
			<view class="my-group-box-inner">
				<u-cell-group :border="false" class="cell-group">
					<u-cell-item title="历史记录" @click="openPage('/pages/my/dataLog/index')" :title-style="titleStyle">
						<template #icon>
							<text class="icon-kx icon-kx-jilu u-m-r-16 u-font-32" />
						</template>
					</u-cell-item>
				</u-cell-group>
			</view>
			<view class="my-group-box-inner" v-if="tools.isAdminRole()">
				<u-cell-group :border="false" class="cell-group">
					<u-cell-item title="添加推广" @click="openPage('/pages/my/adForm/form')" :title-style="titleStyle">
						<template #icon>
							<text class="icon-kx icon-kx-jilu u-m-r-16 u-font-32" />
						</template>
					</u-cell-item>
				</u-cell-group>
			</view>
		</view>
		<!-- 个人中心 -->
		<!-- <view class="wx-ad">
			<ad unit-id="adunit-a84b32b8fef5634c" ad-type="video" ad-theme="white"></ad>
		</view> -->
		<view class="bottom-box">
			<view>{{version}}</view>
			<view @click="setClipboardData">{{`uid:${uid}`}}</view>
		</view>
		<kxCustomer></kxCustomer>
	</view>
</template>

<script>
	import {
		useUserStore
	} from "@/store/user.js"
	const userStore = useUserStore()
	export default {
		data() {
			return {
				uploadState: false,
				percentCompleted: 0,
				avatar: '',
				username: '',
				register_date: 0,
				titleStyle: {
					color: '#606266'
				},
				version: ''
			}
		},
		computed: {
			userData() {
				return userStore
			},
			isAdmin() {
				return this.tools.isAdminRole()
			},
			uid() {
				return uniCloud.getCurrentUserInfo().uid
			}
		},
		onShow() {
			this.tools.wxAd('adunit-7aa1c46635182c64')
		},
		onLoad() {
			this.init()
			// #ifdef MP-WEIXIN
			const accountInfo = wx.getAccountInfoSync();
			this.version = accountInfo.miniProgram.version
			// #endif
		},
		methods: {
			/* 复制uid */
			setClipboardData() {
				uni.setClipboardData({
					data: this.uid,
					success: () => {
						this.$u.toast("复制成功")
					}
				});
			},
			init() {
				this.avatar = this.userData.userInfo.avatar
				this.username = this.userData.userInfo.username
				this.register_date = this.tools.daysFromTimestamp(this.userData.userInfo.register_date)
			},
			/* 上传头像 */
			onChooseAvatar(e) {
				this.uploadState = true;
				this.avatar = e.detail.avatarUrl;
				uniCloud.uploadFile({
					filePath: this.avatar,
					cloudPath: `userAvatar/${this.tools.formatDate(Date.now(), "yyyyMMdd")}/${Date.now()}.jpg`,
					cloudPathAsRealPath: true,
					onUploadProgress: (progressEvent) => {
						this.percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
					}
				}).then(res => {
					this.avatar = res.fileID
					let data = {
						avatar: this.avatar
					}
					this.userData.updateUserInfo(data)
					this.uploadState = false;
				})
			},
			/* 跳转详情页 */
			jumPage(path) {
				if (!path) return
				uni.navigateTo({
					url: path
				})
			},
			openPage(path) {
				// return this.$u.toast("功能开发中敬请期待")
				if (!path) return
				uni.navigateTo({
					url: path
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.self {
		background: $page-bg-color;
		min-height: 100vh;
		padding-bottom: 20rpx;

		.wx-ad {
			width: 100%;
			margin-top: 20rpx;
			padding: 0 20rpx;

			.ad-video {
				width: 100%;
				border-radius: 10rpx;
			}
		}

		.userinfo {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx;
			background-color: #fff;
			margin-bottom: 20rpx;

			.left {
				display: flex;
				align-items: center;

				.avatar {
					padding: 60rpx 0;
					display: flex;
					justify-content: center;
					align-items: center;

					.box {
						height: 100rpx;
						width: 100rpx;
						position: relative;

						.inner {
							width: 100%;
							height: 100%;

							image {
								width: 100%;
								height: 100%;
								border-radius: 50%;
								border: 1px solid #eee;
							}

							.btn {
								position: absolute;
								top: 0;
								left: 0;
								width: 100%;
								height: 100%;
								border-radius: 50%;
								opacity: 0;
							}

							.mask {
								position: absolute;
								background: rgba(0, 0, 0, 0.6);
								color: #fff;
								top: 0;
								left: 0;
								width: 100%;
								height: 100%;
								border-radius: 50%;
								display: flex;
								justify-content: center;
								align-items: center;
								font-size: 22rpx;
							}
						}

						.icon {
							width: 40rpx;
							height: 40rpx;
							background: #FE9468;
							border-radius: 50%;
							display: flex;
							justify-content: center;
							align-items: center;
							border: 2px solid #fff;
							position: absolute;
							right: 0;
							bottom: 0;
							pointer-events: none;
						}

						.text {
							font-size: 25rpx;
							color: #999;
							white-space: nowrap;
							padding: 20rpx 0;
							text-align: center;
						}
					}
				}

				.info {
					padding-left: 20rpx;

					.username {
						font-size: 38rpx;
						font-weight: 600;
						color: #111;
					}

					.text {
						font-size: 26rpx;
						font-weight: 100;
						color: $text-font-color-3;
						padding-top: 10rpx;
					}


				}
			}

			.right {
				display: flex;
				align-items: center;

				.text {
					font-size: 28rpx;
					color: #999;
				}
			}
		}

		.block {
			margin-top: 20rpx;
		}

		.my-group-box {
			.my-group-box-inner {
				background-color: #fff;

				.cell-group {
					.icon-kx-jilu {
						color: #6071F5;
					}

					.icon-kx-QQ {
						color: #fe9468;
					}
				}
			}
		}

		.bottom-box {
			position: fixed;
			bottom: 20rpx;
			left: 0;
			right: 0;
			text-align: center;
		}
	}
</style>