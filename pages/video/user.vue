<template>
	<view class="">
		<view class="bg-grey">
			<view class="flex  align-center">
				<view class="flex justify-center align-center avatar margin">
					<image :src="avatar" mode="aspectFit"></image>
				</view>
				<view class="flex-sub flex justify-between">
					<text>{{user_info.nickname}}</text>
				</view>
			</view>
			<view class="padding">
				<text>{{user_info.doodling}}</text>
			</view>
			<view class="flex padding-bottom">
				<view class="margin-left" @click="toFlow">
					<text class="text-lg margin-right-sm">{{follow}}</text>
					<text>关注</text>
				</view>
				<view class="margin-left" @click="toFans">
					<text class="text-lg margin-right-sm">{{fans}}</text>
					<text>粉丝</text>
				</view>
				<view class="margin-left">
					<text class="text-lg margin-right-sm"> {{fabulous}}</text>
					<text>获赞</text>
				</view>
			</view>
		</view>
		<view class="flex justify-center align-center">
			<view class="margin" v-for="(item,index) in tabs" :key='index' @click="changeTab(index)">
				<text :class="active == index?'text-lg text-bold':''">{{item}}</text>
			</view>
		</view>
		<view v-if="active == 0" class="video-list">
			<view class="video-item flex-direction bg-gray flex shadow shadow-blur" v-for="(item,index) in list"
				:key="index" @click="toDetail(item.id)">
				<view class="cover">
					<image :src="static_url + item.gif" mode="aspectFill"></image>
				</view>
				<view class="padding-left">
					<text class="text-cut">{{item.title}}</text>
				</view>
				<view class="padding-left padding-right flex justify-between">
					<text>{{timestampFormat(item.createtime)}}</text>
					<view class="">
						<text class="text-orange"></text>
						<text class="margin-left-sm">{{item.fabulous}}</text>
					</view>
				</view>
			</view>
		</view>
		<view v-if="active == 1" class="video-list">
			<view class="video-item flex-direction bg-gray flex shadow shadow-blur" v-for="(item,index) in list"
				:key="index" @click="toDetail(item.share_id)">
				<view class="cover">
					<image :src="static_url + item.gif" mode="aspectFill"></image>
				</view>
				<view class="padding-left">
					<text class="text-cut">{{item.title}}</text>
				</view>
				<view class="padding-left padding-right flex justify-between">
					<text>{{timestampFormat(item.createtime)}}</text>
					<view class="">
						<text class="cuIcon-likefill text-orange"></text>
						<text class="margin-left-sm">{{item.fabulous}}</text>
					</view>
				</view>
			</view>
		</view>
		<view v-if="active == 2" class="margin-left margin-right">
			<view class="bg-gray flex align-center shadow shadow-blur" v-for="(item,index) in list" :key="index">
				<view class="comment-cover margin-sm">
					<image :src="static_url + item.gif" mode="aspectFill"></image>
				</view>
				<view class="flex-sub">
					<text class="text-cut">{{item.content}}</text>
					<view class="padding-right flex justify-between">
						<text>{{timestampFormat(item.createtime)}}</text>
					</view>
				</view>

			</view>
		</view>


	</view>
</template>
<script>
	import _data from "@/common/_data";
	import _get from "@/common/_get.js";
	import _action from '@/common/_action.js'
	export default {
		data() {
			return {
				user_info: {},
				fabulous: 0,
				follow: 0,
				fans: 0,
				static_photo: '',
				static_url: '',
				avatar:'',

				tabs: [
					'作品',
					'喜欢',
					'评论'
				],
				active: 0,

				list: [], //列表

				user_id: '',
				page: 1,

				my_data: {}, //我

			}
		},
		onPullDownRefresh() {
			uni.startPullDownRefresh();
			this.getInfo(this.user_id);
		},
		onLoad(option) {
			this.user_id = option.id;
			this.static_photo = _data.staticPhoto();
			this.static_url = _data.staticUrl();
			this.getUserInfo();
			this.getInfo(option.id);
			this.changeTab(this.active);
		},
		onReachBottom() {
			if (this.active == 0) {
				this.get_video_list();
			}
			if (this.active == 1) {
				this.get_fabulous_log();
			}
			if (this.active == 2) {
				this.get_comment_log();
			}
		},
		methods: {
			getUserInfo() {
				let _this = this;
				_get.getUserInfo({}, function(data) {
					_this.my_data = data;
				});
			},
			toFans() {
				// console.log("this.my_data.id", this.my_data);
				// console.log("this.user_id", this.user_id);
				if (this.my_data.id == this.user_id) {
					uni.navigateTo({
						url: './fans',
					})
				}
			},
			toFlow() {
				if (this.my_data.id == this.user_id) {
					uni.navigateTo({
						url: './flow',
					})
				}
			},
			toDetail(id) {
				console.log("id", id);
				uni.navigateTo({
					url: './detail?id=' + id,
				})
			},
			timestampFormat(time) {
				return _action.timestampFormat(time);
			},
			changeTab(index) {
				this.active = index;
				this.page = 1;
				this.list = [];
				if (this.active == 0) {
					this.get_video_list();
				}
				if (this.active == 1) {
					this.get_fabulous_log();
				}
				if (this.active == 2) {
					this.get_comment_log();
				}
			},
			get_video_list() {
				this.$httpSend({
					path: "/im/video.Share/user_video",
					data: {
						user_id: this.user_id,
						page: this.page,
					},
					success: (res) => {
						if (res.data.length) {
							this.page++;
						}
						console.log("res", res);
						this.list = [...this.list, ...res.data];
					}
				})
			},
			get_comment_log() {
				this.$httpSend({
					path: "/im/video.Share/common_log",
					data: {
						user_id: this.user_id,
						page: this.page,
					},
					success: (res) => {
						if (res.data.length) {
							this.page++;
						}
						console.log("res", res);
						this.list = [...this.list, ...res.data];
					}
				})
			},
			get_fabulous_log() {
				this.$httpSend({
					path: "/im/video.Share/fabulous_log",
					data: {
						user_id: this.user_id,
						page: this.page,
					},
					success: (res) => {
						if (res.data.length) {
							this.page++;
						}
						console.log("res", res);
						this.list = [...this.list, ...res.data];
					}
				})
			},
			getInfo(id) {
				const _this = this;
				_this.$httpSend({
					path: "/im/video.Share/user_info",
					data: {
						user_id: this.user_id,
					},
					success: (res) => {
						console.log("res", res);
						_this.user_info = res.user_info;
						_this.fabulous = res.fabulous;
						_this.follow = res.follow;
						_this.fans = res.fans;
						_this.avatar = _this.static_photo + _this.user_info.face
						uni.stopPullDownRefresh();
					}
				})
			},
		},
	}
</script>
<style scoped lang="scss">
	@import '@/static/css/colorui/main.css';
	@import '@/static/css/colorui/icon.css';

	.comment-cover {
		width: 160rpx;
		height: 160rpx;

		image {
			width: 100%;
			height: 100%;
			background: #fff;
		}

	}

	.video-list {
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		padding: 0 20rpx;

		.video-item {
			flex-shrink: 0;
			width: 48%;
			border-radius: 20rpx;
			margin-bottom: 20rpx;

			.cover {
				border-radius: 10rpx;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}

	page {
		background: #fff;
	}

	.avatar {
		background: #eee;
		width: 160rpx;
		height: 160rpx;
		overflow: hidden;
		border-radius: 50%;
	}
</style>
