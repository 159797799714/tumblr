<template>
	<view>
		<web-view v-if="!reload" class="custom-webview" :src="url" :webview-styles="{progress: {
						color: '#FF3333'
					}}"></web-view>
	</view>
</template>

<script>
	import _data from '../../common/_data';
	import _action from '@/common/_action.js'
	export default {
		data() {
			return {
				url: '',
				reload: false
			}
		},
		onShow() {
			// this.url = _data.data('bottom_url');
			// console.log(this.url);
			// this.getWebUrl();
			_action.getWebUrl();
			let _this = this;
			uni.$on('show_weburl', function(url) {
				_this.url = url;
			})

		},
		onLoad(option) {
			if ('url' in option) {
				option.url = decodeURIComponent(option.url);
				if (/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/.test(option.url)) {
					if (!/^http/.test(option.url)) {
						option.url = 'http://' + option.url;
					}
					this.url = option.url;
				}
			}
			if ('title' in option) {
				uni.setNavigationBarTitle({
					title: option.title,
				});
			}
			if ('agent_user_id' in option) {
				this.agent_user_id = option.agent_user_id;
			}
		},
		computed: {

		},
		methods: {
			getWebUrl() {
				let _this = this;
				this.$httpSend({
					path: '/im/middle.Middle/get_list',
					success: function(res) {
						console.log("res网站", res);
						let arr = res;
						let url = ''
						if (arr.length) {
							arr.forEach(item => {
								if (item.status == 1) {
									url = item.url;
									return
								}
							})
							if (!url) {
								uni.setTabBarItem({
									index: 2,
									visible: false
								})
							} else {
								_this.url = url;
							}
						} else {
							uni.setTabBarItem({
								index: 2,
								visible: false
							})
						}
					}
				})
			},
		},

		onNavigationBarButtonTap(e) {

			console.log(e.index)
			// #ifdef APP-PLUS
			let currentWebview = this.$mp.page.$getAppWebview().children()[0]; //获取当前页面的webview对象
			// #endif
			switch (e.index) {
				case 0:
					//跳转客服
					//pages/details/index?user_id=271&is_type=0
					// if (!this.agent_user_id) uni.showToast({
					// 	title: '改商户暂未设置客服',
					// 	icon: 'none'
					// });
					// uni.navigateTo({
					// 	url: '/pages/details/index?is_type=0&user_id=' + this.agent_user_id
					// });
					this.$httpSend({
						path: '/im/get/kefu',
						success(data) {
							console.log('客服数据', data)
							uni.navigateTo({
								'url': '/pages/chat/message?list_id=' + data
							})
						}
					});
					break;
				case 1:

					// #ifdef APP-PLUS
					currentWebview.reload();
					// #endif

			
					location.reload();
					let _this = this;
					_this.reload = true;
					setTimeout(() => {
						this.reload = false;
						_action.getWebUrl();
						let _this = this;
						uni.$on('show_weburl', function(url) {
							_this.url = url;
						})
					}, 10)
					

					break;
				case 2:

					uni.switchTab({
						url: '../push/game',
					});

					break;
				case 3:
					uni.navigateBack();
					break;
				default:
					break;
			}
		},
	}
</script>

<style>
	.custom-webview {
		flex: 1;
	}
</style>
