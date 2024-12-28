<template>
	<view class="container">
		<view class="cont-box" :style="{ '--layout-width': 100 / flowData.column - flowData.columnSpace + '%' }"
			v-for="(numVal, index) in flowData.column" :key="numVal">
			<view class="item-box" v-for="(item, j) in flowData[`column_${index + 1}`]" :key="j">
				<image class="img-tip" :src="item" mode="widthFix" @click="previewImage(item)" />
				<view class="img-tip-btn" @tap="handleDownloads(item,'img')">点击保存</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		props: {
			flowData: Object
		},
		data() {
			return {

			};
		},
		methods: {

			// 预览图片
			previewImage(url) {
				uni.previewImage({
					urls: [url]
				});
			},
			handleDownloads(item, type) {
				this.$emit('handleDownloads', item, type)
			},
		},
		mounted() {

		},
	};
</script>

<style lang="scss">
	.container {
		display: flex;
		justify-content: space-between;
		padding: 20rpx;
		$borderRadius: 12rpx;

		.cont-box {
			width: var(--layout-width);

			.item-box {
				width: 100%;
				margin-bottom: 16rpx;
				border-radius: $borderRadius;
				position: relative;

				.img-tip {
					width: 100%;
					border-radius: $borderRadius;
					height: 100%;
					// box-shadow: 0rpx 3rpx 6rpx rgba(0, 46, 37, 0.8);
					// box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.1);
					// box-shadow: 0rpx 0rpx 12rpx #dfe3e9;
					box-shadow: 0px 0px 14rpx 0rpx rgba(13, 158, 253, 0.1);

				}

				.img-tip-btn {
					width: 100%;
					height: 68rpx;
					background-color: rgba(97, 175, 239, 0.7);
					position: absolute;
					bottom: 0;
					color: #f0f2f6;
					font-size: 28rpx;
					z-index: 99999;
					text-align: center;
					line-height: 68rpx;
					border-radius: 0 0 $borderRadius $borderRadius;
				}
			}
		}
	}
</style>