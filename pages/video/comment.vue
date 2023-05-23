<template>
	<view class="wanl-comment">
		<!-- 评论主体-start -->
		<scroll-view @scrolltolower="loadMore" v-if="commentList.length != 0" class="margin-bottom-bj"
			:style="{ height: `${mainHeight}px` }" scroll-y>
			<view class="flex flex-direction margin-bottom-sm" v-for="(item, index) in commentList" :key="index">
				<image class="comment-avatar round margin-right-bj" :src="static_photo + item.user_info.face"></image>
				<view class="flex-sub">
					<!-- 父评论体-start -->
					<view class="flex flex-direction justify-between align-center">
						<view class="flex flex-direction align-center">
							<view>
								<text class="text-30 text-white-6">{{ item.user_info.nickname }}</text>
							</view>
						</view>
					</view>
					<view class="margin-tb-s">
						<text class="text-sm text-white-9">{{ item.content }}</text>
					</view>
					<view class="flex flex-direction align-center margin-bottom-sm">
						<view class="margin-right-sm">
							<text class="text-sm text-white-5">{{ timestampFormat(item.createtime) }}</text>
						</view>
						<!-- <view class="margin-right-sm" @click="
                handleReply(item.user_info.nickname, item.share_id)
              ">
							<text class="text-sm text-blue">回复</text>
						</view> -->
					</view>
					<!-- 父评论体-end -->
					<!-- 子评论列表-start -->
					<view v-if="item.children.length > 0" class="
              comment-chil-dlist
              padding-lr-sm padding-top-sm
              margin-bottom-sm
              radius-bock
            ">
						<view class="flex flex-direction" v-for="(each, keys) in item.childlist" :key="keys">
							<image class="comment-avatar round margin-right-bj"
								:src="static_photo + each.user_info.face">
							</image>
							<view class="flex-sub">
								<view class="flex flex-direction justify-between align-center">
									<view class="nick-name">
										<text class="text-30 text-white-6">{{ each.user_info.nickname }}</text>
									</view>
								</view>
								<view class="margin-tb-s">
									<text class="text-sm text-white-9">{{ each.content }}</text>
								</view>
								<view class="
                    comment-main-foot
                    flex flex-direction
                    align-center
                    margin-bottom
                  ">
									<view class="margin-right-sm">
										<text class="text-sm text-white-5">{{ timestampFormat(each.createtime) }}</text>
									</view>
									<!-- <view class="margin-right-sm" @click="
									  handleReply(
										item.user.nickname,
										item.share_id
									  )
									">
										<text class="text-sm text-blue">回复</text>
									</view> -->
								</view>
							</view>
						</view>
					</view>
					<!-- 子评论列表-end -->
				</view>
			</view>
		</scroll-view>
		<!-- 评论不存在 -->
		<view class="flex align-center justify-center" :style="{ height: `${mainHeight}px` }" v-else>
			<view class="nomore">
				<view class="flex-direction text-center justify-center margin-top-bj">
					<text class="text-gray-dark text-sm">还没有任何评论，</text>
					<text class="text-orange text-sm" @click="commentInput">抢沙发！</text>
				</view>
			</view>
		</view>
		<!-- 底部评论条 -->
		<view class="flex flex-direction justify-between align-center"
			:style="{ height: `${tabbarHeight}px`, paddingBottom: `${tabbarTop}px` }">
			<input class="comment-input flex-sub padding-lr-sm" v-model="commentReq.content" placeholder="留下你的精彩评论吧"
				placeholder-style="fontSize: 14px; color: #999999;" :maxlength="100" :focus="focus"
				@blur="handleBlur" />
			<view class="flex comment-button margin-left-bj justify-center align-center" @click="handleAdd">
				<text class="icon text-sm">&#xe640;</text>
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcons from "@/components/uni-icons/uni-icons.vue";

	import _data from "@/common/_data";
	import _get from "@/common/_get";
	import _mixins from '@/common/_mixins';
	import _action from "@/common/_action";
	export default {
		props: {
			findId: {
				type: Number,
				default: 0,
			},
			commenCount: {
				type: Number,
				default: 0,
			},
			commentList: {
				type: Array,
				default () {
					return [];
				},
			},
			deleteTip: {
				type: String,
				default: "删除后不可找回，子评论将一并删除",
			},
		},
		components: {
			uniIcons,
		},
		mounted() {
			console.log("this.findId", this.findId);
		},
		data() {
			return {
				mainHeight: 0,
				tabbarTop: 0,
				tabbarHeight: 0,
				commentReq: {
					pid: null, // 评论父id
					content: null, // 评论内容
				},
				pUser: null, // 标签-回复人
				focus: false, // 输入框自动聚焦
				static_photo: _data.staticPhoto(),

				my_data: {}, //本人
				page: 2
			};
		},
		async mounted() {
			let sys = uni.getSystemInfoSync();
			this.mainHeight = sys.windowHeight / 1.8;
			this.tabbarTop = sys.safeAreaInsets.bottom;
			this.tabbarHeight = sys.safeAreaInsets.bottom + uni.upx2px(70);

			let _this = this;
			_get.getUserInfo({});
			uni.$on('data_user_info', function(data) {
				data.photo = data.photo + '?_=' + +Math.random()
				data.photo = data.photo.replace(/(\?_=)[\d\.]+$/, '$1' + Math.random());
				_this.my_data = data;

				_data.data('user_info', data)
			});
		},
		methods: {
			loadMore() {
				_mixins.methods.$httpSend({
					path: "/im/video.Share/getComment",
					data: {
						id: this.findId,
						type: "1",
						page: this.page,
					},
					success: (res) => {
						if (this.page <= res.last_page) {
							this.page++;
							this.commentList.push(...res.data);
						}
					},
				});
			},
			timestampFormat(time) {
				return _action.timestampFormat(time);
			},
			// 回复评论
			handleReply(pUser, pId) {
				this.commentReq.pid = pId;
				if (pUser) {
					this.commentReq.content = "@" + pUser + " ";
				} else {
					this.commentReq.content = "";
				}
				this.commentInput();
			},
			// 新增评论
			async handleAdd() {
				if (
					this.commentReq.content == null) {
					uni.showToast({
						title: "请输入评论内容",
						duration: 2000,
						icon: "none",
					});
					return;
				}
				this.commentReq.find_id = this.findId;
				let data = {
					share_id: this.findId,
					comment_id: this.commentReq.pid || 0,
					content: this.commentReq.content,
				}
				console.log("评论参数", data);
				_mixins.methods.$httpSend({
					path: "/im/video.Share/comment",
					data: {
						share_id: this.findId,
						comment_id: this.commentReq.pid || 0,
						content: this.commentReq.content,
					},
					success: (data) => {
						console.log("data", data);
						if (data.code == 0) {

							uni.showToast({
								title: "评论成功",
								icon: "none",
							});
							this.commentList.unshift({
								user_info: this.my_data,
								content: this.commentReq.content,
								share_id: this.findId,
								comment_id: this.commentReq.pid || 0,
								createtime: new Date().getTime(),
								children: []
							})
							this.commentReq.content = "";
							console.log("this.commentList", this.commentList);
							// this.tagClose();
							this.$emit("complete", {
								type: "add",
								id: this.findId
							});
						}
					},
				});
			},
			// 标签关闭
			tagClose() {
				this.pUser = null;
				this.commentReq.pid = null;
				this.commentReq.content = null;
			},
			// 输入框失去焦点
			handleBlur() {
				this.focus = false;
			},
			// 输入评论
			commentInput() {
				this.focus = true;
				// TODO 调起键盘方法
			},
		},
	};
</script>

<style scoped>
	@import "@/static/css/common.css";

	.nomore {
		height: 200rpx;
	}

	.comment-avatar {
		width: 70rpx;
		height: 70rpx;
		background-color: rgba(255, 255, 255, 0);
	}

	.comment-tag {
		padding: 0 10rpx;
		border-radius: 10rpx;
		height: 32rpx;
		overflow: hidden;
	}

	.comment-none-image {
		height: 360rpx;
		width: 360rpx;
	}

	.comment-input {
		background-color: #ececec;
		height: 70rpx;
		border-radius: 10rpx;
		font-size: 14px;
		color: #333333;
	}

	.comment-button {
		background-color: #02dc6b;
		border-radius: 5000rpx;
		height: 70rpx;
		width: 70rpx;
	}

	.comment-chil-dlist {
		background-color: rgba(100, 100, 100, 0.05);
	}

	.comment-fabulous {
		height: 40rpx;
	}
</style>
