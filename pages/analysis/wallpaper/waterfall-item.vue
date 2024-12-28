<template>
	<view class="container">
		<view class="cont-box" :style="{ '--layout-width': 100 / flowData.column - flowData.columnSpace + '%' }"
			v-for="(numVal, index) in flowData.column" :key="numVal">
			<view class="item-box" v-for="(item, j) in flowData[`column_${index + 1}`]" :key="j"
				@click="previewImage(index,j)">
				<image class="img-tip" :src="item" mode="widthFix" />
				<view class="img-tip-btn">放大</view>
			</view>
		</view>
		<kxCustomer></kxCustomer>
	</view>
</template>
<script>
	export default {
		props: {
			flowData: Object
		},
		data() {
			return {};
		},
		methods: {
			previewImage(i, j) {
				// 预览图片
				uni.previewImage({
					urls: this.flowData[`column_${i + 1}`],
					current: j,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {},
						fail: function(err) {}
					}
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
					box-shadow: 0px 0px 14rpx 0rpx rgba(140, 202, 203, 0.3);

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