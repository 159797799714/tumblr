<template>
	<view class="flex justify-center align-center" :style="{ width: `${width}px` }">
		<video :id="`video${videoId}`" ref="`video${videoId}`" class="flex justify-center align-center"
			:style="{ height: `${height}px`, width: `${width}px` }" loop :src="src" :controls="false"
			:show-play-btn="false" :enable-progress-gesture="false" :object-fit="videoFit" @timeupdate="timeupdate"
			@error="playError" />
		<view class="position-absolute" v-if="!play && !OpenCover" @click="videoPlay">
			<text class="icon">&#xe60f;</text>
		</view>
		<!-- 封面图片 -->
		<view class="position-absolute" v-if="OpenCover" @click="continuePlay">
			<image :style="{ height: `${height}px`,width:`${width}px` }" :src="coverUrl" mode="aspectFill" />
			<!-- #ifndef H5 -->
			<view class="position-center align-center justify-center">
				<text class="icon icon-spin">&#xe607;</text>
			</view>
			<!-- #endif -->
		</view>
		<!-- 上阴影 -->
		<view class="video-top" />
		<!-- 下阴影 -->
		<view class="video-bottom" />
	</view>
</template>

<script>
	export default {
		props: {
			videoId: {
				type: Number,
				default: 0,
			},
			src: {
				type: String,
				default: "",
			},
			play: {
				type: Boolean,
				default: false,
			},
			height: {
				type: Number,
				default: 0,
			},
			width: {
				type: Number,
				default: 0,
			},

			objectFit: {
				type: String,
				default: "cover",
			},
			coverUrl: {
				//视频封面的图片
				type: String,
				default: "",
			},
			initialTime: {
				type: Number,
				default: 0,
			},
			gDuration: {
				type: Number,
				default: 999,
			},
		},
		data() {
			return {
				videoFit: "contain", // 优化HBuilder展示bug
				time: 0, // 时间类
				duration: 0, // 视频时长
				OpenCover: true, // 是否开启封面
				initialize: false, // 初始化
				videoTimer: null, // 计时器
			};
		},
		mounted() {
			this.videoFit = this.objectFit;
			// #ifdef APP-PLUS
			let sys = uni.getSystemInfoSync();
			if (sys.platform === "ios") {
				if (this.objectFit === "cover") {
					this.videoFit = "fill";
				}
			}
			// #endif
			let video = `video${this.videoId}`;
			console.log("this.videoId", this.videoId);
			this.videoContext = uni.createVideoContext(video, this);
			setTimeout(() => {
				this.videoContext.play();
			}, 10);
		},
		methods: {
			playError(err) {
				console.log("播放出错", err)
			},
			continuePlay() {
				console.log("继续播放")
				if (!this.initialize) {
					setTimeout(() => {
						this.initialize = true;
						this.videoPlay();
					}, 100);
				}
			},
			// 拖动滑块 1.0.9临时
			// changeCurrent(e) {
			// 	this.time = e.detail.value;
			// 	this.videoContext.seek(this.time);
			// },
			timeupdate(event) {
				// 1.0.9临时
				this.duration = event.detail.duration;
				if (this.time >= event.detail.duration) this.time = 0;
				this.time = event.detail.currentTime;
			},
			videoPlay() {
				console.log("视频播放事件", this.videoTimer);
				console.log("视频播放事件play", this.play);
				if (this.videoTimer) {
					clearTimeout(this.videoTimer);
					this.videoTimer = null;
				}
				this.videoTimer = setTimeout(() => {
					if (this.play) {
						console.log("视频播放触发");
						this.videoContext.play();
						this.OpenCover = false;
					} else {
						this.videoContext.pause();
						this.OpenCover = true;
						// 1.0.9临时
						// this.$emit('pause', this.time);
					}
				});
				// if (this.play) {
				// 	this.videoContext.play();
				// 	this.OpenCover = false;
				// } else {
				// 	this.videoContext.pause();
				// 	this.$emit('pause', this.time);
				// }
			},
		},
		watch: {
			//防抖 防止视频播放暂停太快
			play: function(newVal, oldVal) {
				console.log("newval_play", newVal);
				this.videoPlay();
			},
			// 1.0.9临时
			// startTime: {
			// 	immediate: true,
			// 	handler(newVal, oldVal) {
			// 		this.time = newVal;
			// 	}
			// },
			gDuration: {
				immediate: true,
				handler(newVal, oldVal) {
					this.duration = newVal;
				},
			},
		},
		computed: {
			barWidth() {
				let width = (this.time / this.duration) * parseInt(this.width);
				return `${width}px`;
			},
			// 1.0.9临时
			// startTime() {
			// 	return this.initialTime;
			// }
		},
	};
</script>
<style lang="scss" scoped>
	@import "@/static/css/common.css";

	.position-absolute {
		background: #000;
	}
	
	.icon {
		opacity: 0.6;
		font-size: 120rpx;
		color: #fff;
	}

	.icon-spin {
		//#ifndef APP-PLUS-NVUE
		animation: spin 1.5s infinite linear;
		//#endif
	}

	.video-top {
		position: absolute;
		top: 0;
		background-image: linear-gradient(to top,
				rgba(0, 0, 0, 0),
				rgba(0, 0, 0, 0.4));
		width: 750rpx;
		height: 300rpx;
	}

	.video-bottom {
		position: absolute;
		bottom: 0;
		background-image: linear-gradient(to top,
				rgba(0, 0, 0, 0.4),
				rgba(0, 0, 0, 0));
		width: 750rpx;
		height: 300rpx;
	}

	.slider-view {
		position: absolute;
		left: 0;
		bottom: 30px;
		width: 750rpx;
	}

	.progressBar {
		border-radius: 2rpx;
		height: 4rpx;
		background-color: rgba(255, 255, 255, 0.3);
		z-index: 999999;
		position: absolute;
		left: 0;
		bottom: 0;
		//#ifndef APP-PLUS-NVUE
		animation: flicker 4s linear infinite;
		animation-direction: alternate;
		//#endif
	}

	/* #ifndef APP-PLUS-NVUE */
	@keyframes flicker {
		0% {
			box-shadow: 0 0 0 #ffffff;
		}

		/** 暂停效果 */
		10% {
			box-shadow: 0 0 2upx #ffffff;
		}

		50% {
			box-shadow: 0 0 10upx #ffffff;
		}

		60% {
			box-shadow: 0 0 12upx #ffffff;
		}

		90% {
			box-shadow: 0 0 18upx #ffffff;
		}

		100% {
			box-shadow: 0 0 20upx #ffffff;
		}
	}

	@keyframes spin {
		0% {
			-webkit-transform: rotate(0);
			transform: rotate(0);
		}

		100% {
			-webkit-transform: rotate(359deg);
			transform: rotate(359deg);
		}
	}

	/* #endif */
</style>
