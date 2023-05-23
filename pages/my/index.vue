<template>
	<view class="myPage">
		<view class="myTop">
			<view class="topBg">
				<view class="centerIcon">

					<view class="headerImg">
						<image :src="myPhoto" @tap="goPath('/pages/my/details')" :lazy-load="true" />
					</view>
				</view>
				<view class="top-right-cion">
					<image @click="toScan" src="/static/my/scan.png" mode=""></image>
					<image @click="toHelp" src="/static/my/wen.png" mode=""></image>
				</view>

			</view>
			<view class="userName" @tap="goPath('/pages/my/details')">
				<view class="userLf">
					<text>{{my_data.nickname}}</text>
					<text>用户账号:{{my_data.username}}</text>
				</view>
				<view class="userRt">
					<text class="circle"></text>
					<image class="header_erw" src="/static/theme/default/my/qrcode.png"
						@tap.stop="goPath('/pages/my/qrcode')" :lazy-load="true" />
				</view>
			</view>
		</view>
		<!--     <view class=" my_padding">
      
					   <div style="display: flex;" @tap="goPath('/pages/my/details')">
						   <view class="uni-media-list-logo phto">
						       <image :src="myPhoto"
						              :lazy-load="true"
						              style="border-radius: 10px;"/>
						   </view>
						   <view class="header-msg">
						       <view class="header-msg-bottom" style="font-weight: 400;font-size: 24px;color: black">{{my_data.nickname}}</view>
						       <view class="header-msg-top" style="font-weight: 400;font-size: 20px;">{{my_data.phone}}</view>
						   </view>
					   </div>
						<image class="header-erw" src="/static/theme/default/my/qrcode.png" :lazy-load="true" @tap="goPath('/pages/my/qrcode')"/>
							
           </view> -->
		<!--</navigator>-->


		<view class="listOut">


			<uni-list class="list">
				<uni-list-item v-if="showSmallChange" title="零钱" :showArrow="true" :show-arrow="true" badge-type="error"
					thumb="../../static/theme/default/my/user_icon_change.png" @click="goPath('./wallet/index')" />
				<!-- <uni-list-item title="会员" :show-arrow="true" :showArrow="true"
					thumb="/static/theme/default/my/2e3c179e325739b820dc9db6e911707.png" @click="goPath('../push/circle_user?user_id='+my_data.id)" /> -->
				<!--<uni-list-item title="朋友圈" :show-arrow="true" :showArrow="true"
					thumb="/static/theme/default/my/user_icon_liang.png"  @click="goPath('../push/circle_user?user_id='+my_data.id)" />-->
				<uni-list-item title="收藏" :show-arrow="true" :showArrow="true"
					thumb="/static/theme/default/my/user_icon_collect.png" @click="goPath('store')" />
				<!--<uni-list-item title="插件中心"-->
				<!--:showArrow="true"-->
				<!--:show-arrow="true"-->
				<!--:show-badge="true"-->
				<!--badge-type="error"-->
				<!--:badge-text="show_pay_tips"-->
				<!--thumb="../../static/theme/default/my/chajian.png"-->
				<!--@click="goPath('/pages/my/vendor')"/>-->
				<!--<uni-list-item title="扫一扫"-->
				<!--:show-badge="true"-->
				<!--:showArrow="true"-->
				<!--badge-type="error"-->
				<!--thumb="/static/theme/default/push/scan.png"-->
				<!--@click="goScanCode"/>-->
				<!-- <uni-list-item title="客服" :showArrow="true" :show-arrow="true" badge-type="error"
					thumb="../../static/theme/default/my/user_icon_service.png" @click="goKefu" v-if="showKefu" /> -->
				<!-- <uni-list-item title="生活圈"
                           :show-badge="true"
                           :showArrow="true"
                           badge-type="error"
                           :badge-text="show_tips"
                           thumb="/static/theme/default/push/circle.png"
                           @click="goPath('../push/circle')"/> -->
				<uni-list-item title="帮助" :showArrow="true" :show-arrow="true" badge-type="error"
					thumb="../../static/theme/default/my/user_icon_safe.png" @click="goPath('../article/article')"
					v-if="showKefu" />
				<!-- <uni-list-item title="我的动态" :show-badge="true" :showArrow="true" badge-type="error"
					:badge-text="show_tips" thumb="../../static/theme/default/my/dongtai.png"
					@click="goPath('../push/circle_user?user_id='+my_data.id)" /> -->

				<!--     <uni-list-item title="安全" :show-arrow="true" :showArrow="true"
		          thumb="../../static/theme/default/my/user_icon_safe.png" @click="goPath('../set/index')" />-->
				<!-- <uni-list-item title="帮助中心" :showArrow="true" thumb="../../static/theme/default/help.png"
					@click="goPath('../article/article')" /> -->
				<uni-list-item title="设置" :show-arrow="true" :showArrow="true"
					thumb="../../static/theme/default/my/user_icon_setting.png" @click="goPath('../set/index')" />

			</uni-list>
		</view>

		<uni-list class="list" v-if="0">
			<uni-list-item title="小程序" :show-arrow="true" :showArrow="true"
				thumb="../../static/theme/default/push/program.png" />

			<uni-list-item title="相册" :show-arrow="true" :showArrow="true"
				thumb="../../static/theme/default/my/images.png" @click="goPath()" />
			<uni-list-item title="实名" :show-arrow="true" :showArrow="true"
				thumb="../../static/theme/default/my/real.png" @click="goPath()" />
			<uni-list-item title="表情" :showArrow="true" :show-arrow="true"
				thumb="../../static/theme/default/my/emoji.png" @click="goPath()" />
		</uni-list>

		<!-- 	<uni-list class="list" style="margin-bottom: 20px;">

			<uni-list-item title="设置" :show-arrow="true" :showArrow="true" thumb="../../static/theme/default/my/set.png"
				@click="goPath('../set/index')" />
		</uni-list> -->

	</view>
