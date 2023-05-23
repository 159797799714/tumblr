<template>
	<view class="video">
		<view class="empty position-center align-center justify-center"
			v-if="videoList.length === 0 && status !== 'loading'">
			<view> </view>
		</view>
		<swiper vertical acceleration :current="videoIndex" :style="{ width: width + 'px', height: height + 'px' }"
			@change="changeCurrent" @animationfinish="animationFinish">
			<swiper-item v-for="(item, index) in videoList" :key="index">
				<!-- 视频预渲染 +1 -->
				<block v-if="Math.abs(videoIndex - index) <= 1">
					<!-- <block v-if="videoIndex === index"> -->
					<view @click="handleClicked">
						<!-- 播放界面 -->
						<wanl-find-video :ref="'wanlVideo'+item.id" :width="width" :height="height"
							:src="static_url + item.video" :play="item.play" :videoId="item.id"
							:coverUrl="static_url + item.gif" objectFit="cover" :initialTime="0" @pause="pauseVideo" />
						<!-- 组件 -->
						<view class="position-bottom-center" :style="{ bottom: `${safeBottom}px`,width:width+'px' }">
							<view class="
								  flex-row
								  padding-lr-bj padding-bottom-sm
								  align-end
								" :style="{width:width+'px','flex-direction':'row'}" @click="handleClicked">
								<view class="flex-sub padding-right-bj ">
									<view class="left-title" @click.stop="handleUser(item.user_id)">
										<text
											class="text-white margin-bottom-s text-lg">@{{ item.user_info.nickname }}</text>
									</view>
									<view class="left-describe flex-direction">
										<text class="text-lines-3 flex-sub text-df text-white-8">{{ item.title}}</text>
									</view>
								</view>
								<view class="main-right align-center">
									<view class="
										  main-right-user
										  position-relative
										  margin-bottom-xs
										  align-center
										">
										<view class="
											main-right-image
											justify-center
											bg-white
											round
											align-center
										  " @click.stop="handleUser(item.user_id)">
											<image class="main-right-img round"
												:src="static_photo + item.user_info.face" />
										</view>
										<view v-if="item.is_follow == 0" class="
											main-right-user-follow
											bg-red
											round
											position-absolute
											justify-center
											align-center
										  " @click.stop="handleFollow(item)">
											<text class="text-min icon">&#xe644;</text>
										</view>
										<view v-if="item.is_follow == 1" class="
											main-right-user-follow
											bg-red
											round
											position-absolute
											justify-center
											align-center
										  " @click.stop="handleFollow(item)">
											<text class="text-min icon">&#xe66c;</text>
										</view>
									</view>
									<view class="margin-top align-center" @click.stop="handleLike(item)">
										<text :class="{ 'text-red': item.is_fabulous == 1 }"
											class="icon text-xxxxl">&#xe635;</text>
										<text class="text-white text-min">{{ item.fabulous }}</text>
									</view>
									<view class="margin-top align-center" @click.stop="handleComment(item)">
										<text class="icon text-xxxxl">&#xe68c;</text>
										<text class="text-white text-min">{{ item.comment }}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</block>
			</swiper-item>
		</swiper>
		<!-- 弹出层 -->
		<uni-popup ref="wanlCommentPopup" type="bottom">
			<view class="comment padding-bj">
				<view class="flex-direction justify-between align-center margin-bottom-bj">
					<text></text>
					<text class="text-white text-30">全部评论（{{ commentData.count }}）</text>
					<text class="icon text-30" @tap="handleCommentClose">&#xe66b;</text>
				</view>
				<wanl-comment v-if="commentData.find_id" :findId="commentData.find_id" :commentList="commentData.list"
					:commenCount="commentData.count" @complete="handleComplete" />
				<view :style="{ height: `${bottom}px` }" />
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import wanlFindVideo from "./video.vue";
	import wanlComment from "./comment.vue";
	import _data from "@/common/_data";
	import _mixins from '@/common/_mixins';
	let timer = null;
	export default {
		components: {
			wanlFindVideo,
			wanlComment,
		},
		props: {
			find_id: {
				type: String,
				default: "",
			},
			height: {
				type: Number,
				default: 0,
			},
			width: {
				type: Number,
				default: 0,
			},
			bottom: {
				type: Number,
				default: 0,
			},
			safeBottom: {
				type: Number,
				default: 40,
			},
		},
		data() {
			return {
				preload: 2, //当前页剩余个数换页
				videoList: [],
				current_page: 1, //当前页码
				last_page: 1, //总页码
				status: "loading",
				videoIndex: 0,
				oldVideoIndex: 0,
				commentData: {},
				providerList: [],
				static_url: "",
				static_photo: _data.staticPhoto(),
			};
		},
		mounted() {
			this.static_url = getApp().globalData.static_url;
			console.log("this.static_url", this.static_url);
			this.loadData();
		},
		methods: {
			async loadData(type) {
				this.status = "loading";
				if (type === "update") {
					if (this.current_page >= this.last_page) {
						this.status = "noMore";
						return false;
					} else {
						this.current_page += 1;
					}
				}
				if (this.find_id) {
					console.log("this.find_id", this.find_id);
					_mixins.methods.$httpSend({
						path: "/im/video.Share/video_list",
						data: {
							type: "2",
							id: this.find_id,
						},
						success: (data) => {
							this.last_page = data.last_page;
							if (this.current_page <= data.last_page) {
								this.current_page++;
								this.videoList = this.videoList.concat(data.data);
								this.videoList.map((item) => {
									item.play = false;
								});
								this.$nextTick(() => {
									this.videoPlay(this.videoIndex)
								})
							}
							console.log("this.videoList", this.videoList);
						},
						fail: (err) => {
							console.log("err", err);
						}
					});
				} else {
					_mixins.methods.$httpSend({
						path: "/im/video.Share/video_list",
						data: {
							type: "1",
							page: this.current_page
						},
						success: (data) => {
							console.log("视频列表", data);
							this.last_page = data.last_page;
							if (this.current_page <= data.last_page) {
								this.current_page++;
								this.videoList = this.videoList.concat(data.data);
								this.videoList.map((item) => {
									item.play = false;
								});
								this.$nextTick(() => {
									this.videoPlay(this.videoIndex)
								})
							}
							console.log("this.videoList", this.videoList);
						},
						fail: (err) => {
							console.log("err", err);
						}
					});

				}

			},
			async handleFollow(item) {
				_mixins.methods.$httpSend({
					path: "/im/video.Share/follow",
					data: {
						user_id: item.user_id,
					},
					success(data) {
						console.log("data", data);
						if (data.code == 0) {
							item.is_follow = !item.is_follow;
						} else {
							uni.showToast({
								icon: "none",
								title: data.msg,
							});
						}
					},
				});
			},
			async handleLike(item) {
				_mixins.methods.$httpSend({
					path: "/im/video.Share/fabulous",
					data: {
						id: item.id,
					},
					success: (data) => {
						if (data.code == 0) {
							item.is_fabulous = !item.is_fabulous;
							if (item.is_fabulous) {
								item.fabulous++;
							} else {
								item.fabulous--;
							}
						} else {
							uni.showToast({
								icon: "none",
								title: data.msg,
							});
						}
					},
				});
			},
			async handleComment(item) {
				_mixins.methods.$httpSend({
					path: "/im/video.Share/getComment",
					data: {
						id: item.id,
						type: "1",
					},
					success: (res) => {
						console.log("res", res);
						this.commentData.list = res.data;
						this.commentData.find_id = item.id;
						this.commentData.count = item.comment;
						console.log("this.commentData", this.commentData);
						this.$forceUpdate();
						setTimeout(() => {
							this.$refs.wanlCommentPopup.open();
						}, 100)
					},
				});
			},
			handleComplete(e) {
				if (e.type === "add") {
					this.commentData.count++;
					this.videoList.map(item => {
						if (item.id == e.id) {
							item.comment++;
						}
					})
					this.$forceUpdate();
					// this.handleComment(e);
				}
			},
			handleUser(user_no) {
				uni.navigateTo({
					url: `/pages/video/user?id=${user_no}`,
				});
			},
			handleCommentClose() {
				this.$refs.wanlCommentPopup.close();
			},
			// 点击视频事件
			handleClicked() {
				console.log("点击视频事件")
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
					this.videoList.map(item => {
						item.play = false;
					})
					this.videoList[this.videoIndex].play = !this.videoList[this.videoIndex].play;
					this.$forceUpdate();
				}, 300);
			},
			// 播放当前视频
			videoPlay(index) {
				this.videoList[index].play = !this.videoList[index].play;
			},
			handleVideoPlay() {
				if (this.videoList.length > 0)
					this.$nextTick(() => {
						this.videoList[this.videoIndex].play = true;
					});
			},
			handleVideoPause() {
				this.videoList.map(item => {
					item.play = false;
				})
				this.$forceUpdate();
				console.log("视频停止")
			},
			// 时间打标
			pauseVideo(val) {
				console.log("时间打标", val);
				// 1.0.9临时
				// if (typeof this.videoList[this.oldVideoIndex].initialTime != 'undefined') {
				// 	this.videoList[this.oldVideoIndex].initialTime = val
				// }
			},
			animationFinish(e) {
				//#ifdef APP-PLUS
				this.changeCurrent(e);
				//#endif
			},
			changeCurrent(e) {
				this.videoIndex = e.detail.current;
				console.log("this.videoIndex", this.videoIndex);
				this.$nextTick(() => {
					this.videoList.map(item => {
						item.play = false;
					})
					this.videoList[this.videoIndex].play = true;
					this.$forceUpdate();
				});
			},
		},
		watch: {
			// 加载新的视频
			videoIndex(newVal, oldVal) {
				if (this.videoList.length - this.videoIndex - 1 <= this.preload) {
					this.loadData("update");
				}
				this.oldVideoIndex = oldVal;
			},
		},
	};
