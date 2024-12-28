<template>
	<view class="batch-v">
		<mescroll-body ref="mescrollRef" @down="downCallback" :down="downOption" :sticky="false" @up="upCallback"
			:up="upOption" :bottombar="false" @init="mescrollInit" top="20">
			<view class="batch-content">
				<view class="u-flex img-item-box">
					<view class="img-item u-flex" v-for="(item,index) in this.dataList" :key="index"
						@click="goDetails(item)">
						<image :src="item.imageSrc" class="image-sty" mode="widthFix"></image>
						<!-- 	<u-button type="primary" size="mini"
							style="position: absolute;bottom: 8rpx;left: 8rpx;">点击查看详情</u-button> -->
					</view>
				</view>
			</view>
		</mescroll-body>
		<kxCustomer></kxCustomer>
	</view>
</template>
<script>
	// #ifdef MP-WEIXIN
	const fs = wx.getFileSystemManager()
	// #endif
	import {
		watermark,
		authorWorkWatermark
	} from "@/api/external.js";
	import waterfallItem from './waterfall-item.vue'
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				dataList: [],
				bathData: {},
				downOption: {
					use: false,
					auto: false,
				},
				upOption: {
					use: true,
					auto: false,
					page: {
						num: 0,
						size: 5,
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
			/* 插屏广告 */
			this.tools.wxAd('adunit-11214e4ee21b294f')
		},
		onLoad(e) {
			this.bathData = JSON.parse(decodeURIComponent(e.config));
			this.dataList = this.bathData.aweme_list
		},
		methods: {
			watermark(url) {
				watermark({
					link: url
				}).then(res => {
					let data = JSON.parse(JSON.stringify(res.data)) || {}
					this.jumpDetial(data)
				}).catch(err => {})
			},
			/* 查看详情 */
			goDetails(item) {
				if (this.bathData.linkPlatform === 'xiaohongshu') {
					this.watermark(item.awemeLink)
				} else {
					this.jumpDetial(item)
				}
			},
			jumpDetial(item) {
				let imgUrl = this.ensureHttps(item.imageSrc)
				let videoUrl = this.ensureHttps(item.videoSrc)
				let imageAtlas = item.imageAtlas.map(o => this.ensureHttps(o))
				this.detialData = {
					...item,
					imageSrc: imgUrl,
					videoSrc: videoUrl,
					imageAtlas: imageAtlas
				}
				uni.navigateTo({
					url: '/pages/analysis/analysisDetial/index?config=' + encodeURIComponent(JSON
						.stringify(this.detialData))
				})
			},
			ensureHttps(url) {
				return url.replace(/^http:\/\//i, 'https://');
			},
			upCallback() {
				if (this.showAnalysisDetial) return this.mescroll.endErr();
				let query = {
					appid: '66bc5fb2a5d7e1241SihJ',
					appsecret: '6B0TruSB7SvwczwF4vZ0iTiOXPZOcJST',
					link: this.bathData.link,
					max_cursor: this.bathData.max_cursor
				};
				authorWorkWatermark(query).then(res => {
					this.mescroll.endSuccess(res.data.aweme_list.length);
					this.bathData = res.data || {}
					let list = this.bathData.aweme_list || [];
					this.dataList = this.dataList.concat(list)
				}).catch(err => {
					this.mescroll.endErr();
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f0f2f6;
	}

	.batch-v {

		.batch-content {
			.img-item-box {
				flex-wrap: wrap;
				justify-content: space-between;
				padding: 0 20rpx;

				.img-item {
					position: relative;
					width: 48%;
					align-items: center;
					margin-bottom: 10rpx;

					.image-sty {
						width: 100%;
						height: 100%;
						border-radius: 16rpx;
						box-shadow: 0px 0px 14rpx 0rpx rgba(13, 158, 253, 0.1);
					}
				}
			}
		}
	}
</style>