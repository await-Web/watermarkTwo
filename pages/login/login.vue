<template>
	<view style="width: 100%;height: 100vh;">
		<image :src="src" style="width: 100%;height: 100%;"></image>
	</view>
</template>

<script>
	import {
		useUserStore
	} from "@/store/user.js"
	const userStore = useUserStore();
	const uniIdCo = uniCloud.importObject('uni-id-co')
	export default {
		data() {
			return {
				src: ''
			}
		},
		onLoad(e) {
			this.login(e)
			setTimeout(() => {
				this.src = "https://mp-7c084917-6399-4468-8aac-cfaca7df5b39.cdn.bspapp.com/loginBG/001.gif"
			}, 1500)
		},
		methods: {
			async login(e) {
				let uniIdRedirectUrl = decodeURIComponent(e.uniIdRedirectUrl);
				let login = await uni.login()
				let res = await uniIdCo.loginByWeixin({
					code: login.code
				})
				userStore.loginSuccess({
					...res,
					showToast: false,
					uniIdRedirectUrl
				});
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>