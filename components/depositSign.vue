<template>
	<view class="deposit-box">
		<view class="row" :style="{width:row.width}" v-for="(row,r) in list" :key="r">
			<view class="left">
				<uni-icons type="heart-filled" size="14" class="icons" color="#dde3e9" v-for="(item,index) in row.left"
					:key="index" @click="clickIcon(row,row.left,index)"></uni-icons>
			</view>
			<view class="right">
				<uni-icons @click="clickIcon(row,row.left,index)" type="heart-filled" size="14" class="icons"
					color="#dde3e9" v-for="(item,index) in row.right" :key="index"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		reactive
	} from 'vue';
	const list = [{
			row: 1,
			width: '266px',
			left: [1, 2, 3, 4, 5, 6],
			right: [7, 8, 9, 10, 11, 12]
		},
		{
			row: 2,
			width: '294px',
			left: [1, 2, 3, 4, 5, 6, 7, 8],
			right: [9, 10, 11, 12, 13, 14, 15, 16]
		},
		{
			row: 3,
			width: '322px',
			left: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			right: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
		},
		{
			row: 4,
			width: '350px',
			left: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
			right: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
		},
		{
			row: 5,
			width: '350px',
			left: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
			right: []
		},
		{
			row: 6,
			width: '350px',
			left: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
			right: []
		},
		{
			row: 7,
			width: '350px',
			left: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
			right: []
		},
		{
			row: 8,
			width: '350px',
			left: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
			right: []
		},
		{
			row: 9,
			width: '350px',
			left: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
			right: []
		},
		{
			row: 10,
			width: '350px',
			left: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
			right: []
		},
		{
			row: 11,
			width: '322px',
			left: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
			right: []
		},
		{
			row: 12,
			width: '294px',
			left: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
			right: []
		},
		{
			row: 13,
			width: '266px',
			left: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
			right: []
		},
		{
			row: 14,
			width: '238px',
			left: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
			right: []
		},
		{
			row: 15,
			width: '210px',
			left: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
			right: []
		},
		{
			row: 16,
			width: '182px',
			left: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
			right: []
		},
		{
			row: 17,
			width: '154px',
			left: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
			right: []
		},
		{
			row: 18,
			width: '126px',
			left: [1, 2, 3, 4, 5, 6, 7, 8, 9],
			right: []
		},
		{
			row: 19,
			width: '98px',
			left: [1, 2, 3, 4, 5, 6, 7],
			right: []
		},
		{
			row: 20,
			width: '70px',
			left: [1, 2, 3, 4, 5],
			right: []
		},
		{
			row: 21,
			width: '42px',
			left: [1, 2, 3],
			right: []
		},
		{
			row: 22,
			width: '14px',
			left: [1],
			right: []
		}
	]
	const clickIcon = (row, colList, colIndex) => {

	}
</script>

<style lang="scss" scoped>
	.deposit-box {
		background-color: #fff;
		width: 100%;
		margin-top: 20rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20rpx 0;
		border-radius: 20rpx;

		.row {
			height: 16px;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.left {
				.icons {}
			}

			.right {}
		}
	}
</style>