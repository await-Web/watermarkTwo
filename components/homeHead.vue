<template>
	<view class="head" style="padding: 0 40rpx;">
		<view class="statusBar" :style="{height:system.getStatusBarHeight()+'px'}"></view>
		<view class="titleBar" :style="{height:system.getTitleBarHeight()+'px'}">坚持存钱，告别月光</view>
		<view class="content">
			<view class="time">
				<view class="left">
					<uni-dateformat :date="Date.now()" format="dd"></uni-dateformat>
				</view>
				<view class="right">
					<view class="year">
						<uni-dateformat :date="Date.now()" format="yyyy年MM月"></uni-dateformat>
					</view>
					<view class="week">{{week}}</view>
				</view>
			</view>
			<view class="pic">
				<image src="@/static/image/headPic.png" mode="heightFix"></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				week: this.tools.getCurrentDayOfWeek()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.head {
		width: 100%;
		height: 320rpx;
		margin-bottom: 20rpx;
		background:
			radial-gradient(60% 200px at left top, #627dff, transparent),
			radial-gradient(40% 200px at left top, #d7ddff, transparent),
			radial-gradient(60% 200px at right top, #94aaff, transparent);

		.titleBar {
			color: #fffc80;
			font-size: 34rpx;
			font-weight: bold;
			font-family: cursive;
			letter-spacing: 8rpx;
			text-shadow: -8rpx 0px #2d6d6d;
		}

		.content {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 160rpx;

			.time {
				display: flex;
				align-items: center;

				.left {
					font-size: 110rpx;
					font-weight: bolder;
				}

				.right {
					padding-left: 15rpx;

					.year {
						font-size: 30rpx;
					}

					.week {
						font-size: 40rpx;
						font-weight: bolder;
					}
				}
			}

			.pic {
				height: 100%;
				padding-right: 80rpx;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
</style>