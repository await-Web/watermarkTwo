<script setup>
	import {
		onLaunch,
		onShow,
		onHide
	} from "@dcloudio/uni-app"
	import {
		useUserStore
	} from "@/store/user.js"
	const uniIdCo = uniCloud.importObject('uni-id-co')
	const userStore = useUserStore()
	onLaunch(() => {
		const updateManager = wx.getUpdateManager()
		updateManager.onCheckForUpdate(res => {
			if (res.hasUpdate) {
				updateManager.onUpdateReady(() => {
					wx.showModal({
						title: "更新提示",
						content: "新版本已经准备好，是否重启应用？",
						success: function(res) {
							console.log("onUpdateReady", res)
							if (res.confirm) {
								// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
								updateManager.applyUpdate()
							}
						},
					})
				})
				updateManager.onUpdateFailed(() => {
					// 新的版本下载失败
					wx.showModal({
						title: "已经有新版本了哟~",
						content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~",
					})
				})
			}
		})
		if ((uniCloud.getCurrentUserInfo().tokenExpired - Date.now()) < 1000 * 60 * 60 * 5) userStore.logout();
	})
	onShow(() => {
		console.log('App Show')
	})
	onHide(() => {
		console.log('App Hide')
	})
</script>

<style lang="scss">
	@import "@/uni_modules/vk-uview-ui/index.scss";
	@import "@/assets/scss/common-style.scss";
	@import "@/assets/iconfont/iconfont.css";
</style>