<template>
	<view class="">
		<u-input v-model="innerValue" type="select" @click="open" />
		<u-select v-model="show" :list="options" @confirm="confirm" labelName="fullName" valueName="id"></u-select>
	</view>
</template>

<script>
	export default {
		props: {
			value: {
				type: [Array, String, Number],
				default () {
					return '0';
				}
			},
			modelValue: {
				type: [Array, String, Number],
				default () {
					return '0';
				}
			},
			options: {
				type: Array,
				default: () => []
			},
			props: {
				type: Object,
				default: () => ({
					label: 'fullName',
					value: 'id'
				})
			}
		},
		data() {
			return {
				show: false,
				innerValue: ''
			}
		},
		watch: {
			// 在select弹起的时候，重新初始化所有数据
			modelValue: {
				immediate: true,
				handler(val) {
					this.setDefault()
				}
			}
		},
		methods: {
			open() {
				this.show = true
			},
			setDefault() {
				this.innerValue = this.options[this.modelValue].fullName
				this.$emit('change', this.options[this.modelValue])
			},
			confirm(e) {
				this.innerValue = e[0].label
				this.$emit('change', this.options[e[0].index])
				this.$emit('update:modelValue', e[0].value)
			}
		}
	}
</script>

<style>
</style>