<template>
	<view class="page">
		<uni-nav-bar leftText="" :statusBar="true" backgroundColor="#11d7a8" :border="false">
			<template v-slot:left>
				<view class="icon-center" @click="backUser">
					<image class="back-icon" src="/static/share/nav_icon_back_black.png" mode="widthFix"></image>
				</view>
			</template>
			<template v-slot:default>
				<view class="nav-bar">
					<text class="title">我的二维码</text>
				</view>
			</template>
			<template class="" v-slot:right>
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
					<text class="gray">{{my_data.doodling}}</text>
				</view>
			</view>
			<view class="qrimg">
				<tki-qrcode ref="qrcode" :val="qrData" :onval="true" :size="300" unit="upx" background="#ffffff"
					foreground="#000000" pdground="#000000" :loadMake="true" :showLoading="true" loadingText="加载中..."
					@result="qrR" />
			</view>
			<text class="text_font">使用默往APP扫描二维码,加我为好友</text>
			<view class="btn-group">
				<view class="btn" @click="saveImage">
					<image src="/static/share/album_down_save.webp" mode="widthFix"></image>
					<text>保存</text>
				</view>
				<view class="btn" @click="shareImage">
					<image src="/static/share/album_share_friend.webp" mode="widthFix"></image>
					<text>分享</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniList from '../../components/uni-list/uni-list.vue';
	import uniListItem from '../../components/uni-list-item/uni-list-item.vue';
	import _page from '../../common/common';
	import _hook from '../../common/_hook';
	import _data from '../../common/_data';
	import tkiQrcode from "../../components/tki-qrcode/tki-qrcode";
	import uniNavBar from '@/components/uni-ui/uni-nav-bar/uni-nav-bar.vue'
	export default {
		components: {
			uniList,
			uniListItem,
			tkiQrcode,
			uniNavBar
		},
		data() {
			return {
				my_data: {
					id: 0
				},
				img_path: '',
				loading: false,
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
			shareImage() {
				// #ifdef H5
				uni.showToast({
					icon: 'none',
					title: '请截图保存'
				})
				// #endif
				// console.log("this.$refs.qrcode", this.$refs.qrcode.result);
				uni.saveImageToPhotosAlbum({
					filePath: this.$refs.qrcode.result,
					success: function(res) {
						console.log('save success', res);
						uni.shareWithSystem({
							type: 'image',
							imageUrl: res.path,
						})
					}
				});
			},
			saveImage() {
				// #ifdef APP-PLUS
				this.$refs.qrcode._saveCode();
				// #endif
				// #ifdef H5
				uni.showToast({
					icon: 'none',
					title: '请截图保存'
				})
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
		margin: 160rpx auto 0;
		border-radius: 50rpx;
		height: 1040rpx;
		overflow: hidden;
		box-shadow: 0 0 10rpx 0rpx rgba(0, 0, 0, .1);
		background: #fff;

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
				margin-top: 100rpx;
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
