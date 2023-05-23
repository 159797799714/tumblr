<template>
	<share-poster ref="poster">
		<view class="page">
			<uni-nav-bar leftText="" :statusBar="true" backgroundColor="transparent" :border="false">
				<!-- <template v-slot:left v-if="!load_image">
					<view class="icon-center" @click="backUser">
						<image class="back-icon" src="/static/share/nav_icon_back_black.png" mode="widthFix"></image>
					</view>
				</template>
				<template v-slot:default v-if="!load_image">
					<view class="nav-bar">
						<text class="title">分享群</text>
					</view>
				</template> -->
			</uni-nav-bar>

			<view class="qr-box">
				<view class="qr-box-title">
					<!-- <view class="chatgroup-avatar-group">
						<image :class="'chatgroup-avatar-item-' + member.length" v-for="(item,index) in member"
							:key="index" :src="photo(item.photo)" :lazy-load="true">
						</image>
					</view>
					<view class="chatgroup-title">
						<text v-for="(item,index) in member" :key="index">{{item.show_name}}
							<block v-if="index < member.length - 1">、</block>
						</text>
					</view> -->
					<image class="qr-box-avatar" :lazy-load="true" :src="group_photo" mode="widthFix"></image>
					<view class="chatgroup-title">
						{{group_data.name}}
					</view>
				</view>
				<view class="qrimg">
					<tki-qrcode ref="qrcode" :val="qrData" :onval="true" :size="300" unit="upx" background="#ffffff"
						foreground="#000000" pdground="#000000" :loadMake="true" :showLoading="true"
						loadingText="加载中..." @result="qrR" />
				</view>
				<text class="text_font">使用默聊APP扫描二维码,加入群聊</text>
				<view class="btn-group" v-if="!load_image">
					<view class="btn" @click="savePoster">
						<image src="/static/share/album_down_save.webp" mode="widthFix"></image>
						<text>保存</text>
					</view>
					<view class="btn" @click="createPoster">
						<image src="/static/share/album_share_friend.webp" mode="widthFix"></image>
						<text>分享</text>
					</view>
				</view>
			</view>
			<view class="qr-box-small" @click="groupCopy" v-if="!load_image">
				<view class="kouling">
					<image src="/static/group/kouling.png" mode=""></image>
					<text>生成群口令</text>
				</view>
				<view class="kouling-tips">
					点击生成群口令
				</view>
			</view>
			<view class="share" v-if="load_image">
				<image class="share_icon" src="@/static/share_icon.png" mode="widthFix"></image>
			</view>
		</view>
	</share-poster>
</template>


