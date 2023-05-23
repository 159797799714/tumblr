<template>
	<share-poster ref="poster">
		<view class="page">
			<uni-nav-bar leftText="" :statusBar="true" backgroundColor="transparent" :border="false">
				<template v-slot:left v-if="!load_image">
					<view class="icon-center" @click="backUser">
						<image class="back-icon" src="/static/share/nav_icon_back_black.png" mode="widthFix"></image>
					</view>
				</template>
				<template v-slot:default v-if="!load_image">
					<view class="nav-bar">
						<text class="title">我的二维码</text>
					</view>
				</template>
				<template class="" v-slot:right v-if="!load_image">
					<view class="icon-center" @click="refreshData">
						<image class="refresh-icon" :class="{refresh:loading}" src="/static/share/refresh.png"
							mode="widthFix"></image>
					</view>
				</template>
			</uni-nav-bar>

			<view class="qr-box">
				<view class="qr-box-title">
					<image class="qr-box-avatar" :lazy-load="true" :src="myPhoto" mode="widthFix"></image>
					<view class="qr-box-tip">
						<text class="black">{{my_data.nickname}}</text>
						<text class="gray">默聊号:{{my_data.username}}</text>
					</view>
				</view>
				<view class="qrimg">
					<tki-qrcode ref="qrcode" :val="qrData" :onval="true" :size="300" unit="upx" background="#ffffff"
						foreground="#000000" pdground="#000000" :loadMake="true" :showLoading="true"
						loadingText="加载中..." @result="qrR" />
				</view>
				<text class="text_font">使用默聊APP扫描二维码,加我为好友</text>
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
			<view class="share" v-if="load_image">
				<image class="share_icon" src="@/static/share_icon.png" mode="widthFix"></image>
			</view>
		</view>
	</share-poster>
</template>

<script>
	import uniList from '../../components/uni-list/uni-list.vue';
	import uniListItem from '../../components/uni-list-item/uni-list-item.vue';
	import _page from '../../common/common';
	import _hook from '../../common/_hook';
	import _data from '../../common/_data';
	import tkiQrcode from "../../components/tki-qrcode/tki-qrcode";
	import uniNavBar from '@/components/uni-ui/uni-nav-bar/uni-nav-bar.vue'
	import SharePoster from '@/components/share-poster/index.vue';
	import {
		pathToBase64
	} from '@/components/share-poster/image-tools.js';
	export default {
		components: {
			uniList,
			uniListItem,
			tkiQrcode,
			uniNavBar,
			SharePoster
		},
		data() {
			return {
				my_data: {
					id: 0
				},
				img_path: '',
				loading: false,
				resultImg: '',
				load_image: false,
			}
		},
		onShow() {
			this.initData();
		},
		onLoad() {

		},
		onUnload() {
			uni.$off('data_user_info');
		},
		computed: {
			qrPhoto() {
				return _data.data('cache').local_photo;
			},
			myPhoto() {
				return _data.staticPhoto() + this.my_data.photo;
			},
			qrData() {
				let qr = _page.qrAction.chatAdd({
					user_id: this.my_data.id
				});
				console.log("qr", qr);
				return qr;
			},
		},
		methods: {
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
					bitmap.save("_doc/a.jpg", {}, function(i) {
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
			initData() {
				_hook.routeTabBarHook();
				let _this = this;
				/** 监听新的个人数据 */
				uni.$on('data_user_info', function(data) {
					_this.my_data = data;
				});
				_this.my_data = _data.data('user_info');
				setTimeout(() => {
					this.loading = false;
				}, 1000)
			},
			refreshData() {
				this.loading = true;
				this.initData();
			},
			backUser() {
				uni.switchTab({
					url: '/pages/my/index'
				})
			},

			qrR(ref) {
				this.img_path = ref;
			},
		},
		watch: {

		},
	}
</script>

<style lang="scss" scoped>
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

	.qr-box {
		width: 650rpx;
		margin: 120rpx auto 0;
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
			margin-bottom: 60rpx;

			.qr-box-avatar {
				width: 160rpx;
				height: 160rpx;
				border-radius: 50%;
				box-shadow: 0 10px 30rpx 6rpx rgba(0, 0, 0, .1);
				margin-bottom: 30rpx;
				margin-top: 60rpx;
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
		padding-bottom: 40upx;
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
