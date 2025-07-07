<template>
	<view class="game_page" @touchmove.prevent>
		<view class="level-header">
			<picker :range="levels.map((l,i)=>'关卡'+(i+1))" :value="selectedLevel" @change="onLevelChange">
				<view class="level-select">
					<text class="sound" @click.prevent="setMute">{{isMute?'🔕':'🔔'}}</text>
					<text class="level-text">关卡 {{selectedLevel+1}}</text>
					<text class="move-count" @click.stop>步数: {{moveCount}}</text>
				</view>
			</picker>
		</view>
		<view class="car-game-container">
			<view class="bottom-bar">
				<view class="reset-btn" @click="restart">重置</view>
			</view>
			<view class="game-board-horizontal" :style="`width: ${boardW}px; height: ${boardH}px;`">
				<!-- 网格线 -->
				<view v-for="i in gridSizeX-1" :key="'v'+i" class="grid-line-vertical" :style="verticalLineStyle(i)">
				</view>
				<view v-for="j in gridSizeY-1" :key="'h'+j" class="grid-line-horizontal"
					:style="horizontalLineStyle(j)">
				</view>
				<view v-for="(car, idx) in cars" :key="idx" class="car" :class="{
		      'my-car': car.isMyCar,
		      'horizontal': car.dir === 'h',
		      'vertical': car.dir === 'v'
		    }" :style="carStyle(car)" @touchstart="onTouchStart($event, idx)" @touchmove="onTouchMove($event, idx)"
					@touchend="onTouchEnd($event, idx)">
					<text v-if="car.isMyCar" class="car-val">{{ car.value}}</text>
					<text class="car-val" v-if="!car.isMyCar">{{car.value}}</text>
				</view>
				<!-- 出口 -->
				<view class="exit-horizontal" :style="exitStyle">出口</view>
			</view>
			<view v-if="win" class="win-modal">
				<view class="win-content">
					<text>恭喜过关！</text>
					<view class="win-buttons">
						<button @click="nextLevel" class="next-level-btn">下一关</button>
						<button @click="restart" class="restart-btn">再玩一次</button>
					</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				isMute: true,
				exit: 2, // 出口位置
				gridSizeX: 7, // 固定为7
				gridSizeY: 6, // 固定为6
				cars: [],
				startX: 0,
				startY: 0,
				originX: 0,
				originY: 0,
				movingIdx: null,
				win: false,
				boardW: 0,
				boardH: 0,
				selectedLevel: 0,
				moveCount: 0,
				lastMoveTime: 0,
				passedLevels: [], // 已通过的关卡记录
				collisionAudio: null, // 碰撞音频
				winAudio: null, // 通过关卡音频
				levels: [
					// 关卡1（当前关卡）
					[{
							value: '🚑',
							x: 0,
							y: 0,
							len: 3,
							dir: 'h',
							bgc: '#0055ff',
							id: 0
						},
						{
							value: '🚕',
							x: 0,
							y: 1,
							len: 3,
							dir: 'v',
							bgc: '#555500',
							id: 1
						},
						{
							value: '🚌',
							x: 2,
							y: 1,
							len: 2,
							dir: 'v',
							bgc: '#55aa00',
							id: 2
						},
						{
							value: '🚚',
							x: 1,
							y: 3,
							len: 2,
							dir: 'h',
							bgc: '#ff8800',
							id: 3
						},
						{
							value: '🚓',
							x: 3,
							y: 2,
							len: 2,
							dir: 'h',
							isMyCar: true,
							bgc: '#000000',
							id: 4
						},
						{
							value: '🚗',
							x: 5,
							y: 2,
							len: 2,
							dir: 'v',
							bgc: '#aa55ff',
							id: 5
						},
						{
							value: '🚗',
							x: 5,
							y: 0,
							len: 2,
							dir: 'v',
							bgc: '#ffffff',
							id: 6
						},
						{
							value: '🚙',
							x: 5,
							y: 4,
							len: 2,
							dir: 'h',
							bgc: '#00bbbb',
							id: 7
						},
						{
							value: '🚗',
							x: 4,
							y: 3,
							len: 3,
							dir: 'v',
							bgc: '#aa55ff',
							id: 8
						},
						{
							value: '🚘',
							x: 0,
							y: 5,
							len: 3,
							dir: 'h',
							bgc: '#ff55aa',
							id: 8
						}
					]

				],
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: res => {
					const w = res.windowWidth
					const h = res.windowHeight
					// 保证棋盘不超出屏幕且比例为12:9
					let boardW = w
					let boardH = w * 7 / 6
					if (boardH > h) {
						boardH = h
						boardW = h * 6 / 7
					}
					this.boardW = boardW
					this.boardH = boardH
					this.loadPassedLevels()
					this.initGame()
					this.initAudio()
				}
			})
		},
		onUnload() {
			// 释放音频资源
			if (this.collisionAudio) {
				this.collisionAudio.destroy()
				this.collisionAudio = null
			}
			if (this.winAudio) {
				this.winAudio.destroy()
				this.winAudio = null
			}
		},
		methods: {
			// 加载已通过的关卡记录
			loadPassedLevels() {
				try {
					const passedLevels = uni.getStorageSync('passedLevels')
					if (passedLevels) {
						this.passedLevels = JSON.parse(passedLevels)
					} else {
						this.passedLevels = [] // 默认没有任何关卡通过
					}
				} catch (e) {
					this.passedLevels = [] // 默认没有任何关卡通过
				}
			},

			// 保存已通过的关卡记录
			savePassedLevels() {
				try {
					uni.setStorageSync('passedLevels', JSON.stringify(this.passedLevels))
				} catch (e) {}
			},

			// 检查关卡是否已通过
			isLevelPassed(levelIndex) {
				return this.passedLevels.includes(levelIndex)
			},

			// 检查关卡是否可解锁
			isLevelUnlocked(levelIndex) {
				if (levelIndex === 0) return true // 第一关默认解锁
				// 必须通过前一关才能解锁下一关
				return this.passedLevels.includes(levelIndex - 1)
			},

			// 更新关卡通过状态
			updateLevelPassed(levelIndex) {
				if (!this.passedLevels.includes(levelIndex)) {
					this.passedLevels.push(levelIndex)
					this.savePassedLevels()
				}
			},
			//音效开关
			setMute() {
				this.isMute = !this.isMute
				if (this.isMute) {
					this.collisionAudio.stop()
					this.winAudio.stop()
				}
			},
			onLevelChange(e) {
				const newLevel = Number(e.detail.value)
				// 检查关卡是否已解锁
				if (!this.isLevelUnlocked(newLevel)) {
					uni.showToast({
						title: '请先通过前一关',
						icon: 'none',
						duration: 2000
					})
					return
				}
				this.selectedLevel = newLevel
				this.initGame()
			},
			// 初始化车辆布局
			initGame() {
				this.cars = this.levels[this.selectedLevel].map(car => ({
					...car
				}));
				this.win = false;
				this.moveCount = 0;
			},
			// 初始化音频
			// 初始化音频
			initAudio() {
				const audioConfigs = [{
						name: 'collisionAudio',
						src: '/static/audio/collision.mp3'
					},
					{
						name: 'winAudio',
						src: '/static/audio/110.mp3'
					}
					// 可扩展其他音频
				];

				audioConfigs.forEach(config => {
					try {
						const audio = uni.createInnerAudioContext();
						// 统一错误处理
						audio.onError(res => {
							this[config.name] = null;
						});
						// 配置音频属性
						audio.src = config.src;
						audio.loop = false;
						audio.volume = 0.5;
						audio.obeyMuteSwitch = false;
						audio.autoplay = false;
						audio.onCanplay(() => {
							audio.offCanplay();
						});
						this[config.name] = audio;
					} catch (e) {
						this[config.name] = {
							play: () => {},
							stop: () => {}
						};
					}
				});
			},

			// 播放碰撞音频
			playCollisionSound() {
				if (this.collisionAudio) {
					try {
						this.collisionAudio.play();
					} catch (e) {}
				}
			},
			// 播放通关音频
			playWinSound() {
				if (this.winAudio) {
					try {
						this.winAudio.play();
					} catch (e) {}
				}
			},
			// 车辆样式
			carStyle(car) {
				const gridX = this.boardW / this.gridSizeX;
				const gridY = this.boardH / this.gridSizeY;
				const carSizeX = gridX * 0.9 * (car.dir === 'h' ? car.len : 1);
				const carSizeY = gridY * 0.9 * (car.dir === 'v' ? car.len : 1);
				const totalGridW = gridX * (car.dir === 'h' ? car.len : 1);
				const totalGridH = gridY * (car.dir === 'v' ? car.len : 1);
				const marginX = (totalGridW - carSizeX) / 2;
				const marginY = (totalGridH - carSizeY) / 2;
				return `
		left: ${car.x * gridX + marginX}px;
		top: ${car.y * gridY + marginY}px;
		width: ${carSizeX}px;
		height: ${carSizeY}px;
		background: ${car.bgc};
		z-index: ${car.isMyCar ? 10 : 1};
	`;
			},
			// 触摸开始
			onTouchStart(e, idx) {
				const touch = e.touches[0]
				this.startX = touch.clientX
				this.startY = touch.clientY
				this.originX = this.cars[idx].x
				this.originY = this.cars[idx].y
				this.movingIdx = idx
			},
			// 触摸移动
			onTouchMove(e, idx) {
				if (this.movingIdx !== idx) return
				const now = Date.now()
				if (now - this.lastMoveTime < 16) return // 约60fps
				this.lastMoveTime = now
				const car = this.cars[idx]
				const touch = e.touches[0]
				const boardW = this.boardW
				const boardH = this.boardH
				const gridX = boardW / this.gridSizeX
				const gridY = boardH / this.gridSizeY
				let deltaX = (touch.clientX - this.startX) / gridX
				let deltaY = (touch.clientY - this.startY) / gridY

				if (car.dir === 'h') {
					let origin = this.originX
					let target = Math.max(0, Math.min(this.gridSizeX - car.len, origin + deltaX))
					let step = target > origin ? 1.8 : -1.8 // 水平步长
					let pos = origin
					let lastSafe = origin
					let loopCount = 0
					while (((step > 0 && pos < target) || (step < 0 && pos > target)) && loopCount <
						5) { // 大幅减少循环次数
						let next = pos + step
						if ((step > 0 && next > target) || (step < 0 && next < target)) next = target
						if (this.checkCollision(idx, Math.round(next), car.y)) break
						lastSafe = next
						pos = next
						loopCount++
					}
					this.cars[idx].x = lastSafe
				} else {
					let origin = this.originY
					let target = Math.max(0, Math.min(this.gridSizeY - car.len, origin + deltaY))
					// 根据网格比例调整垂直步长，使回弹力度一致
					let stepRatio = gridX / gridY
					let step = target > origin ? (1.8 * stepRatio) : -(1.8 * stepRatio) // 垂直步长根据比例调整
					let pos = origin
					let lastSafe = origin
					let loopCount = 0
					while (((step > 0 && pos < target) || (step < 0 && pos > target)) && loopCount <
						5) { // 大幅减少循环次数
						let next = pos + step
						if ((step > 0 && next > target) || (step < 0 && next < target)) next = target
						if (this.checkCollision(idx, car.x, Math.round(next))) break
						lastSafe = next
						pos = next
						loopCount++
					}
					this.cars[idx].y = lastSafe
				}
			},
			// 触摸结束
			onTouchEnd() {
				// 吸附到最近格子
				if (this.movingIdx !== null) {
					const car = this.cars[this.movingIdx]
					if (car.dir === 'h') {
						car.x = Math.round(car.x)
					} else {
						car.y = Math.round(car.y)
					}
				}
				this.movingIdx = null
				this.moveCount++;
				this.checkWin()
			},
			// 检查碰撞
			checkCollision(idx, x, y) {
				const car = this.cars[idx]
				for (let i = 0; i < this.cars.length; i++) {
					if (i === idx) continue
					const other = this.cars[i]
					for (let j = 0; j < car.len; j++) {
						const cx = car.dir === 'h' ? x + j : x
						const cy = car.dir === 'v' ? y + j : y
						for (let k = 0; k < other.len; k++) {
							const ox = other.dir === 'h' ? other.x + k : other.x
							const oy = other.dir === 'v' ? other.y + k : other.y
							if (cx === ox && cy === oy) {
								// 播放碰撞音频
								if (!this.isMute) this.playCollisionSound();
								return true
							}
						}
					}
				}
				return false
			},
			// 检查胜利
			checkWin() {
				const myCar = this.cars.find(c => c.isMyCar)
				if (myCar && myCar.x + myCar.len === this.gridSizeX && myCar.y === this.exit) {
					// 播放通关音频
					if (!this.isMute) this.playWinSound();
					// 更新关卡通过状态
					this.updateLevelPassed(this.selectedLevel)
					// 1.5秒后显示通关弹窗并停止音频
					setTimeout(() => {
						this.win = true
					}, 1000)
				}
			},
			// 重新开始
			restart() {
				// 停止通关音频
				if (this.winAudio) this.winAudio.stop();
				this.initGame()
			},
			verticalLineStyle(i) {
				const gridX = this.boardW / this.gridSizeX;
				return `left: ${i * gridX}px; top: 0; width: 2px; height: ${this.boardH}px; position: absolute; background: #e0e0e0; z-index: 0;`;
			},
			horizontalLineStyle(j) {
				const gridY = this.boardH / this.gridSizeY;
				return `top: ${j * gridY}px; left: 0; height: 2px; width: ${this.boardW}px; position: absolute; background: #e0e0e0; z-index: 0;`;
			},
			//下一关
			nextLevel() {
				// 停止通关音频
				if (this.winAudio) this.winAudio.stop();
				if (this.selectedLevel < this.levels.length - 1) {
					this.selectedLevel++;
					this.initGame();
					this.win = false; // 确保胜利状态重置
				} else {
					// 如果是最后一关，显示通关提示
					uni.showToast({
						title: '恭喜通关所有关卡！',
						icon: 'success',
						duration: 2000
					});
					this.restart(); // 重新开始当前关卡
				}
			}
		},
		computed: {
			gameBoardStyle() {
				return `width: ${this.boardW}px; height: ${this.boardH}px;`;
			},
			exitStyle() {
				const gridX = this.boardW / this.gridSizeX;
				const gridY = this.boardH / this.gridSizeY;
				const exitH = gridY;
				const y = this.exit; // 第6行，索引从0开始
				return `
		left: ${this.boardW - gridX * 0.8}px;
		top: ${y * gridY}px;
		width: ${gridX * 0.8}px;
		height: ${exitH}px;
`;
			}
		}
	}
