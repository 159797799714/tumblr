<template>

	<view class="page">
		<!--  #ifdef  APP-PLUS -->
		<view class="topTitle">
			<view class="topFont">
				探索
			</view>
			<view class="topBG">
				<view class="bgCenter" @click="goPath('../push/circle')">
					<view class="bgLf">
						<image src="/static/img/ic_wb_xf.png" mode=""></image>
						<text>朋友圈</text>
					</view>

				</view>
			</view>
		</view>
		<!-- #endif -->
		<!-- #ifdef H5 || MP-WEIXIN-->
		<view class="topTitle">
			<view class="topFont">
				探索
			</view>
			<view class="topBG">
				<view class="bgCenter" @click="goPath('../push/circle')">
					<view class="bgLf">
						<image src="/static/img/ic_wb_xf.png" mode=""></image>
						<text>朋友圈</text>
					</view>

				</view>
			</view>
		</view>
		<!-- #endif -->
		<view class="listOut">


			<uni-list class="item-list">
				<!-- <uni-list-item title="扫一扫" class="item-list-item" :border="false" :show-arrow="true" :show-badge="true"
					badge-type="error" :showArrow="true" badge-text=" "
					thumb="/static/theme/default/push/icon_chat_top_encrypt.png" @click="goScanCode" />
				<!-- 	<uni-list-item title="默往声明" :show-arrow="false" :border="false" :show-badge="true" badge-type="error"
					:showArrow="true" thumb="/static/theme/default/push/icon_chat_top_screenshot.png"
					@click="goScanCode">
					
				</uni-list-item> -->
				<!--  #ifdef  APP-PLUS -->

				 <uni-list-item title="扫一扫" :show-arrow="false" :show-badge="false" badge-type="error" :showArrow="true"
				thumb="/static/theme/default/push/icon_chat_top_encrypt.png" @click="goScanCode" /> 
				<!-- #endif -->
				<uni-list-item title="短视频" :show-arrow="false" :show-badge="false" badge-type="error" :showArrow="true"
					thumb="../../static/img/shipin.png" @click="goPath('/pages/video/find')" />

				<uni-list-item title="一键群发" :show-arrow="false" :show-badge="false" badge-type="error" :showArrow="true"
					thumb="../../static/img/zf.png" @click="goPath('/pages/push/create_group')" />

				<!--自定义网址-->
				<uni-list-item :title="item.appName" v-if="list.length" v-for="(item,index) in list"
					z:show-arrow="false" :show-badge="false" badge-type="error" :showArrow="true"
					:thumb="domainUrl +item.logo_url"
					@click="goPath('web?url='+item.url+'&title='+item.appName+'&agent_user_id='+item.agent_user_id )" />
				<!--自定义网址-->
			</uni-list>
		</view>
		<!--<uni-list-item title="群发" style="background-color: white;border-bottom: none;"
			thumb="../../static/img/qunfa.png" @click="goPath('/pages/push/sendall')" />-->
		</uni-list>
		</uni-list>
	</view>

</template>

<script>
	import _hook from '../../common/_hook';
	import _data from '../../common/_data';
	import _get from '../../common/_get';
	import uniList from '../../components/uni-ui/uni-list/uni-list.vue';
	import uniListItem from '../../components/uni-ui/uni-list-item/uni-list-item.vue';
	import uniIcon from "../../components/uni-ui/uni-icon/uni-icon.vue"
	export default {
		components: {
			uniList,
			uniListItem,
			uniIcon
		},
		data() {
			return {
				list: [],
				show_tips: ''
			}
		},
		onShow() {
			let _this = this;
			_hook.routeTabBarHook();
			_get.getOnlineList({}, function(res) {
				_this.list = res
			});
			let num = _data.data('no_reader_circle_chat_num');
			/** 监听朋友圈动态提示 */
			uni.$on('data_circle_tips', function(data) {
				_this.show_tips = data;
			});
			if (num) {
				this.show_tips = num;
			} else if (_data.data('no_reader_circle')) {
				this.show_tips = '好友动态';
			} else {
				this.show_tips = '';
			}
		},
		onLoad() {

			// #ifdef APP-PLUS
			// #endif
		},
		computed: {
			domainUrl() {
				return _data.domainUrl();
			},
		},
		methods: {
			goPath(path) {
				if (path) {
					uni.navigateTo({
						url: path
					});
				}
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
	}
</script>
<style>
	.listOut .uni-badge-error {
		height: 14upx !important;
		width: 14upx !important;
		padding: 0 !important;
		border-radius: 50% !important;
	}

	body {
		height: 100%;
		background-color: #F7F7F7;
	}
</style>
<style scoped>
	.listOut {
		width: 100%;
		box-sizing: border-box;
		padding: 0 30rpx;
		margin-top: 30rpx;
	}


	.item-list {
		/* margin-top: 40upx; */
		background-color: #fff;
		border-radius: 20rpx;
	}

	.item-list-item {
		border: none;
	}

	.uni-list-item__container:after {
		background-color: #fff !important;
	}

	.topTitle {
		box-sizing: border-box;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		/* #ifdef APP-PLUS */
		padding-top: var(--status-bar-height);
		/* #endif */
		width: 100vw;
	}

	.topFont {
		font-size: 40rpx;
		color: #080E18;
		font-weight: bold;
		margin-left: 10rpx;
		margin-bottom: 10rpx;
	}

	.topBG {
		width: 100%;
		height: 223rpx;
		border-radius: 40rpx;
		background-color: #2C3554;
		display: flex;
		align-items: center;
		align-self: center;
		align-content: center;
		box-sizing: border-box;
		padding: 0 30rpx;
	}

	.bgCenter {
		flex: 1;
	}

	.bgLf {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		position: relative;
	}

	.bgLf:after {
		font-family: uniicons;
		content: '\e583';
		position: absolute;
		right: 0;
		top: -10rpx;
		font-size: 24px;
		color: #fff;

	}

	.bgLf>image {
		width: 60rpx;
		height: 60rpx;
	}

	.bgLf>text {
		color: #fff;
		font-size: 38rpx;
		margin-left: 20rpx;
		font-weight: bold;
	}
</style>
