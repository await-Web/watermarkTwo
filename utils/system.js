const SYSTEM_INFO = uni.getSystemInfoSync();
const system = {
	getStatusBarHeight() {
		return SYSTEM_INFO.statusBarHeight || 15
	},
	getTitleBarHeight() {
		if (uni.getMenuButtonBoundingClientRect) {
			let {
				top,
				height
			} = uni.getMenuButtonBoundingClientRect();
			return height + (top - this.getStatusBarHeight()) * 2
		} else {
			return 40;
		}
	},
	getNavBarHeight() {
		return this.getStatusBarHeight() + this.getTitleBarHeight()
	},
	getLeftIconLeft() {
		// #ifdef MP-TOUTIAO
		let {
			leftIcon: {
				left,
				width
			}
		} = tt.getCustomButtonBoundingClientRect();
		return left + parseInt(width);
		// #endif

		// #ifndef MP-TOUTIAO
		return 0
		// #endif
	}
}
export default system