<script>
	import tkiQrcode from '../../../components/tki-qrcode/tki-qrcode.vue';
	import _data from '../../../common/_data';
	import _hook from '../../../common/_hook';
	import _page from '../../../common/common';
	import uniNavBar from '@/components/uni-ui/uni-nav-bar/uni-nav-bar.vue'
	import SharePoster from '@/components/share-poster/index.vue';
	export default {
		components: {
			tkiQrcode,
			uniNavBar,
			SharePoster
		},
		data() {
			return {
				list_id: '',
				my_data: {
					id: 0
				},
				group_photo: '',
				load_image: false,
				group_data: {}, //群数据
				member: [], //成员

			}
		},
		onShow() {
			_hook.routeTabBarHook();
			let _this = this;
			/** 监听新的个人数据 */
			uni.$on('data_user_info', function(data) {
				_this.my_data = data;
			});
			_this.my_data = _data.data('user_info');
			// this.group_photo = _data.data('cache')['group_photo_' + _this.list_id];
		},
		onLoad(option) {
			this.list_id = option.list_id;
			this.getData();
		},
		onUnload() {
			uni.$off('data_user_info');
		},
		computed: {
			qrData() {
				return _page.qrAction.addGroup({
					user_id: this.my_data.id,
					list_id: this.list_id
				});
			},
			staticPhoto() {
				return _data.staticPhoto();
			},
		},
		methods: {
			photo(path) {
				return this.staticPhoto + path + '?_=' + Math.random();
			},
			getData() {
				let _this = this;
				_this.$httpSend({
					path: '/im/message/getChatDetails',
					data: {
						list_id: _this.list_id,
					},
					success(data) {
						console.log("群数据", data);
						_this.group_data = data.group;
						// todo
						_this.member = data.member;
						// _this.member = [..._this.member, ..._this.member, ..._this.member];
						if (_this.member.length >= 6) {
							_this.member = _this.member.splice(0, 6);
						}

						_this.group_photo = _this.photo(data.group.is_photo);
					}
				});
			},
			backUser() {
				uni.navigateBack({

				})
			},
			qrR(ref) {
				this.img_path = ref;
			},
			saveQrcode() {
				_page.saveImgToPhotos(this.img_path);
			},
			// app截图保存、分享
			capture(type) {
				const _this = this;
				var pages = getCurrentPages();
				var page = pages[pages.length - 1];
				var bitmap = null;
				var currentWebview = page.$getAppWebview();
				bitmap = new plus.nativeObj.Bitmap('amway_img');
				currentWebview.draw(bitmap, function() {
					console.log("绘制截图成功");
					bitmap.save("_doc/b.jpg", {}, function(i) {
						console.log("保存图片成功", JSON.stringify(i));
						uni.saveImageToPhotosAlbum({
							filePath: i.target,
							success: function() {
								bitmap.clear(); //销毁缓存图片
								if (type == 'save') {
									uni.showToast({
										icon: 'none',
										title: '保存成功',
									})
								}
								if (type == "share") {
									uni.shareWithSystem({
										type: 'image',
										imageUrl: i.target,
									})
								}
								_this.load_image = false;
								uni.hideLoading();
							}
						})
					}, function(err) {
						_this.load_image = false;
						uni.hideLoading();
						console.log("保存失败", JSON.stringify(err))
					})
				}, function(err) {
					_this.load_image = false;
					uni.hideLoading();
					console.log("绘制截图失败", JSON.stringify(err))
				}, {
					check: true, // 设置为检测白屏
					clip: {
						top: '100px',
						left: '0px',
						height: '100%',
						width: '100%'
					} // 设置截屏区域
				})
			},
			// 生成海报
			createPoster() {
				// #ifdef H5
				uni.showToast({
					icon: 'none',
					title: '请截图分享'
				})
				// #endif
				// #ifdef APP-PLUS
				this.createImage('share');
				// #endif
			},
			// 生成海报
			createImage(type) {
				this.load_image = true;
				uni.showLoading({
					title: '正在生成...'
				});
				setTimeout(() => {
					this.capture(type);
				}, 300)
			},
			// 保存海报
			savePoster() {
				// #ifdef H5
				uni.showToast({
					icon: 'none',
					title: '请截图保存'
				})
				// #endif
				// #ifdef APP-PLUS
				this.createImage('save');
				// #endif
			},
			groupCopy() {
				_page.uniCopy({
					content: this.group_data.id,
					success: function() {
						uni.showToast({
							'title': '复制成功',
							duration: 2000
						})
					}
				})
			},
		},
		watch: {

		},
	}
</script>

