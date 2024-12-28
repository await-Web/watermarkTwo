const tools = {
	getCurrentDayOfWeek() {
		const daysOfWeek = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
		const currentDate = new Date();
		const dayOfWeekIndex = currentDate.getDay();

		return daysOfWeek[dayOfWeekIndex];
	},
	removeHtmlTags(text) {
		return text.replace(/<[^>]*>/g, '');
	},
	//计算天数间隔
	daysFromTimestamp(timestamp) {
		const now = new Date().getTime()
		const diff = now - timestamp;
		const oneDay = 24 * 60 * 60 * 1000
		return Math.floor(diff / oneDay)
	},
	//日期格式化
	formatDate(timestamp, format = "yyyy-MM-dd hh:mm:ss") {
		const date = new Date(timestamp);
		const year = date.getFullYear();
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const day = date.getDate().toString().padStart(2, '0');
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');
		const seconds = date.getSeconds().toString().padStart(2, '0');
		return format.replace('yyyy', year)
			.replace('MM', month)
			.replace('dd', day)
			.replace('hh', hours)
			.replace('mm', minutes)
			.replace('ss', seconds);
	},
	//性别格式化
	formatGender(value) {
		const genderMap = {
			0: "保密",
			1: "男",
			2: "女"
		};
		return genderMap[value] || "保密";
	},

	//超出指定字符显示省略号
	truncateString(str, num) {
		if (str.length > num) {
			return str.substring(0, num) + '...';
		} else {
			return str;
		}
	},
	//获取当前年月日
	getYMD() {
		let myDate = new Date()
		let myYear = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
		let myMonth = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
		let myToday = myDate.getDate(); //获取当前日(1-31)
		myMonth = myMonth > 9 ? myMonth : '0' + myMonth
		myToday = myToday > 9 ? myToday : '0' + myToday
		let nowDate = myYear + '-' + myMonth + '-' +
			myToday
		return nowDate
	},
	//获取当前年月日--可以加减时间
	getDate(date, AddDayCount = 0) {
		if (!date) date = new Date()
		if (typeof date !== 'object') date = date.replace(/-/g, '/')
		const dd = new Date(date)
		dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期
		const y = dd.getFullYear()
		const m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1 // 获取当前月份的日期，不足10补0
		const d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() // 获取当前几号，不足10补0
		return {
			fullDate: y + '-' + m + '-' + d,
			year: y,
			month: m,
			date: d,
			day: dd.getDay()
		}
	},
	//获取当前年月日
	getCurrentDate(type) {
		const date = new Date();
		const year = date.getFullYear();
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const day = date.getDate().toString().padStart(2, '0');
		if (type === 'year') return year.toString()
		if (type === 'month') return month.toString()
		if (type === 'day') return day.toString()
	},
	//获取当前时分
	padZero(num) {
		return num.toString().padStart(2, '0');
	},
	getCurrentTimeFormatted() {
		const now = new Date();
		const hours = now.getHours().toString().padStart(2, '0');
		const minutes = now.getMinutes().toString().padStart(2, '0');
		return `${hours}:${minutes}`;
	},
	//提示弹窗
	toast(title, duration = 1500) {
		uni.showToast({
			title: title,
			icon: 'none',
			duration: duration,
			mask: true
		})
	},
	// 将日期字符串转换为时间戳
	convertToTimestamp(dateString) {
		let dateArrr = [...dateString.split("-")]
		let year = dateArrr[0]
		let month = dateArrr[1]
		let day = dateArrr[2]
		const date = new Date(year, month - 1, day); // 月份是从0开始的，所以需要减1
		return date.getTime(); // 或者可以直接使用 +date
	},
	//判断管理员角色是否
	isAdminRole() {
		return uniCloud.getCurrentUserInfo().role.includes('admin') ? true : false;
	},
	//根据id判断用户
	isCurrentUser(uid) {
		return uniCloud.getCurrentUserInfo().uid.includes(uid)
	},
	// 获取当前年月日时分秒带转时间戳
	getCurrentDateTime(type) {
		const now = new Date();
		const year = now.getFullYear();
		const month = (now.getMonth() + 1).toString().padStart(2, '0');
		const day = now.getDate().toString().padStart(2, '0');
		const hours = now.getHours().toString().padStart(2, '0');
		const minutes = now.getMinutes().toString().padStart(2, '0');
		const seconds = now.getSeconds().toString().padStart(2, '0');
		if (type === 'timestamp') {
			const date = new Date(year, month, day, hours, minutes, seconds); // 月份是从0开始的，所以需要减1
			return date.getTime(); // 或者可以直接使用 +date
		}
		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	},
	//微信插屏广告
	wxAd(adId) {
		let interstitialAd = null
		if (wx.createInterstitialAd) {
			interstitialAd = wx.createInterstitialAd({
				adUnitId: adId
			})
			interstitialAd.show().catch((err) => {})
		}
	}
}
export default tools