<template>
	<view class="item-v">
		<view class="activity u-m-t-20" @click="jumWebview(index)" v-for="(item,index) in adData" :key="index">
			<view class="life_item">
				<view class="banner_box">
					<image mode="scaleToFill" :src="item.promotionImg" class="banner"></image>
				</view>
				<!-- <view class="name" v-if="item.goodsDescription">{{item.goodsDescription}}</view> -->
				<view class="u-flex u-p-b-10" style="justify-content: center;">
					<u-button type="primary" size="medium" @click="jumWebview(index)">立即领取</u-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			adData: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {

			}
		},
		methods: {
			jumWebview(i) {
				this.$emit('jump', i)
			}
		}

	}
</script>

<style lang="scss">
	.item-v {
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
					padding: 0 0.6rem;
					font-size: 1rem;
					font-weight: 700;
					word-break: keep-all;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
		}
	}
</style>