<template>
	<view class="coupon-v" :style="{paddingBottom:safeAreaInsets+'px'}">
		<u-tabs :list="list" :current="current" @change="tabChange"></u-tabs>
		<view class="coupon-content">
			<adItem v-if="adData.length" :adData="adData" @jump="jump"></adItem>
		</view>
	</view>
</template>
<script>
	const db = uniCloud.database();
	import adItem from "./item.vue"
	export default {
		components: {
			adItem
		},
		data() {
			return {
				safeAreaInsets: 0,
				adData: [],
				list: [{
					name: '美食'
				}, {
					name: '出行'
				}, {
					name: '酒店民宿'
				}],
				current: 0
			}
		},
		onLoad() {
			this.getAdList()
			const {
				safeAreaInsets
			} = uni.getSystemInfoSync();
			this.safeAreaInsets = safeAreaInsets.bottom;
		},
		methods: {
			tabChange(e) {
				this.current = e
				this.getAdList()
			},
			getAdList() {
				uni.showLoading({
					title: "加载中..."
				})
				db.collection('advertisement-list').where({
					type: this.list[this.current].name
				}).get().then(res => {
					this.adData = res.result.data
					uni.hideLoading()
				})
			},
			jump(i) {
				const navigateToMiniProgram = (appId, path, envVersion = 'release') => {
					uni.navigateToMiniProgram({
						appId,
						path,
						envVersion,
						success(res) {},
						fail(err) {}
					});
				};
				navigateToMiniProgram(this.adData[i].appId, this.adData[i].pagePath);
			}
		}
	}
</script>
<style lang="scss">
	page {
		background-color: $background-color;
	}

	.coupon-v {
		.coupon-content {
			padding: 0 20rpx;


		}

	}
</style>