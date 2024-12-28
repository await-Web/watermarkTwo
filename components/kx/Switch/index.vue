<template>
	<view class="jnpf-switch">
		<view class="u-flex switch-box">
			<text class="u-m-r-4 title" :style="{'color':labelColor}">{{label}}</text>
			<u-switch v-model="innerValue" :active-value="activeValue" :inactive-value="inactiveValue"
				:disabled="disabled" @change="onChange" :size="size"></u-switch>
		</view>
	</view>

</template>
<script>
	export default {
		name: 'jnpf-switch',
		props: {
			modelValue: {
				type: [String, Number, Boolean],
			},
			activeValue: {
				type: [String, Number, Boolean],
				default: 1
			},
			inactiveValue: {
				type: [String, Number, Boolean],
				default: 0
			},
			size: {
				default: 40
			},
			disabled: {
				type: Boolean,
				default: false
			},
			label: {
				type: String,
				default: '批量解析'
			},
			labelColor: {
				type: String,
				default: '#333'
			}
		},
		data() {
			return {
				innerValue: ''
			}
		},
		watch: {
			modelValue: {
				handler(val) {
					this.innerValue = !!Number(val)
				},
				immediate: true,
			}
		},
		methods: {
			onChange(val) {
				this.$emit('update:modelValue', val)
				this.$emit('change', val)
			},
		}
	}
</script>
<style scoped lang="scss">
	.jnpf-switch {
		width: 100%;
		display: flex;
		padding-bottom: 8rpx;
		align-items: center;

		.switch-box {
			.title {
				color: #909399;
				font-size: 24rpx;
			}
		}
	}
</style>