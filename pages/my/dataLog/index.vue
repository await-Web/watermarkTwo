<template>
	<view class="wallpaper">
		<view class="dataLog-tabs u-m-t-20 notice-warp">
			<u-tabs :list="list" :is-scroll="false" v-model="current" @change="change"></u-tabs>
			<view class=" u-m-t-20 u-m-b-20">
				<!-- 首页历史记录页横屏 -->
				<!-- <ad-custom unit-id="adunit-c987449dc7a56c07" ad-intervals="30"></ad-custom> -->
			</view>
		</view>
		<mescroll-body ref="mescrollRef" @down="downCallback" :down="downOption" :sticky="false" @up="upCallback"
			:up="upOption" :bottombar="false" @init="mescrollInit" top="370">
			<view class="content">
				<view class="u-flex img-item-box">
					<view class="img-item u-flex" v-for="(item,index) in imgList" :key="index"
						@click="watermark(item.watermarkObj)">
						<image :src="item.watermarkObj.imageSrc" class="image-sty" mode="heightFix"></image>
						<u-button type="primary" size="mini" @click="watermark(item.watermarkObj)"
							class="btn">点击查看详情</u-button>
					</view>
				</view>
			</view>
		</mescroll-body>
		<kxCustomer></kxCustomer>
	</view>
</template>
<script>
	import {
		getVoucher,
		watermark,
		authorWorkWatermark
	} from "@/api/external.js";
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				list: [{
					name: '我喜欢的'
				}, {
					name: '大家喜欢的'
				}],
				current: 0,
				showAddImagesForm: false,
				imgList: [],
				downOption: {
					use: false,
					auto: false,
				},
				skipNumber: 1,
				upOption: {
					use: true,
					auto: true,
					page: {
						num: 0,
						size: 20,
						time: null,
					},
					empty: {
						use: true,
						icon: '',
						tip: "暂无数据",
						fixed: false,
						top: "560rpx",
					},
					textNoMore: "没有更多数据",
				},
			}
		},
		onShow() {
			this.tools.wxAd('adunit-11214e4ee21b294f')
		},
		computed: {
			currentUser() {
				let hostUserInfo = uni.getStorageSync('uni-id-pages-userInfo') || {}
				return hostUserInfo._id
			},
			isAdmin() {
				return this.tools.isAdminRole()
			}
		},
		onShareAppMessage() {
			return {
				title: '高清无水印壁纸',
				path: '/pages/analysis/wallpaper/index'
			}
		},
		onLoad(e) {
			this.current = e.index || 0
			this.getVoucher()
			this.share()
		},
		methods: {
			share() {
				//分享
				// #ifdef MP-WEIXIN
				wx.showShareMenu({
					withShareTicket: false,
					menus: ['shareAppMessage', 'shareTimeline']
				})
				// #endif
			},
			reset() {
				this.imgList = [];
				this.mescroll.resetUpScroll();
			},
			change(e) {
				this.current = e
				this.reset()
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
			//短视频解析
			watermark(item) {
				if (!item.link) return this.$u.toast("分享链接不能为空")
				let data = {
					link: item.link
				}
				watermark(data).then(res => {
					let data = JSON.parse(JSON.stringify(res.data)) || {}
					if (data.videoSrc) return this.$u.toast("这个暂时看不了！")
					uni.navigateTo({
						url: '/pages/analysis/wallpaper/index?config=' + encodeURIComponent(JSON
							.stringify(data))
					})
				}).catch(err => {
					this.authorWorkWatermark(item)
				})
			},
			ensureHttps(url) {
				return url.replace(/^http:\/\//i, 'https://');
			},
			//批量解析
			authorWorkWatermark(item) {
				if (!item.link) return this.$u.toast("分享链接不能为空")
				let data = {
					appid: '66bc5fb2a5d7e1241SihJ',
					appsecret: '6B0TruSB7SvwczwF4vZ0iTiOXPZOcJST',
					link: item.link
				}
				authorWorkWatermark(data).then(res => {
					let data = JSON.parse(JSON.stringify(res.data)) || {}
					if (res.code == '1') {
						uni.navigateTo({
							url: '/pages/analysis/wallpaper/index?config=' + encodeURIComponent(JSON
								.stringify(data))
						})
					}
				})
			},
			upCallback(page) {
				let type = this.current == '0' ? 'current' : 'all'
				let query = {
					skipNumber: (page.num - 1) * page.size,
					pageSize: page.size,
					user_id: this.currentUser,
					type
				}
				uniCloud.callFunction({
					name: 'getDataLog',
					data: query,
				}).then(res => {
					this.tools.wxAd('adunit-11214e4ee21b294f')
					let list = res.result.data || []
					this.mescroll.endSuccess(list.length);
					if (page.num == 1) this.imgList = [];
					this.imgList = this.imgList.concat(list);
					const uniqueByWatermarkLink = (arr) => {
						const seenLinks = new Set();
						return arr.filter(item => {
							const link = item.watermarkObj.link;
							if (!seenLinks.has(link)) {
								seenLinks.add(link);
								return true;
							}
							return false;
						});
					};
					this.imgList = uniqueByWatermarkLink(this.imgList);
				});
			}
		}
	}
</script>
<style lang="scss">
	page {
		background-color: #09081a;
	}

	.wallpaper {
		padding: 0 20rpx 20rpx 20rpx;

		.notice-warp {
			z-index: 9;
			position: fixed;
			top: var(--window-top);
			left: 0;
			width: 100%;
			height: 80rpx;
			/*对应mescroll-body的top值*/
			font-size: 26rpx;
			text-align: center;
			border-radius: 100rpx;
		}

		.dataLog-tabs {
			width: 100%;
			padding: 0 20rpx;

			::v-deep .u-tabs {
				border-radius: 100rpx;
				opacity: 0.8;
				background-color: #09081a;
			}
		}

		.content {

			.img-item-box {
				flex-wrap: wrap;
				justify-content: space-between;

				.img-item {
					position: relative;
					align-items: center;
					margin-bottom: 10rpx;
					width: 48%;
					height: 540rpx;
					border: 1px solid #fff;
					border-radius: 8rpx;

					.image-sty {
						width: 100% !important;
						height: 100%;
					}

					.btn {
						position: absolute;
						bottom: 8rpx;
						left: 8rpx;
					}
				}
			}
		}
	}
</style>