</script>

<style scoped lang="scss">
	.game_page {
		touch-action: none;
		overflow: hidden;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		min-height: 100vh;
		position: relative;

		.level-header {
			width: 100vw;
			text-align: center;
			margin-bottom: 40rpx;
			padding: 40rpx;
			position: relative;
			z-index: 10;

			.level-select {
				display: flex;
				justify-content: center;
				align-items: center;
				background: rgba(255, 255, 255, 0.95);
				border-radius: 40rpx;
				padding: 30rpx 30px;
				box-shadow: 0 16rpx 64rpx rgba(0, 0, 0, 0.1);
				border: 2rpx solid rgba(255, 255, 255, 0.2);
				transition: transform 0.2s ease;

				&:active {
					transform: scale(0.95);
				}

				.sound {
					font-size: 48rpx;
					margin-right: 40rpx;
				}

				.level-text {
					font-size: 56rpx;
					font-weight: bold;
					color: #333;
					margin-right: 30rpx;
				}

				.move-count {
					font-size: 56rpx;
					font-weight: bold;
					color: #ff6f00;
					background: linear-gradient(45deg, #ff6f00, #ff8f00);
					color: white;
					padding: 12rpx 24rpx;
					border-radius: 24rpx;
					box-shadow: 0 4rpx 16rpx rgba(255, 111, 0, 0.3);
				}
			}
		}

		.car-game-container {
			width: 100vw;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			background: transparent;
			touch-action: none;
			position: relative;
			z-index: 5;

			.bottom-bar {
				position: fixed;
				left: 0;
				right: 0;
				bottom: 0;
				height: 120rpx;
				background: transparent;
				display: flex;
				align-items: center;
				justify-content: center;
				z-index: 100;
				padding: 40rpx;

				.reset-btn {
					background: linear-gradient(45deg, #ff6f00, #ff8f00);
					color: #fff;
					border: none;
					border-radius: 40rpx;
					font-size: 30rpx;
					font-weight: bold;
					padding: 30rpx 80rpx;
					box-shadow: 0 12rpx 40rpx rgba(255, 111, 0, 0.4);
					cursor: pointer;
					user-select: none;
					transition: transform 0.2s ease;
					text-transform: uppercase;
					letter-spacing: 2rpx;

					&:active {
						transform: translateY(4rpx);
					}
				}
			}

			.game-board-horizontal {
				background: linear-gradient(145deg, #2c3e50, #34495e);
				border-radius: 40rpx;
				margin: 0;
				box-shadow: 0 40rpx 80rpx rgba(0, 0, 0, 0.3);
				overflow: hidden;
				display: block;
				z-index: 1;
				position: relative;
				touch-action: none;
				border: 4rpx solid rgba(255, 255, 255, 0.1);

				.grid-line-vertical {
					pointer-events: none;
					background: rgba(255, 255, 255, 0.1);
				}

				.grid-line-horizontal {
					pointer-events: none;
					background: rgba(255, 255, 255, 0.1);
				}

				.car {
					position: absolute;
					border-radius: 24rpx;
					color: #fff;
					font-size: 32rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					user-select: none;
					transition: transform 0.1s ease;
					box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.3);
					touch-action: none;
					border: 4rpx solid rgba(255, 255, 255, 0.2);

					&:active {
						transform: scale(0.95);
					}

					.car-val {
						display: inline-block;
						width: 100%;
						// height: 100%;
						text-align: center;
						font-weight: bold;
						text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.5);
						font-size: 72rpx;
					}
				}

				.my-car {
					box-shadow: 0 12rpx 40rpx rgba(255, 111, 0, 0.4);
					border: 4rpx solid rgba(255, 111, 0, 0.6);

					&:active {
						transform: scale(0.95);
					}
				}

				.exit-horizontal {
					position: absolute;
					background: linear-gradient(45deg, #27ae60, #2ecc71);
					color: #fff;
					font-size: 24rpx;
					font-weight: bold;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 0 24rpx 24rpx 0;
					z-index: 1;
					box-shadow: 0 8rpx 24rpx rgba(39, 174, 96, 0.4);
					border: 4rpx solid rgba(255, 255, 255, 0.3);
					text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
				}
			}

			.win-modal {
				position: fixed;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				background: rgba(0, 0, 0, 0.8);
				display: flex;
				align-items: center;
				justify-content: center;
				z-index: 9999;

				.win-content {
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					border-radius: 40rpx;
					padding: 120rpx 80rpx;
					text-align: center;
					font-size: 312rpx;
					color: #fff;
					box-shadow: 0 40rpx 80rpx rgba(0, 0, 0, 0.3);
					border: 4rpx solid rgba(255, 255, 255, 0.2);

					.win-buttons {
						display: flex;
						justify-content: space-around;
						margin-top: 80rpx;
						gap: 30rpx;

						.next-level-btn {
							background: linear-gradient(45deg, #27ae60, #2ecc71);
							color: #fff;
							border: none;
							border-radius: 40rpx;
							font-size: 48rpx;
							font-weight: bold;
							padding: 24rpx 40rpx;
							box-shadow: 0 8rpx 24rpx rgba(39, 174, 96, 0.4);
							transition: transform 0.2s ease;
							letter-spacing: 1rpx;
							min-width: 80px;

							&:active {
								transform: translateY(4rpx);
							}
						}

						.restart-btn {
							background: linear-gradient(45deg, #ff6f00, #ff8f00);
							color: #fff;
							border: none;
							border-radius: 40rpx;
							font-size: 48rpx;
							font-weight: bold;
							padding: 24rpx 40rpx;
							box-shadow: 0 8rpx 24rpx rgba(255, 111, 0, 0.4);
							transition: transform 0.2s ease;
							letter-spacing: 1rpx;
							min-width: 160rpx;

							&:active {
								transform: translateY(4rpx);
							}
						}
					}
				}
			}
		}
	}
</style>