<style lang="scss" scoped>
	.chatgroup-avatar-group {
		display: flex;
		flex-wrap: wrap;
		width: 200rpx;
		height: 200rpx;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 20rpx;
		box-sizing: border-box;
		padding: 20rpx 10rpx;
		justify-content: center;
		align-items: center;

		.chatgroup-avatar-item-0 {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
		}

		.chatgroup-avatar-item-1 {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
		}

		.chatgroup-avatar-item-2 {
			width: 90rpx;
			height: 90rpx;
			border-radius: 50%;
		}

		.chatgroup-avatar-item-3 {
			width: 90rpx;
			height: 90rpx;
			border-radius: 50%;
		}

		.chatgroup-avatar-item-4 {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
		}

		.chatgroup-avatar-item-5 {
			width: 60rpx;
			height: 60rpx;
			border-radius: 50%;
		}

		.chatgroup-avatar-item-6 {
			width: 60rpx;
			height: 60rpx;
			border-radius: 50%;
		}
	}

	.chatgroup-avatar {
		width: 150rpx;
		height: 150rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}

	.chatgroup-title {
		font-size: 30rpx;
		font-weight: bold;
		width: 500rpx; //固定宽度
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		word-break: break-all;
		text-align: center;
		margin: 6rpx auto;
	}

	.share {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 80rpx;
		margin: 30rpx;

		.share_icon {
			width: 200rpx;
		}
	}

	.btn-group {
		width: 400rpx;
		height: 120rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 20rpx auto;

		.btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			image {
				width: 58rpx;
				height: 58rpx;
			}

			text {
				color: #0e131c;
				font-size: 32rpx;
				font-weight: bold;
			}
		}
	}

	.qr-box-small {
		width: 630rpx;
		margin: 20rpx auto;
		border-radius: 40rpx;
		// height: 100rpx;
		overflow: hidden;
		box-shadow: 0 0 10rpx 2rpx rgba(0, 0, 0, .2);
		background: #fff;
		box-sizing: border-box;
		padding: 20rpx 30rpx;
		display: flex;
		flex-direction: column;

		.kouling {
			display: flex;
			justify-content: center;
			align-items: center;

			image {
				width: 40rpx;
				height: 40rpx;
			}

			text {
				font-size: 30rpx;
			}
		}

		.kouling-tips {
			font-size: 24rpx;
			color: #d2d3d6;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	.qr-box {
		width: 650rpx;
		margin: 10rpx auto 0;
		// border-radius: 50rpx;
		// height: 1040rpx;
		// overflow: hidden;
		// box-shadow: 0 0 10rpx 0rpx rgba(0, 0, 0, .1);
		// background: #fff;
		background: url('@/static/bg.png') no-repeat;
		background-size: 100% 100%;
		box-sizing: border-box;
		padding: 30rpx;

		.qr-box-title {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-bottom: 20rpx;

			.qr-box-avatar {
				width: 160rpx;
				height: 160rpx;
				border-radius: 10rpx;
				// box-shadow: 0 10px 30rpx 6rpx rgba(0, 0, 0, .1);
				margin-bottom: 30rpx;
				margin-top: 30rpx;
			}

			.qr-box-tip {
				display: flex;
				flex-direction: column;
				align-items: center;

				text {
					font-size: 30rpx;
				}

				.gray {
					color: #d2d3d6;
				}

				.black {
					color: #353941;
				}
			}
		}
	}

	.page {
		background: url('@/static/share/im_group_qr_bg_big.png') no-repeat;
		background-size: 100% auto;
	}

	// page {
	// 	height: 100vh;
	// 	background: url('@/static/share/im_group_qr_bg_big.png') no-repeat;
	// 	background-size: 100% auto;
	// }

	.icon-center {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.back-icon {
		width: 44rpx;
		height: 44rpx;
		flex-shrink: 0;
	}

	.refresh-icon {
		width: 50rpx;
		height: 50rpx;
		flex-shrink: 0;
	}

	@keyframes round {
		0% {
			transform: rotate(0);
		}

		0% {
			transform: rotate(-360deg);
		}
	}

	.refresh {
		animation: round 1s linear infinite;
	}

	.nav-bar {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		margin-left: -30rpx;

		.title {
			font-weight: bold;
			font-size: 30rpx;
		}
	}


	.qrimg {
		text-align: center;
		background: #FFFFFF;
		padding-bottom: 10upx;
	}

	.bode_main {
		margin: 150upx 35upx 0 35upx;
		width: 680upx;
		height: 900upx;
		border-radius: 50upx;
		overflow: hidden;
	}

	.photo {
		width: 110upx;
		height: 110upx;
		margin-left: 30upx;
		margin-right: 30upx;
	}

	.my_padding {
		padding-bottom: 20px;
	}

	.my_padding:before {
		background-color: white;
	}

	.my_padding:before {
		background-color: white;
	}

	.my_padding:after {
		background-color: white;
	}

	.text_font {
		color: #8f8f94;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
