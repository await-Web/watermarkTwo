<template>
	<view class="">

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