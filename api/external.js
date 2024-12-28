import request from '@/utils/request'
//获取接口调用凭据
export function getVoucher(data) {
	return request({
		url: `https://watermark-api.hlyphp.top/Token/Index`,
		data
	})
}

// 短视频解析
export function watermark(data) {
	return request({
		url: `https://watermark-api.hlyphp.top/Watermark/Index`,
		method: 'POST',
		data
	})
}

// 主页批量解析
export function authorWorkWatermark(data) {
	return request({
		url: `https://watermark-api.hlyphp.top/AuthorWork/Index`,
		method: 'POST',
		data
	})
}














// 获取关联表单弹窗列表
export function getRelationSelect(id, data, options) {
	return request({
		url: `/api/visualdev/Base/${id}/FieldDataSelect`,
		data,
		options: {
			load: false
		}
	})
}
export function getAppVersion() {
	return request({
		url: `/api/app/Version`
	})
}
// 获取数据字典数据
export function getDictionaryDataAll() {
	return request({
		url: '/api/system/DictionaryData/All',
		options: {
			load: false
		}
	})
}