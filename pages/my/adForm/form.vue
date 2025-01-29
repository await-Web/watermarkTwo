<template>
	<view class="page_v">
		<uni-section title="添加推广列表" type="line">
			<view class="example">
				<uni-forms ref="form" :modelValue="formData" label-position="top" :rules="rules">
					<uni-forms-item label="昵称" required name="username">
						<uni-easyinput v-model="formData.username" placeholder="请输入姓名" />
					</uni-forms-item>
					<uni-forms-item label="年龄" required>
						<uni-easyinput v-model="formData.age" placeholder="请输入年龄" name="age" />
					</uni-forms-item>
					<uni-forms-item label="性别" required>
						<uni-data-checkbox v-model="formData.gender" :localdata="genderList" name="gender" />
					</uni-forms-item>
				</uni-forms>
			</view>
			<view class="" style="position: fixed;bottom: 0;width: 100%;">
				<button type="primary" @click="submit()" :loading="loading">提交</button>
			</view>
		</uni-section>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				formData: {
					username: '',
					age: "28",
					gender: 0
				}

			}
		},
		onReady() {

		},
		onShow() {

		},
		onLoad() {

		},
		computed: {

		},
		methods: {

		}
	}
</script>

<style lang="scss">
	.page_v {
		display: flex;
		flex-direction: column;
		/* #ifdef MP-WEIXIN */
		height: 100vh;
		/* #endif */
		/* #ifndef MP-WEIXIN */
		height: calc(100vh - 2.85rem);
		/* #endif */
		background-color: $background-color
	}

	.example {
		padding: 15px;
		background-color: #fff;
	}

	.segmented-control {
		margin-bottom: 15px;
	}

	.button-group {
		margin-top: 15px;
		display: flex;
		justify-content: space-around;
	}

	.form-item {
		display: flex;
		align-items: center;
	}

	.button {
		display: flex;
		align-items: center;
		height: 35px;
		margin-left: 10px;
	}
</style>