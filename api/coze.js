import request from '@/utils/requestCoze'
// 测试coze
export function getCoze(data, Authorization) {
	return request({
		url: `https://api.coze.cn/v1/workflow/run`,
		method: 'POST',
		data,
		header: {
			Authorization: Authorization
		}
	})
}