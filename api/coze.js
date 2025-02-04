import request from '@/utils/requestCoze'
// 测试coze
export function getCozeTranslate(data) {
	return request({
		url: `https://api.coze.cn/v1/workflow/run`,
		method: 'POST',
		data: {
			...data,
			workflow_id: '7464638180601364520'
		},
		options: {
			loadText: '正在翻译'
		},
		header: {
			Authorization: 'Bearer pat_AGEQtTeloxo3wtXiuO7gkLDAWluy7IMId6x9jrg8ruIr3SnaMhZIQigOiaO3SEqg'
		}
	})
}