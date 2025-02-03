<template>
	<view class="bar-v">
		<view class="statusBar" :style="{'height':statusBarHeight+'px'}"></view>
		<view class="u-m-t-10 title"
			:style="{height:wxTop+'px',lineHeight:wxTop+'px',paddingLeft:paddingL+'rpx',fontSize:fontS+'rpx'}">
			{{title}}
		</view>
	</view>

</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: ''
			},
			paddingL: {
				type: [String, Number],
				default: ''
			},
			fontS: {
				type: [String, Number],
				default: 40
			},
		},
		data() {
			return {
				statusBarHeight: 0,
				menuButton: 0,
				wxTop: 0
			}
		},
		mounted() {
			this.menuButton = uni.getMenuButtonBoundingClientRect();
			this.wxTop = this.menuButton.height
			uni.getSystemInfo().then(res => {
				this.statusBarHeight = res.statusBarHeight
			})
		},
	}
</script>

<style lang="scss">
	page {
		background-color: #ececf1;
	}

	.bar-v {
		.statusBar {
			width: 100%;
		}

		.title {
			font-weight: bold;
			letter-spacing: 4rpx;
			font-family: fantasy;
		}
	}
</style>