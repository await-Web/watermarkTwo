import App from './App'
import * as Pinia from 'pinia'
import tools from '@/utils/tools'
import system from '@/utils/system'
import uView from './uni_modules/vk-uview-ui';
// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
// 添加实例属性
Object.assign(Vue.prototype, {
	tools,
	system
})
Vue.use(uView)
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	app.use(Pinia.createPinia())
	app.provide('tools', tools)
	app.use(uView)
	app.config.globalProperties.tools = tools
	app.config.globalProperties.system = system
	return {
		app,
		Pinia
	}
}
// #endif