</script>

<style scoped>
	@import "@/static/css/common.css";

	.main-right {
		margin-bottom: 100px;
	}

	.bg-red {
		background: red;
	}

	.flex-row {
		display: flex;
		flex-direction: row;
	}

	.flex-sub {
		flex: 1;
		flex-shrink: 0;
	}

	.share {
		border-top-left-radius: 26rpx;
		border-top-right-radius: 26rpx;
	}

	.share-scroll-view {
		/* #ifndef APP-PLUS */
		white-space: nowrap;
		/* #endif */
	}

	.share-scroll-view-item {
		/* #ifndef APP-PLUS */
		display: inline-flex;
		/* #endif */
		margin-right: 36rpx;
	}

	.share-scroll-view-item-button {
		background-color: rgba(0, 0, 0, 0);
		border: 0;
		padding: 0;
		flex-direction: column;
	}

	.share-scroll-view-item-button-icon {
		width: 100rpx;
		height: 100rpx;
		border-radius: 5000rpx;
	}

	/* #ifndef APP-PLUS */
	button:after {
		border: 0;
	}

	/* #endif */

	.video {
		background-color: #000000;
	}

	.left-describe {
		/* #ifndef APP-PLUS */
		display: inline;
		/* #endif */
	}

	.main-right {
		width: 98rpx;
	}

	.main-right-user {
		height: 116rpx;
		width: 98rpx;
	}

	.main-right-user-follow {
		width: 40rpx;
		height: 40rpx;
		bottom: 0;
		z-index: 999;
	}

	.main-right-image {
		width: 98rpx;
		height: 98rpx;
	}

	.main-right-img {
		width: 90rpx;
		height: 90rpx;
	}

	.goods {
		/* #ifndef APP-PLUS */
		white-space: nowrap;
		/* #endif */
		height: 174rpx;
	}

	.goods-item {
		/* #ifndef APP-PLUS */
		display: inline-block;
		/* #endif */
		background-color: rgba(255, 255, 255, 0.9);
		border-radius: 18rpx;
		margin-left: 14rpx;
		padding: 14rpx;
		height: 154rpx;
	}

	.goods-item-img {
		height: 126rpx;
		width: 126rpx;
		margin-right: 14rpx;
		border-radius: 4rpx;
	}

	.comment {
		background-color: rgba(10, 10, 10, 0.9);
		border-top: 2rpx solid rgba(255, 255, 255, 0.1);
		border-top-left-radius: 26rpx;
		border-top-right-radius: 26rpx;
	}
</style>
