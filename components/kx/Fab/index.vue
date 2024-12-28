<template>
	<uni-fab ref="fab" :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical"
		:direction="direction" @trigger="trigger" @fabClick="fabClick" />
</template>

<script>
	export default {
		props: {
			pattern: {
				type: Object,
				default: () => ({
					'color': '#7A7E83',
					'backgroundColor': '#fff',
					'selectedColor': '#007AFF',
					'buttonColor': '#007AFF',
					'iconColor': '#fff'
				})
			},
			content: {
				type: Array,
				default: () => [{
						iconPath: '/static/image.png',
						selectedIconPath: '/static/image-active.png',
						text: '相册',
						active: false
					},
					{
						iconPath: '/static/home.png',
						selectedIconPath: '/static/home-active.png',
						text: '首页',
						active: false
					},
					{
						iconPath: '/static/star.png',
						selectedIconPath: '/static/star-active.png',
						text: '收藏',
						active: false
					}
				]
			},
			directionStr: {
				type: String,
				default: '垂直'
			},
			horizontal: {
				type: String,
				default: 'right'
			},
			vertical: {
				type: String,
				default: 'bottom'
			},
			direction: {
				type: String,
				default: 'horizontal'
			}
		},
		data() {
			return {

			}
		},
		onBackPress() {
			if (this.$refs.fab.isShow) {
				this.$refs.fab.close()
				return true
			}
			return false
		},
		methods: {
			trigger() {
				console.log(655);
			},
			fabClick() {

			}
		}
	}
</script>

<style>
</style>