</template>

<script>
	import uniList from '../../components/uni-ui/uni-list/uni-list.vue';
	import uniListItem from '../../components/uni-ui/uni-list-item/uni-list-item.vue';
	import _get from '../../common/_get';
	import _hook from '../../common/_hook';
	import _data from '../../common/_data';


	export default {
		components: {
			uniList,
			uniListItem
		},
		data() {
			return {
				my_data: {
					id: 0
				},
				baseConfig: {},
				show_tips: '',
				show_pay_tips: '',
				status_height: '',
				showSmallChange: 1,
			}
		},
		onShow() {
			_hook.routeTabBarHook();
			let num = _data.data('no_reader_circle_chat_num'),
				_this = this;
			_this.my_data = _data.data('user_info');
			_get.base(function() {
				_this.showSmallChange = _data.data('small_change');
			});

			/** 监听新的个人数据 */
			uni.$on('data_user_info', function(data) {
				_this.my_data = data;
				console.log(_this.my_data)
			});
			/** 监听朋友圈动态提示 */
			// uni.$on('data_circle_tips', function (data) {
			//     _this.show_tips = data;
			// });
			// uni.$on('data_pay_tips',function (data) {
			//     _this.show_pay_tips = data;
			// })
			// if (num) {
			//     this.show_tips = num;
			// } else if (_data.data('no_reader_circle')) {
			//     this.show_tips = '好友动态';
			// } else {
			//     this.show_tips = '';
			// }
		},
		onLoad() {
			let sys = uni.getSystemInfoSync();
			this.status_height = sys.statusBarHeight;
		},
		onHide() {
			//uni.$off('data_user_info');
			uni.$off('data_circle_tips');
		},
		computed: {
			myPhoto() {
				return _data.staticPhoto() + this.my_data.photo;
			},
			showKefu() {
				return this.my_data.id != 5880
			}
		},
		methods: {
			toScan() {
				// #ifdef H5
				uni.showToast({
					icon: 'none',
					title: '请使用APP打开'
				})
				// #endif
				// #ifdef APP-PLUS
				uni.scanCode({

				})
				// #endif
			},
			toHelp() {
				uni.navigateTo({
					url: '/pages/article/article'
				})
			},
			goPath(path) {
				console.log(1111)
				if (path) {
					uni.navigateTo({
						url: path,
					});
				}
			},
			goKefu() {
				this.$httpSend({
					path: '/im/get/kefu',
					success(data) {
						console.log('客服数据', data)
						uni.navigateTo({
							'url': '/pages/chat/message?list_id=' + data
						})
					}
				});
			},
			goScanCode() {
				// uni.navigateTo({
				//   url: '../chat/videoCall'
				// });
				let _this = this;
				uni.scanCode({
					success: function(res) {
						/** 验证必须是一个地址 */
						if (/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/.test(
								res.result)) {
							/** 本应用页面 */
							console.log(res.result);
							if (new RegExp(_data.data('http_url')).test(res.result)) {
								if (res.result.match(/\/([a-z]+_[a-z]+)\/(.+)$/) && RegExp.$1 && RegExp.$2) {
									switch (RegExp.$1) {
										case 'chat_add':
											uni.navigateTo({
												url: '/page/details/index?user_id=' + RegExp.$2 +
													'&is_type=3',
											});
											break;
										case 'group_add':
											let option = (RegExp.$2 + '').split('&');
											_this.$httpSend({
												path: '/im/message/addChat',
												data: {
													users: option[1],
													list_id: option[0],
													type: 1,
												},
												success_action: true,
												success(res) {
													let tips = res.err ? res.msg :
														'已经申请加入群聊,请耐心等待群管理审核';
													uni.showModal({
														content: tips,
														showCancel: false,
													});
												}
											});
											break;
										default:
											uni.showModal({
												content: '二维码内容：' + res.result,
												showCancel: false,
											});
											break;
									}
								} else {
									uni.showModal({
										content: '二维码内容：' + res.result,
										showCancel: false,
									});
								}
							} /** 打开新地址 */
							else {
								uni.navigateTo({
									url: '../push/web?url=' + encodeURIComponent(res.result),
								});
							}
						} else {
							uni.showModal({
								content: '二维码内容：' + res.result,
								showCancel: false,
							});
						}
					},
					fail(e) {
						console.log(e);
						return false;
						return;
						uni.showToast({
							title: '扫码错误：' + JSON.stringify(e),
							duration: 2000,
						});
					},
				});
			},
		},
		watch: {},
	}
</script>
<style>
	.uni-list-item .uni-list-item__container:after {
		position: absolute;
		z-index: 10;
		right: 0;
		bottom: 0;
		left: 16px;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: rgb(215, 215, 215) !important;
	}
</style>
<style>
	body {
		height: 100%;
	}

	.myPage {
		height: 100%;
		min-height: 100vh;
		background-color: #fff;
	}

	.iconfonts {
		position: absolute;
		right: 160rpx;
		bottom: 0px;
		font-size: 16px;
	}

	.header-msg {
		padding-left: 10px;
	}

	.phto {
		width: 106upx;
		height: 106upx;
		margin-left: 30 upx;
		margin-right: 30 upx;
	}

	.list {
		/* margin-top: 10upx; */
	}

	.qrcode {
		width: 50 upx;
		height: 50 upx;
		margin-right: -20 upx;
	}

	.my_padding {
		padding: 50px 15px 16px 15px;
		display: flex;
		background-color: #fff;
	}

	.uni-media-list-logo {
		padding: 2px;
		border-radius: 10px;
		height: 70px !important;
		width: 70px !important;
		margin-right: 0upx !important;
		margin-left: 0upx !important;
	}

	.my_padding:after {
		font-family: uniicons;
		content: '\e583';
		position: absolute;
		right: 15px;
		top: 15%;
		font-size: 24px;
		color: #bbb;
		-webkit-transform: translateY(-50%);
		transform: translateY(-50%);
	}

	.header-erw {
		position: absolute;
		right: 45px;
		top: 13%;
		font-size: 24px;
		width: 24px;
		height: 24px;
		z-index: 9999;
	}

	.uni-list {
		margin-bottom: 30 upx;
	}


	.uni-list-cell-navigate.uni-navigate-right:after {
		font-size: 20px !important;
	}

	.myTop {
		width: 100%;

		position: relative;
		background-color: #fff;
		padding-bottom: 10rpx;
	}

	.topBg {
		width: 100%;
		height: 296rpx;
		background: url('../../static/theme/default/my/user_icon_bg.webp') no-repeat 0 0;
		background-size: 100% 100%;
		display: flex;
		align-items: center;
		align-self: center;
		align-content: center;
		box-sizing: border-box;
		padding: 0 30rpx;
		position: relative;
	}

	.top-right-cion {
		position: absolute;
		height: 80rpx;
		display: flex;
		width: 100vw;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		top: 50%;
		right: 0;
		transform: translateY(-50%);
	}

	.top-right-cion image {
		width: 40rpx;
		height: 40rpx;
		margin-right: 30rpx;
	}

	.centerIcon {
		height: 40rpx;
		width: 100%;
		display: flex;
		justify-content: flex-end;

	}

	.centerIcon>.item {
		width: 40rpx;
		height: 40rpx;
		margin-left: 36rpx;
	}

	.headerImg {
		width: 166rpx;
		height: 166rpx;
		border-radius: 50%;
		box-shadow: 0 15upx 10upx #F2F2F2;
		position: absolute;
		left: 54rpx;
		top: 210rpx;
		overflow: hidden;
	}

	.headerImg>image {
		width: 100%;
		height: 100%;
	}

	.userName {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		align-items: center;
		box-sizing: border-box;
		padding: 0 62rpx;
		margin-top: 126rpx;
	}

	.userLf>text:first-child {
		font-size: 40rpx;
		color: #0A0E1A;
		text-align: left;
		font-weight: bold;
		display: block;
	}

	.userLf>text:last-child {
		font-size: 32rpx;
		color: #B0B0B3;
		text-align: left;
		display: block;

	}

	.header_erw {
		width: 42rpx;
		height: 42rpx;
		margin-right: 30upx;
	}

	.userRt {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		position: relative;
	}

	.userRt::after {
		font-family: uniicons;
		content: '\e583';
		position: absolute;
		right: -20rpx;
		top: -20rpx;
		font-size: 24px;
		color: rgb(187, 187, 187);
	}

	.circle {
		display: inline-block;
		height: 14upx;
		width: 14upx;
		padding: 0;
		border-radius: 50%;
		background-color: #F16858;
		margin-right: 10rpx;
	}

	.listOut {
		width: 100%;
		box-sizing: border-box;
		padding: 0 16rpx 0 24rpx;
		background-color: #fff;
	}
</style>
